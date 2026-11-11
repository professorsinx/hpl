"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page">
      <span className="section-kicker">RAIN DELAY</span>
      <h1>Something went <span>wrong.</span></h1>
      <p>The page hit an unexpected problem. Trying again usually sorts it out.</p>
      <button type="button" className="button button-lime" onClick={() => retry()}>
        <RotateCcw size={17} aria-hidden="true" /> Try again
      </button>
    </main>
  );
}
