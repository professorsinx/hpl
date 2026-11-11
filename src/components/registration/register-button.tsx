"use client";

import type { ReactNode } from "react";
import { useRegistration } from "./registration-provider";

export function RegisterButton({ className, children }: { className?: string; children: ReactNode }) {
  const { openRegistration } = useRegistration();
  return (
    <button type="button" className={className} onClick={openRegistration}>
      {children}
    </button>
  );
}
