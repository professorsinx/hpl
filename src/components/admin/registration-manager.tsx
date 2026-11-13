"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Download, IndianRupee, LoaderCircle, Mail, Phone, RotateCcw, Search, X } from "lucide-react";
import { decideRegistration, saveRegistrationNote } from "@/app/admin/actions";
import { formatInr, site } from "@/lib/site";
import type { PaymentStatus, RegistrationStatus, Team } from "@/types/database";
import { PageHead } from "./page-head";
import { useNotify } from "./toast";

export type RegistrationRow = Team & { reference: string; submitted: string; logoUrl: string | null };

type Filter = "all" | RegistrationStatus;

const statusLabel: Record<RegistrationStatus, string> = {
  pending_verification: "Pending",
  verified: "Verified",
  rejected: "Rejected",
};

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending_verification", label: "Pending" },
  { id: "verified", label: "Verified" },
  { id: "rejected", label: "Rejected" },
];

const paymentLabel: Record<PaymentStatus, string> = {
  submitted: "Awaiting verification",
  verified: "Verified",
  failed: "Rejected",
};

type Column = [string, (row: RegistrationRow) => string | number | null];

/** One row per payment, keyed by its transaction ID (unique in the database). */
const paymentColumns: Column[] = [
  ["Transaction ID (UTR)", (row) => row.payment_utr],
  ["Amount (INR)", (row) => row.entry_fee_amount],
  ["Payment status", (row) => paymentLabel[row.payment_status]],
  ["Paid on (IST)", (row) => row.submitted],
  ["Team", (row) => row.team_name],
  ["Hospital", (row) => row.hospital_name],
  ["Paid by (captain)", (row) => row.captain_name],
  ["Captain phone", (row) => row.captain_phone],
  ["Captain email", (row) => row.captain_email],
  ["Registration reference", (row) => row.reference],
  ["Notes", (row) => row.admin_notes],
];

const registrationColumns: Column[] = [
  ["Reference", (row) => row.reference],
  ["Submitted (IST)", (row) => row.submitted],
  ["Team", (row) => row.team_name],
  ["Hospital", (row) => row.hospital_name],
  ["Location", (row) => row.hospital_address],
  ["Captain", (row) => row.captain_name],
  ["Captain phone", (row) => row.captain_phone],
  ["Captain email", (row) => row.captain_email],
  ["Vice-captain", (row) => row.vice_captain_name],
  ["Vice-captain phone", (row) => row.vice_captain_phone],
  ["UPI reference (UTR)", (row) => row.payment_utr],
  ["Amount", (row) => row.entry_fee_amount],
  ["Status", (row) => statusLabel[row.registration_status]],
  ["Notes", (row) => row.admin_notes],
];

function toCsv(rows: RegistrationRow[], columns: Column[]) {
  const escape = (value: string | number | null) => {
    let text = String(value ?? "");
    // Neutralise spreadsheet formulas in visitor-supplied text.
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return [columns.map(([name]) => escape(name)).join(","), ...rows.map((row) => columns.map(([, read]) => escape(read(row))).join(","))].join("\r\n");
}

export function RegistrationManager({ rows }: { rows: RegistrationRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const tally: Record<Filter, number> = { all: rows.length, pending_verification: 0, verified: 0, rejected: 0 };
    for (const row of rows) tally[row.registration_status]++;
    return tally;
  }, [rows]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter !== "all" && row.registration_status !== filter) return false;
      if (!needle) return true;
      return [row.team_name, row.hospital_name, row.captain_name, row.captain_phone, row.payment_utr, row.reference]
        .some((value) => value.toLowerCase().includes(needle));
    });
  }, [rows, filter, query]);

  function download(name: string, csv: string) {
    // The BOM makes Excel read the file as UTF-8.
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Every payment ever submitted, whatever the list is filtered to.
  const downloadPayments = () =>
    download(
      "hpl-2027-payments.csv",
      toCsv([...rows].sort((a, b) => a.payment_utr.localeCompare(b.payment_utr)), paymentColumns),
    );

  return (
    <>
      <PageHead
        title="Registrations"
        action={
          <div className="adm-head-actions">
            <button type="button" className="btn btn-primary" onClick={downloadPayments} disabled={rows.length === 0}>
              <IndianRupee size={16} aria-hidden="true" /> Payments report
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => download("hpl-2027-registrations.csv", toCsv(visible, registrationColumns))}
              disabled={visible.length === 0}
            >
              <Download size={16} aria-hidden="true" /> Export teams
            </button>
          </div>
        }
      >
        Match each UPI reference against the bank statement, then verify the team. {formatInr(counts.verified * site.entryFee)} verified so far.
      </PageHead>

      <div className="adm-toolbar">
        <div className="adm-tabs" role="group" aria-label="Filter by status">
          {filters.map(({ id, label }) => (
            <button key={id} type="button" className="chip" aria-pressed={filter === id} onClick={() => setFilter(id)}>
              {label} <span>{counts[id]}</span>
            </button>
          ))}
        </div>
        <label className="adm-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search registrations</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search team, hospital, phone or UTR" />
        </label>
      </div>

      {rows.length === 0 ? (
        <div className="adm-empty">
          <h2>No registrations yet</h2>
          <p>Teams appear here the moment they submit the registration form on the website.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="adm-empty">
          <h2>Nothing matches</h2>
          <p>Try a different search or status filter.</p>
        </div>
      ) : (
        <ul className="adm-reg-list">
          {visible.map((row) => (
            <RegistrationCard key={row.id} row={row} />
          ))}
        </ul>
      )}
    </>
  );
}

