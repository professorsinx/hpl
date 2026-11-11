"use client";

import { useActionState } from "react";
import { CircleAlert, LoaderCircle, LogIn } from "lucide-react";
import { signIn } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className="adm-form">
      {state && !state.ok && (
        <p className="form-alert" role="alert">
          <CircleAlert size={16} aria-hidden="true" />
          {state.message}
        </p>
      )}
      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input id="login-email" name="email" type="email" autoComplete="username" inputMode="email" required autoFocus />
      </div>
      <div className="field">
        <label htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? <LoaderCircle size={16} className="spin" aria-hidden="true" /> : <LogIn size={16} aria-hidden="true" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
