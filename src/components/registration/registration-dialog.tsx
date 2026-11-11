"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import type { z } from "zod";
import QRCode from "react-qr-code";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  CircleAlert,
  Copy,
  ImagePlus,
  LoaderCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import { registerTeam, type RegistrationResult } from "@/app/actions/register";
import { formatInr, isPreviewRegistration, registrationPhase, site, upiPayLink } from "@/lib/site";
import {
  HOSPITAL_LOGO_TYPES,
  LOGO_MAX_BYTES,
  registrationSchema,
  registrationSteps,
  type RegistrationField,
  type RegistrationInput,
} from "@/lib/validation";

type RegistrationOutput = z.output<typeof registrationSchema>;
type Success = Extract<RegistrationResult, { ok: true }>;

const stepTitles = ["Hospital & team", "Captains", "Pay & confirm"];

const defaults: RegistrationInput = {
  hospital_name: "",
  hospital_address: "",
  team_name: "",
  captain_name: "",
  captain_phone: "",
  captain_email: "",
  vice_captain_name: "",
  vice_captain_phone: "",
  payment_utr: "",
  // The schema requires `true`; the unchecked starting state is intentional.
  eligibility_confirmed: false as unknown as true,
};

export function RegistrationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [phase] = useState(() => registrationPhase(Date.now()));
  const [step, setStep] = useState(0);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Success | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const form = useForm<RegistrationInput, unknown, RegistrationOutput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const { register, handleSubmit, trigger, setError, setFocus, reset, formState, control } = form;
  const { errors, isSubmitting, isDirty } = formState;

  const teamName = useWatch({ control, name: "team_name" });
  const payLink = upiPayLink({ note: `HPL 2027 ${teamName}`.trim() });

  // Start each step at the top of the scroll area.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step, success]);

  function close() {
    onOpenChange(false);
    if (success) {
      // Give the closing transition time to finish before clearing the form.
      window.setTimeout(() => {
        reset(defaults);
        setLogo(null);
        setStep(0);
        setSuccess(null);
        setFormError(null);
      }, 250);
    }
  }

  async function next() {
    const valid = await trigger(registrationSteps[step], { shouldFocus: true });
    if (valid && !logoError) setStep((current) => current + 1);
  }

  const submit = handleSubmit(async (values, event) => {
    setFormError(null);
    const data = new FormData();
    for (const [key, value] of Object.entries(values)) data.set(key, String(value));
    if (logo) data.set("hospital_logo", logo);
    const honeypot = (event?.target as HTMLFormElement | undefined)?.elements.namedItem("company_website");
    data.set("company_website", honeypot instanceof HTMLInputElement ? honeypot.value : "");

    let result: RegistrationResult;
    try {
      result = await registerTeam(data);
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again. Your details are still here.");
      return;
    }

    if (result.ok) {
      setSuccess(result);
      celebrate();
      return;
    }

    setFormError(result.message);
    const fieldErrors = result.fieldErrors ?? {};
    if (fieldErrors.hospital_logo) setLogoError(fieldErrors.hospital_logo);

    const fields = Object.keys(fieldErrors).filter((key) => key !== "hospital_logo") as RegistrationField[];
    for (const field of fields) setError(field, { type: "server", message: fieldErrors[field] });

    // Jump back to the earliest step that has a problem.
    const firstStep = registrationSteps.findIndex((group) => group.some((field) => fields.includes(field)));
    const target = fieldErrors.hospital_logo ? 0 : firstStep;
    if (target >= 0) {
      setStep(target);
      const first = registrationSteps[target].find((field) => fields.includes(field));
      if (first) window.setTimeout(() => setFocus(first), 60);
    }
  });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : close())}
      // Don't lose a half-filled form to a stray click on the backdrop.
      disablePointerDismissal={isDirty && !success}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="modal-backdrop" />
        <Dialog.Popup className="modal reg-modal">
          <header className="modal-head">
            <div>
              <span className="modal-kicker">HPL 2027 · TEAM ENTRY</span>
              <Dialog.Title className="modal-title">
                {success ? "You're on the list." : phase === "open" ? "Register your team" : "Team registration"}
              </Dialog.Title>
            </div>
            <Dialog.Close className="modal-close" aria-label="Close">
              <X size={18} aria-hidden="true" />
            </Dialog.Close>
          </header>

          {success ? (
            <SuccessPanel result={success} bodyRef={bodyRef} onDone={close} />
          ) : phase !== "open" ? (
            <ClosedPanel phase={phase} onDone={close} />
          ) : (
            <form onSubmit={submit} noValidate className="reg-form">
              <ol className="reg-steps" aria-label="Registration progress">
                {stepTitles.map((title, index) => (
                  <li key={title} data-state={index < step ? "done" : index === step ? "current" : "todo"} aria-current={index === step ? "step" : undefined}>
                    <span className="reg-step-dot">{index < step ? <Check size={13} aria-hidden="true" /> : index + 1}</span>
                    <span className="reg-step-label">{title}</span>
                  </li>
                ))}
              </ol>

              <div className="modal-body" ref={bodyRef}>
                {isPreviewRegistration && (
                  <p className="reg-preview-note">
                    <CalendarClock size={15} aria-hidden="true" />
                    Preview mode: on the live site this form unlocks on {site.registration.opensLabel}.
                  </p>
                )}

                {formError && (
                  <p className="form-alert" role="alert">
                    <CircleAlert size={16} aria-hidden="true" />
                    {formError}
                  </p>
                )}

                {/* Honeypot for bots; hidden from people and assistive tech. */}
                <div className="reg-hp" aria-hidden="true">
                  <label>
                    Company website
                    <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <fieldset hidden={step !== 0} className="reg-fieldset">
                  <legend className="sr-only">Hospital and team</legend>
                  <Field label="Hospital or institution" error={errors.hospital_name?.message} registration={register("hospital_name")} autoComplete="organization" placeholder="e.g. Harshamitra Hospital" />
                  <Field label="Hospital location" hint="Area and city" error={errors.hospital_address?.message} registration={register("hospital_address")} autoComplete="street-address" placeholder="e.g. Nagamangalam, Trichy" />
                  <Field label="Team name" hint="This appears on fixtures and the points table" error={errors.team_name?.message} registration={register("team_name")} placeholder="e.g. Harshamitra Hitters" />
                  <LogoPicker
                    file={logo}
                    error={logoError}
                    onChange={(file, error) => {
                      setLogo(file);
                      setLogoError(error);
                    }}
                  />
                </fieldset>

                <fieldset hidden={step !== 1} className="reg-fieldset">
                  <legend className="sr-only">Captain and vice-captain</legend>
                  <h3 className="reg-group-title">Captain</h3>
                  <Field label="Full name" error={errors.captain_name?.message} registration={register("captain_name")} autoComplete="name" />
                  <div className="reg-row">
                    <Field label="Mobile number" error={errors.captain_phone?.message} registration={register("captain_phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit number" />
                    <Field label="Email" error={errors.captain_email?.message} registration={register("captain_email")} type="email" inputMode="email" autoComplete="email" placeholder="name@hospital.com" />
                  </div>
                  <h3 className="reg-group-title">Vice-captain</h3>
                  <div className="reg-row">
                    <Field label="Full name" error={errors.vice_captain_name?.message} registration={register("vice_captain_name")} autoComplete="off" />
                    <Field label="Mobile number" optional error={errors.vice_captain_phone?.message} registration={register("vice_captain_phone")} type="tel" inputMode="tel" autoComplete="off" placeholder="10-digit number" />
                  </div>
                  <p className="reg-footnote">
                    We&apos;ll use these details only to confirm your entry and share fixtures. Your full squad of 11 + 2 is collected by the organisers after your payment is verified.
                  </p>
                </fieldset>

                <fieldset hidden={step !== 2} className="reg-fieldset">
                  <legend className="sr-only">Payment</legend>
                  <PaymentPanel payLink={payLink} />
                  <Field
                    label="UPI reference number (UTR)"
                    hint="The 12-digit number shown in your UPI app after paying"
                    error={errors.payment_utr?.message}
                    registration={register("payment_utr")}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="e.g. 412345678901"
                    maxLength={14}
                    className="reg-utr"
                  />
                  <label className="reg-check">
                    <input type="checkbox" {...register("eligibility_confirmed")} aria-invalid={Boolean(errors.eligibility_confirmed)} />
                    <span>
                      Every player on our team is a current employee of our hospital and will carry hospital ID on match days.
                      {errors.eligibility_confirmed && <em role="alert">{errors.eligibility_confirmed.message}</em>}
                    </span>
                  </label>
                </fieldset>
              </div>

              <footer className="modal-foot">
                {step > 0 ? (
                  <button type="button" className="btn btn-ghost" onClick={() => setStep((current) => current - 1)} disabled={isSubmitting}>
                    <ArrowLeft size={16} aria-hidden="true" /> Back
                  </button>
                ) : (
                  <span className="modal-foot-note">Step 1 of 3 · takes about 3 minutes</span>
                )}
                {step < 2 ? (
                  // Distinct keys: without them React would reuse this DOM node as the
                  // submit button mid-click and the browser would submit the form.
                  <button key="continue" type="button" className="btn btn-primary" onClick={next}>
                    Continue <ArrowRight size={16} aria-hidden="true" />
                  </button>
                ) : (
                  <button key="submit" type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoaderCircle size={16} className="spin" aria-hidden="true" /> Submitting…
                      </>
                    ) : (
                      <>
                        Submit registration <Check size={16} aria-hidden="true" />
                      </>
                    )}
                  </button>
                )}
              </footer>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* Pieces ────────────────────────────────────────────────────────────────── */

type FieldProps = {
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  registration: UseFormRegisterReturn;
  className?: string;
} & Pick<React.ComponentProps<"input">, "type" | "inputMode" | "autoComplete" | "placeholder" | "maxLength">;

function Field({ label, hint, optional, error, registration, className, type = "text", ...input }: FieldProps) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className ? `field ${className}` : "field"}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="field-optional">Optional</span>}
      </label>
      <input id={id} type={type} aria-invalid={Boolean(error)} aria-describedby={describedBy} {...input} {...registration} />
      {hint && !error && (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function LogoPicker({ file, error, onChange }: { file: File | null; error: string | null; onChange: (file: File | null, error: string | null) => void }) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function pick(candidate: File | undefined) {
    if (!candidate) return;
    if (!HOSPITAL_LOGO_TYPES.includes(candidate.type)) return onChange(null, "Upload a PNG, JPG or WebP image.");
    if (candidate.size > LOGO_MAX_BYTES) return onChange(null, "The logo must be 2 MB or smaller.");
    onChange(candidate, null);
  }

  return (
    <div className="field">
      <label htmlFor={id}>
        Hospital logo <span className="field-optional">Optional</span>
      </label>
      <div className="logo-picker" data-has-file={Boolean(file)}>
        <span className="logo-preview">
          {/* A local object URL: next/image cannot optimise it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {preview ? <img src={preview} alt="Selected logo preview" /> : <ImagePlus size={22} aria-hidden="true" />}
        </span>
        <div className="logo-picker-copy">
          <strong>{file ? file.name : "Add your hospital's logo"}</strong>
          <span>{file ? `${Math.max(1, Math.round(file.size / 1024))} KB` : "PNG, JPG or WebP, up to 2 MB. Shown on fixtures and scorecards."}</span>
        </div>
        <input
          ref={inputRef}
          id={id}
          className="sr-only"
          type="file"
          accept={HOSPITAL_LOGO_TYPES.join(",")}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => {
            pick(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <button type="button" className="btn btn-outline btn-small" onClick={() => inputRef.current?.click()}>
          {file ? "Replace" : "Choose file"}
        </button>
        {file && (
          <button type="button" className="icon-btn" aria-label="Remove logo" onClick={() => onChange(null, null)}>
            <Trash2 size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function PaymentPanel({ payLink }: { payLink: string | null }) {
  const [copied, setCopied] = useState(false);
  const { upiId, payeeName } = site.payment;

  if (!payLink) {
    return (
      <div className="pay-card pay-card-fallback">
        <strong>Entry fee · {formatInr(site.entryFee)}</strong>
        <p>
          Online payment details aren&apos;t available yet. Call {site.contacts.registration.name} on{" "}
          <a href={`tel:${site.contacts.registration.phone}`}>{site.contacts.registration.display}</a> for the UPI ID, pay, then enter the reference number below.
        </p>
      </div>
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the ID is selectable on screen.
    }
  }

  return (
    <div className="pay-card">
      <div className="pay-summary">
        <span>Team entry fee</span>
        <strong>{formatInr(site.entryFee)}</strong>
        <small>Paid to {payeeName}</small>
      </div>

      <div className="pay-methods">
        <div className="pay-qr">
          <div className="pay-qr-code">
            <QRCode value={payLink} size={132} bgColor="#ffffff" fgColor="#0c211d" level="M" aria-label="UPI payment QR code" />
          </div>
          <p>Scan with any UPI app</p>
        </div>

        <ol className="pay-instructions">
          <li>
            <a className="btn btn-upi" href={payLink}>
              <Smartphone size={17} aria-hidden="true" /> Open UPI app to pay
            </a>
            <span className="pay-or">On a computer? Scan the QR code with your phone.</span>
          </li>
          <li>
            <span className="pay-id-label">Or pay to this UPI ID</span>
            <span className="pay-id">
              <code>{upiId}</code>
              <button type="button" className="icon-btn" onClick={copy} aria-label="Copy UPI ID">
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
              </button>
            </span>
            <span className="sr-only" aria-live="polite">
              {copied ? "UPI ID copied" : ""}
            </span>
          </li>
        </ol>
      </div>

      <p className="pay-trust">
        <ShieldCheck size={15} aria-hidden="true" />
        You pay inside your own UPI app. This site never sees your PIN or bank details.
      </p>
    </div>
  );
}

function SuccessPanel({ result, bodyRef, onDone }: { result: Success; bodyRef: React.RefObject<HTMLDivElement | null>; onDone: () => void }) {
  const { registration } = site.contacts;
  return (
    <>
      <div className="modal-body reg-success" ref={bodyRef}>
        <span className="reg-success-icon">
          <Check size={28} aria-hidden="true" />
        </span>
        <Dialog.Description className="reg-success-lead">
          {result.teamName ? <strong>{result.teamName}</strong> : "Your team"} is registered, pending payment verification.
        </Dialog.Description>
        <dl className="reg-reference">
          <dt>Registration reference</dt>
          <dd>{result.reference}</dd>
        </dl>
        <ol className="reg-next">
          <NextStep title="We verify your payment">The treasurer matches your UPI reference, usually within two working days.</NextStep>
          <NextStep title="You get a confirmation call">The organising secretary confirms your entry and collects your squad of 11 + 2.</NextStep>
          <NextStep title="Fixtures on 30 January">The schedule is published here and shared with every captain.</NextStep>
        </ol>
        <p className="reg-footnote">
          Keep a screenshot of this reference. Questions? Call {registration.name} on{" "}
          <a href={`tel:${registration.phone}`}>{registration.display}</a>.
        </p>
      </div>
      <footer className="modal-foot">
        <span className="modal-foot-note">See you on the field.</span>
        <button type="button" className="btn btn-primary" onClick={onDone}>
          Done
        </button>
      </footer>
    </>
  );
}

function NextStep({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li>
      <strong>{title}</strong>
      <span>{children}</span>
    </li>
  );
}

function ClosedPanel({ phase, onDone }: { phase: "upcoming" | "closed"; onDone: () => void }) {
  const { registration } = site.contacts;
  return (
    <>
      <div className="modal-body reg-closed">
        <span className="reg-success-icon reg-closed-icon">
          <CalendarClock size={26} aria-hidden="true" />
        </span>
        <Dialog.Description className="reg-success-lead">
          {phase === "upcoming" ? (
            <>
              Online registration opens on <strong>{site.registration.opensLabel}</strong> and closes on {site.registration.closesLabel}.
            </>
          ) : (
            <>
              Registration for HPL 2027 closed on <strong>{site.registration.closesLabel}</strong>.
            </>
          )}
        </Dialog.Description>
        <p className="reg-footnote">
          {phase === "upcoming"
            ? `Get your squad of 11 + 2 ready, keep the ${formatInr(site.entryFee)} entry fee handy, and come back on the day. Want a head start?`
            : "If you believe your team should still be considered, speak to the organisers."}
        </p>
        <a className="btn btn-outline" href={`tel:${registration.phone}`}>
          <Phone size={16} aria-hidden="true" /> Call {registration.name} · {registration.display}
        </a>
      </div>
      <footer className="modal-foot">
        <span className="modal-foot-note">Entry fee · {formatInr(site.entryFee)} per team</span>
        <button type="button" className="btn btn-primary" onClick={onDone}>
          Got it
        </button>
      </footer>
    </>
  );
}

async function celebrate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  const colors = ["#d3f25a", "#e79ab4", "#f7f8f2", "#46b7a8"];
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.62 }, colors, zIndex: 200 });
  window.setTimeout(() => confetti({ particleCount: 50, spread: 110, origin: { y: 0.55 }, colors, zIndex: 200 }), 220);
}
