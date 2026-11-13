import type { CSSProperties } from "react";
import { Sprite, team } from "./pixel-roster";
import "@/styles/cause.css";

/**
 * Pixel-art pieces about the cause HPL plays for, drawn in the same sprite
 * style as the umpire and the roster. Pure SVG and CSS; still under reduced
 * motion.
 */

const ribbon = [
  "....PPPP....",
  "...PPPPPP...",
  "..PPP..PPP..",
  "..PP....PP..",
  "..PP....PP..",
  "..PPP..PPP..",
  "...PPPPPP...",
  "....pppp....",
  "....pppp....",
  "...PPPPPP...",
  "..PPP..PPP..",
  ".PPP....PPP.",
  ".PP......PP.",
  "PPP......PPP",
  "PP........PP",
];

const heart = [
  ".PP.PP.",
  "PPPPPPP",
  "PPPPPPP",
  ".PPPPP.",
  "..PPP..",
  "...P...",
];

const calendar = [
  "...B......B...",
  ".PPPPPPPPPPPP.",
  ".PPPPPPPPPPPP.",
  ".WWWWWWWWWWWW.",
  ".WWWEWWEWWWWW.",
  ".WWWEWWEWWWWW.",
  ".WWWEWWEWWWWW.",
  ".WWWEEEEEWWWW.",
  ".WWWWWWEWWWWW.",
  ".WWWWWWEWWWWW.",
  ".WWWWWWWWWWWW.",
  ".GGGGGGGGGGGG.",
];

const byRole = (role: string) => team.find((member) => member.role === role)!.sprite;

const messages = ["Early detection saves lives", "No one fights alone", "4 Feb · World Cancer Day"];

/** Four colleagues standing around the awareness ribbon. Used in "Play together. Stand together." */
export function PixelRibbon() {
  const standing = (role: string, index: number) => (
    <div className="cause-person" style={{ "--i": index } as CSSProperties} key={role}>
      <Sprite rows={byRole(role)} />
    </div>
  );

  return (
    <div
      className="cause-tile"
      role="img"
      aria-label="Pixel art: a nurse, a doctor, a technician and a security guard stand together around a pink cancer-awareness ribbon."
    >
      <div className="cause-inner" aria-hidden="true">
        <div className="cause-captions">
          {messages.map((message, index) => (
            <span className="cause-caption" style={{ "--i": index } as CSSProperties} key={message}>
              {message}
            </span>
          ))}
        </div>
        <div className="cause-stage">
          {["Nurse", "Doctor"].map(standing)}
          <div className="cause-ribbon">
            <span className="cause-heart cause-heart-left"><Sprite rows={heart} /></span>
            <span className="cause-heart cause-heart-right"><Sprite rows={heart} /></span>
            <Sprite rows={ribbon} />
          </div>
          {["Technician", "Security"].map((role, index) => standing(role, index + 2))}
        </div>
      </div>
      <div className="cause-ground" aria-hidden="true" />
    </div>
  );
}

/** A desk calendar turned to the fourth, with a "4 FEB" tag. Used in the World Cancer Day section. */
export function PixelCalendar() {
  return (
    <div className="cause-calendar" aria-hidden="true">
      <Sprite rows={calendar} />
      <span className="cause-calendar-tag">4 Feb</span>
    </div>
  );
}
