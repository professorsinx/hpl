"use client";

import { useState, useTransition, type ReactNode } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { LoaderCircle } from "lucide-react";

type ConfirmButtonProps = {
  className?: string;
  label: string;
  children: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
};

/** A destructive action that asks first. */
export function ConfirmButton({ className, label, children, title, description, confirmLabel, onConfirm }: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger className={className} aria-label={label}>
        {children}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="modal-backdrop" />
        <AlertDialog.Popup className="modal modal-confirm">
          <div className="modal-body">
            <AlertDialog.Title className="modal-title">{title}</AlertDialog.Title>
            <AlertDialog.Description className="modal-description">{description}</AlertDialog.Description>
          </div>
          <footer className="modal-foot">
            <AlertDialog.Close className="btn btn-ghost" disabled={pending}>
              Cancel
            </AlertDialog.Close>
            <button
              type="button"
              className="btn btn-danger"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await onConfirm();
                  setOpen(false);
                })
              }
            >
              {pending && <LoaderCircle size={16} className="spin" aria-hidden="true" />}
              {confirmLabel}
            </button>
          </footer>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
