"use client";

import { useState, type AnimationEvent } from "react";
import { Ball, BattingArms, Callout, Figure, Stage, Stumps, battingLegs, looks } from "./figures";
import "@/styles/scenes.css";

/**
 * The batting hero scene. Each delivery is one CSS loop; when a loop ends a
 * new shot is drawn at random, so the doctor mixes sixes, fours and blocks
 * instead of repeating one stroke. Until JavaScript loads (and in the
 * picker's frozen frames) it simply plays the six.
 */

const shots = ["six", "four", "block"] as const;
type Shot = (typeof shots)[number];

// Fours are the bread and butter; sixes and blocks are the punctuation.
const weights: Record<Shot, number> = { four: 4, six: 3, block: 3 };

function nextShot(history: Shot[]): Shot {
  const [last, previous] = history;
  // Never the same stroke three balls running, so it can't look stuck.
  const pool = shots.filter((shot) => !(shot === last && shot === previous));
  let roll = Math.random() * pool.reduce((sum, shot) => sum + weights[shot], 0);
  for (const shot of pool) {
    roll -= weights[shot];
    if (roll < 0) return shot;
  }
  return pool[0];
}

export function CoverDrive() {
  const look = looks.doctor;
  const arms = BattingArms({ look, className: "sa cd-swing" });
  const [history, setHistory] = useState<Shot[]>(["six"]);
  const shot = history[0];

  function onLoop(event: AnimationEvent<SVGSVGElement>) {
    // Many elements loop together; the ball is the one we count deliveries by.
    if (!event.animationName.startsWith("cd-ball")) return;
    setHistory((current) => [nextShot(current), current[0]]);
  }

  return (
    <svg
      className="scene scene-cover-drive"
      data-shot={shot}
      viewBox="0 0 560 460"
      role="img"
      aria-label="A doctor in a white coat bats against a tennis ball, mixing sixes, fours and careful blocks."
      onAnimationIteration={onLoop}
    >
      <Stage id="cd">
        <Stumps x={146} y={402} />
        <path className="sa cd-trail cd-trail-six" d="M258,350 L640,-62" pathLength={100} />
        <path className="sa cd-trail cd-trail-four" d="M258,350 Q330,396 420,384 T640,388" pathLength={100} />
        <Figure x={226} y={402} look={look} legs={battingLegs} backArm={arms.back} frontArm={arms.front} />
        <g transform="translate(258 350)">
          <path
            className="sa cd-burst"
            d="M0,-24 V-11 M0,24 V11 M-24,0 H-11 M24,0 H11 M-17,-17 L-8,-8 M17,17 L8,8 M-17,17 L-8,8 M17,-17 L8,-8"
          />
        </g>
        <g className="sa cd-ball" transform="translate(300 322)">
          <Ball />
        </g>
        <Callout x={404} y={120} text="SIX!" className="sa cd-callout cd-callout-six" />
        <Callout x={392} y={120} text="FOUR!" tone="lime" className="sa cd-callout cd-callout-four" />
      </Stage>
    </svg>
  );
}
