"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const RegistrationDialog = dynamic(() => import("./registration-dialog").then((module) => module.RegistrationDialog), {
  ssr: false,
});

type RegistrationContextValue = { openRegistration: () => void };

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function useRegistration() {
  const value = use(RegistrationContext);
  if (!value) throw new Error("useRegistration must be used inside <RegistrationProvider>");
  return value;
}

/**
 * Owns the single registration dialog for the public site. The dialog's code
 * is only downloaded the first time someone opens it.
 */
export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  const openRegistration = useCallback(() => {
    setEverOpened(true);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openRegistration }), [openRegistration]);

  return (
    <RegistrationContext value={value}>
      {children}
      {everOpened && <RegistrationDialog open={open} onOpenChange={setOpen} />}
    </RegistrationContext>
  );
}
