"use client";

import { useActionState, useState, useTransition } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { CircleAlert, Eye, EyeOff, LoaderCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { deleteSponsor, saveSponsor, setSponsorPublished, type ActionState } from "@/app/admin/actions";
import { SponsorLogo } from "@/components/sponsors/sponsor-logo";
import { sponsorTiers, tierLabel } from "@/lib/sponsor-tiers";
import { SPONSOR_LOGO_TYPES } from "@/lib/validation";
import type { Sponsor } from "@/types/database";
import { ConfirmButton } from "./confirm-button";
import { PageHead } from "./page-head";
import { useNotify } from "./toast";

type Editing = { sponsor: Sponsor | null } | null;

export function SponsorManager({ sponsors }: { sponsors: Sponsor[] }) {
  const notify = useNotify();
  const [editing, setEditing] = useState<Editing>(null);
  const [, startTransition] = useTransition();

  return (
    <>
      <PageHead
        title="Sponsors"
        action={
          <button type="button" className="btn btn-primary" onClick={() => setEditing({ sponsor: null })}>
            <Plus size={16} aria-hidden="true" /> Add sponsor
          </button>
        }
      >
        Logos and descriptions for the scrolling band on the home page and the sponsors page. Changes go live immediately.
      </PageHead>

      {sponsors.length === 0 ? (
        <div className="adm-empty">
          <h2>No sponsors yet</h2>
          <p>Add the first one and it will appear in the home page band and on /sponsors straight away.</p>
          <button type="button" className="btn btn-primary" onClick={() => setEditing({ sponsor: null })}>
            <Plus size={16} aria-hidden="true" /> Add sponsor
          </button>
        </div>
      ) : (
        <ul className="adm-list">
          {sponsors.map((sponsor) => (
            <li key={sponsor.id} className="adm-row" data-muted={!sponsor.is_published || undefined}>
              <span className="adm-row-logo">
                <SponsorLogo sponsor={sponsor} />
              </span>
              <div className="adm-row-main">
                <strong>{sponsor.name}</strong>
                <span>{sponsor.tagline || sponsor.description || "No description yet"}</span>
              </div>
              <span className="adm-badge" data-tone={sponsor.tier}>{tierLabel(sponsor.tier)}</span>
              <span className="adm-badge" data-tone={sponsor.is_published ? "live" : "hidden"}>
                {sponsor.is_published ? "Live" : "Hidden"}
              </span>
              <div className="adm-row-actions">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={sponsor.is_published ? `Hide ${sponsor.name} from the site` : `Publish ${sponsor.name}`}
                  title={sponsor.is_published ? "Hide from the site" : "Publish"}
                  onClick={() => startTransition(async () => notify(await setSponsorPublished(sponsor.id, !sponsor.is_published)))}
                >
                  {sponsor.is_published ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
                <button type="button" className="icon-btn" aria-label={`Edit ${sponsor.name}`} title="Edit" onClick={() => setEditing({ sponsor })}>
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <ConfirmButton
                  className="icon-btn icon-btn-danger"
                  label={`Delete ${sponsor.name}`}
                  title={`Delete ${sponsor.name}?`}
                  description="The sponsor and its logo are removed from the website. This can't be undone."
                  confirmLabel="Delete sponsor"
                  onConfirm={async () => notify(await deleteSponsor(sponsor.id))}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </ConfirmButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog.Root open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} disablePointerDismissal>
        <Dialog.Portal>
          <Dialog.Backdrop className="modal-backdrop" />
          <Dialog.Popup className="modal">
            {editing && (
              <SponsorForm
                // Remount per sponsor so the form never shows another sponsor's values.
                key={editing.sponsor?.id ?? "new"}
                sponsor={editing.sponsor}
                onSaved={(result) => {
                  notify(result);
                  setEditing(null);
                }}
              />
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function SponsorForm({ sponsor, onSaved }: { sponsor: Sponsor | null; onSaved: (result: ActionState) => void }) {
  const [state, action, pending] = useActionState(async (previous: ActionState, formData: FormData) => {
    const result = await saveSponsor(previous, formData);
    if (result?.ok) onSaved(result);
    return result;
  }, null);
  const [descriptionLength, setDescriptionLength] = useState(sponsor?.description.length ?? 0);
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={action} className="adm-modal-form">
      <header className="modal-head">
        <div>
          <span className="modal-kicker">SPONSOR</span>
          <Dialog.Title className="modal-title">{sponsor ? `Edit ${sponsor.name}` : "Add a sponsor"}</Dialog.Title>
        </div>
        <Dialog.Close className="modal-close" aria-label="Close">
          <X size={18} aria-hidden="true" />
        </Dialog.Close>
      </header>

      <div className="modal-body">
        {state && !state.ok && (
          <p className="form-alert" role="alert">
            <CircleAlert size={16} aria-hidden="true" />
            {state.message}
          </p>
        )}
        {sponsor && <input type="hidden" name="id" value={sponsor.id} />}

        <div className="field">
          <label htmlFor="sponsor-name">Name</label>
          <input id="sponsor-name" name="name" defaultValue={sponsor?.name} required maxLength={120} aria-invalid={Boolean(errors.name)} />
          {errors.name && <p className="field-error" role="alert">{errors.name}</p>}
        </div>

        <div className="reg-row">
          <div className="field">
            <label htmlFor="sponsor-tier">Sponsorship tier</label>
            <select id="sponsor-tier" name="tier" defaultValue={sponsor?.tier ?? "supporter"}>
              {sponsorTiers.map((tier) => (
                <option key={tier.id} value={tier.id}>{tier.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sponsor-order">Order within tier</label>
            <input id="sponsor-order" name="sort_order" type="number" min={0} max={9999} defaultValue={sponsor?.sort_order ?? 0} aria-invalid={Boolean(errors.sort_order)} />
            <p className="field-hint">Lower numbers appear first.</p>
          </div>
        </div>

        <div className="field">
          <label htmlFor="sponsor-logo">Logo</label>
          {sponsor?.logo_path && (
            <div className="adm-current-logo">
              <SponsorLogo sponsor={sponsor} />
              <label className="adm-inline-check">
                <input type="checkbox" name="remove_logo" /> Remove current logo
              </label>
            </div>
          )}
          <input id="sponsor-logo" name="logo" type="file" accept={SPONSOR_LOGO_TYPES.join(",")} aria-invalid={Boolean(errors.logo)} />
          {errors.logo ? (
            <p className="field-error" role="alert">{errors.logo}</p>
          ) : (
            <p className="field-hint">PNG, JPG, WebP or SVG, up to 2 MB. A transparent background looks best. Without a logo, the name is shown instead.</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="sponsor-tagline">Tagline <span className="field-optional">Optional</span></label>
          <input id="sponsor-tagline" name="tagline" defaultValue={sponsor?.tagline ?? ""} maxLength={160} placeholder="One line, e.g. Multi-speciality care in the heart of Trichy" />
          {errors.tagline && <p className="field-error" role="alert">{errors.tagline}</p>}
        </div>

        <div className="field">
          <label htmlFor="sponsor-description">Description</label>
          <textarea
            id="sponsor-description"
            name="description"
            rows={6}
            maxLength={4000}
            defaultValue={sponsor?.description ?? ""}
            onChange={(event) => setDescriptionLength(event.target.value.length)}
            placeholder="About the hospital or organisation. Shown on the sponsors page; blank lines start a new paragraph."
            aria-invalid={Boolean(errors.description)}
          />
          <p className="field-hint">{descriptionLength.toLocaleString("en-IN")} / 4,000 characters</p>
        </div>

        <div className="field">
          <label htmlFor="sponsor-website">Website <span className="field-optional">Optional</span></label>
          <input id="sponsor-website" name="website_url" defaultValue={sponsor?.website_url ?? ""} inputMode="url" placeholder="https://" aria-invalid={Boolean(errors.website_url)} />
          {errors.website_url && <p className="field-error" role="alert">{errors.website_url}</p>}
        </div>

        <label className="adm-inline-check">
          <input type="checkbox" name="is_published" defaultChecked={sponsor?.is_published ?? true} /> Show on the website
        </label>
      </div>

      <footer className="modal-foot">
        <Dialog.Close className="btn btn-ghost" disabled={pending}>Cancel</Dialog.Close>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending && <LoaderCircle size={16} className="spin" aria-hidden="true" />}
          {pending ? "Saving…" : sponsor ? "Save changes" : "Add sponsor"}
        </button>
      </footer>
    </form>
  );
}
