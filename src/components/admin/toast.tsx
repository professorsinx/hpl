"use client";

import { createContext, use, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, CircleAlert } from "lucide-react";

type Toast = { id: number; ok: boolean; message: string };
type Notify = (result: { ok: boolean; message: string } | null | undefined) => void;

const ToastContext = createContext<Notify | null>(null);

/** Report the result of a Server Action to the organiser. */
export function useNotify() {
  const notify = use(ToastContext);
  if (!notify) throw new Error("useNotify must be used inside <ToastProvider>");
  return notify;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const notify = useCallback<Notify>((result) => {
    if (!result) return;
    const id = nextId.current++;
    setToasts((current) => [...current.slice(-2), { id, ...result }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), result.ok ? 3500 : 7000);
  }, []);

  const value = useMemo(() => notify, [notify]);

  return (
    <ToastContext value={value}>
      {children}
      <div className="adm-toasts" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <p key={toast.id} className="adm-toast" data-ok={toast.ok}>
            {toast.ok ? <Check size={16} aria-hidden="true" /> : <CircleAlert size={16} aria-hidden="true" />}
            {toast.message}
          </p>
        ))}
      </div>
    </ToastContext>
  );
}