function RegistrationCard({ row }: { row: RegistrationRow }) {
  const notify = useNotify();
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState(row.admin_notes ?? "");
  const status = row.registration_status;

  const decide = (decision: "verify" | "reject" | "reset") =>
    startTransition(async () => notify(await decideRegistration(row.id, decision)));

  return (
    <li className="adm-reg" data-status={status}>
      <div className="adm-reg-head">
        <span className="adm-reg-logo">
          {/* Visitor-uploaded logo of unknown size; shown as a small thumbnail only. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {row.logoUrl ? <img src={row.logoUrl} alt="" loading="lazy" /> : row.team_name.slice(0, 2).toUpperCase()}
        </span>
        <div className="adm-reg-title">
          <strong>{row.team_name}</strong>
          <span>{row.hospital_name}{row.hospital_address ? ` · ${row.hospital_address}` : ""}</span>
        </div>
        <span className="adm-badge" data-tone={status}>{statusLabel[status]}</span>
      </div>

      <dl className="adm-reg-facts">
        <div>
          <dt>UPI reference (UTR)</dt>
          <dd><code>{row.payment_utr}</code><span>{formatInr(row.entry_fee_amount)} entry fee</span></dd>
        </div>
        <div>
          <dt>Captain</dt>
          <dd>
            {row.captain_name}
            <a href={`tel:+91${row.captain_phone}`}><Phone size={13} aria-hidden="true" /> {row.captain_phone}</a>
            <a href={`mailto:${row.captain_email}`}><Mail size={13} aria-hidden="true" /> {row.captain_email}</a>
          </dd>
        </div>
        <div>
          <dt>Vice-captain</dt>
          <dd>
            {row.vice_captain_name}
            {row.vice_captain_phone && (
              <a href={`tel:+91${row.vice_captain_phone}`}><Phone size={13} aria-hidden="true" /> {row.vice_captain_phone}</a>
            )}
          </dd>
        </div>
        <div>
          <dt>Submitted</dt>
          <dd>{row.submitted} · {row.reference}</dd>
        </div>
      </dl>

      <div className="adm-reg-foot">
        <label className="sr-only" htmlFor={`note-${row.id}`}>Internal note</label>
        <input
          id={`note-${row.id}`}
          className="adm-note"
          value={note}
          maxLength={1000}
          placeholder="Internal note (only organisers see this)"
          onChange={(event) => setNote(event.target.value)}
          onBlur={() => {
            if (note.trim() !== (row.admin_notes ?? "")) startTransition(async () => notify(await saveRegistrationNote(row.id, note)));
          }}
        />
        <div className="adm-row-actions">
          {pending && <LoaderCircle size={16} className="spin" aria-hidden="true" />}
          {status !== "verified" && (
            <button type="button" className="btn btn-primary btn-small" disabled={pending} onClick={() => decide("verify")}>
              <Check size={15} aria-hidden="true" /> Verify payment
            </button>
          )}
          {status !== "rejected" && (
            <button type="button" className="btn btn-ghost btn-small" disabled={pending} onClick={() => decide("reject")}>
              <X size={15} aria-hidden="true" /> Reject
            </button>
          )}
          {status !== "pending_verification" && (
            <button type="button" className="btn btn-ghost btn-small" disabled={pending} onClick={() => decide("reset")}>
              <RotateCcw size={15} aria-hidden="true" /> Back to pending
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
