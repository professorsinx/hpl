"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Wraps the scene picker with a play/pause control. Appending `#t=1.5` to the
 * URL freezes every scene 1.5 seconds into its loop, which is handy for
 * comparing exact frames.
 */
export function SceneLab({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [freezeAt, setFreezeAt] = useState<number | null>(null);

  useEffect(() => {
    const read = () => {
      const match = /^#t=(\d+(?:\.\d+)?)$/.exec(window.location.hash);
      setFreezeAt(match ? Number(match[1]) : null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const frozen = freezeAt !== null;

  return (
    <div
      className={frozen ? "scene-frozen" : paused ? "scene-paused" : undefined}
      style={frozen ? ({ "--freeze-at": `${freezeAt}s` } as CSSProperties) : undefined}
    >
      <div className="lab-toolbar">
        <button type="button" className="lab-toggle" onClick={() => setPaused((value) => !value)} disabled={frozen} aria-pressed={paused}>
          {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
          {paused ? "Play animations" : "Pause animations"}
        </button>
        {frozen && <span className="lab-frozen">Frozen at {freezeAt}s · remove #t from the URL to resume</span>}
      </div>
      {children}
    </div>
  );
}
