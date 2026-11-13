import type { CSSProperties } from "react";
import { CoverDrive } from "./cover-drive";
import { Arm, Ball, Bat, BattingArms, Callout, Figure, Stage, Stumps, battingLegs, looks, palette, restingArms, toPath, type Look, type Pt } from "./figures";
import "@/styles/scenes.css";

/**
 * Four looping hero animations. Each is a single inline SVG animated purely
 * with CSS keyframes (see scenes.css): no JavaScript, no animation library,
 * and they hold a sensible still frame under prefers-reduced-motion.
 */

const VIEW_BOX = "0 0 560 460";
const origin = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px` });

/* 2 ── Clean Bowled ─────────────────────────────────────────────────────── */

export function CleanBowled() {
  const look = looks.nurse;
  return (
    <svg className="scene scene-bowled" viewBox={VIEW_BOX} role="img" aria-label="A nurse bowls a yorker that knocks back the middle stump, then celebrates.">
      <Stage id="bw">
        <Stumps x={124} y={402} className="bw-stumps" />
        <g className="sa bw-ball" transform="translate(236 390)">
          <Ball />
        </g>
        <Figure
          x={430}
          y={402}
          flip
          look={look}
          className="sa bw-body"
          legs={[
            [[-8, -88], [-24, -54], [-42, -16]],
            [[8, -88], [24, -48], [38, -6]],
          ]}
          backArm={<Arm className="sa bw-lead" style={origin(-4, -146)} look={look} points={[[-4, -146], [-4, -176], [-4, -204]]} />}
          frontArm={
            <Arm className="sa bw-arm" style={origin(4, -146)} look={look} points={[[4, -146], [4, -178], [4, -208]]}>
              <g className="sa bw-handball">
                <g transform="translate(4 -214)">
                  <Ball r={9} />
                </g>
              </g>
            </Arm>
          }
        />
        <Callout x={268} y={118} text="HOWZAT!" tone="lime" className="sa bw-callout" />
      </Stage>
    </svg>
  );
}

/* 3 ── Pulse Rally ──────────────────────────────────────────────────────── */

const pulsePoints: Pt[] = [
  [150, 340], [206, 340], [216, 330], [226, 340], [246, 340], [256, 350], [270, 268],
  [286, 392], [298, 340], [322, 340], [334, 326], [348, 340], [440, 340],
];

export function PulseRally() {
  const thrower = looks.surgeon;
  const batter = looks.technician;
  const arms = BattingArms({ look: batter, className: "sa pl-tap" });
  const forward = toPath(pulsePoints);
  const backward = toPath([...pulsePoints].reverse());
  return (
    <svg className="scene scene-pulse" viewBox={VIEW_BOX} role="img" aria-label="A surgeon and a technician rally a tennis ball along a heartbeat line beneath a pink awareness ribbon.">
      <Stage id="pl">
        <g transform="translate(280 150)">
          <circle className="sa pl-ring" r={40} />
          <g className="sa pl-ribbon">
            <path d="M-15,36 L7,-10 C13,-24 9,-36 0,-36 C-9,-36 -13,-24 -7,-10 L15,36" />
          </g>
        </g>
        <path className="pl-track" d={forward} />
        <path className="sa pl-line pl-line-forward" d={forward} pathLength={100} />
        <path className="sa pl-line pl-line-back" d={backward} pathLength={100} />
        <Figure
          x={84}
          y={402}
          look={thrower}
          backArm={<Arm look={thrower} points={restingArms.back} />}
          frontArm={
            <Arm className="sa pl-throw" style={origin(19, -144)} look={thrower} points={[[19, -144], [20, -112], [19, -80]]}>
              <g className="sa pl-handball">
                <g transform="translate(19 -70)">
                  <Ball r={9} />
                </g>
              </g>
            </Arm>
          }
        />
        <Figure x={470} y={402} flip look={batter} legs={battingLegs} backArm={arms.back} frontArm={arms.front} />
        <g className="sa pl-ball" transform="translate(270 268)">
          <Ball />
        </g>
      </Stage>
    </svg>
  );
}

/* 4 ── The Squad ────────────────────────────────────────────────────────── */

const squad: { look: Look; x: number; y: number; scale: number; delay: string }[] = [
  { look: looks.surgeon, x: 100, y: 404, scale: 0.84, delay: "-1.2s" },
  { look: looks.nurse, x: 190, y: 404, scale: 0.9, delay: "0s" },
  { look: looks.doctor, x: 280, y: 408, scale: 1, delay: "-5.04s" },
  { look: looks.technician, x: 370, y: 404, scale: 0.9, delay: "-4.08s" },
  { look: looks.therapist, x: 460, y: 404, scale: 0.84, delay: "-3.12s" },
];

export function TheSquad() {
  return (
    <svg className="scene scene-squad" viewBox={VIEW_BOX} role="img" aria-label="Five healthcare workers, a surgeon, nurse, doctor, technician and therapist, toss a tennis ball down the line.">
      <Stage id="sq">
        {squad.map(({ look, x, y, scale, delay }, index) => {
          const timing = { "--ad": delay } as CSSProperties;
          const holdsBat = index === 2;
          return (
            <Figure
              key={index}
              x={x}
              y={y}
              scale={scale}
              look={look}
              className="sa sq-hop"
              style={timing}
              backArm={
                holdsBat ? (
                  <g>
                    <Bat x={-36} y={-100} />
                    <Arm look={look} points={[[-19, -144], [-31, -122], [-36, -100]]} />
                  </g>
                ) : (
                  <Arm look={look} points={restingArms.back} />
                )
              }
              frontArm={
                <Arm
                  className="sa sq-arm"
                  style={{ ...timing, ...origin(19, -144) }}
                  look={look}
                  points={[[19, -144], [20, -112], [19, -80]]}
                />
              }
            />
          );
        })}
        <g className="sa sq-ball-x" transform="translate(326 92)">
          <g className="sa sq-ball-y">
            <Ball />
          </g>
        </g>
      </Stage>
    </svg>
  );
}

/* Registry ──────────────────────────────────────────────────────────────── */

export const scenes = [
  {
    id: "cover-drive",
    name: "The Cover Drive",
    summary: "A doctor in a white coat bats through the overs: sixes, fours and the odd careful block, in a random order.",
    mood: "Confident, celebratory. The classic cricket hero shot.",
    Component: CoverDrive,
  },
  {
    id: "clean-bowled",
    name: "Clean Bowled",
    summary: "A nurse steams in, lands the yorker, and the middle stump goes cartwheeling. Cue the celebration.",
    mood: "High energy, a bit cheeky. The most action of the four.",
    Component: CleanBowled,
  },
  {
    id: "pulse-rally",
    name: "Pulse Rally",
    summary: "The ball travels along a heartbeat line between a surgeon and a technician, under the awareness ribbon.",
    mood: "Quieter and more meaningful. Ties cricket to healthcare and the cause.",
    Component: PulseRally,
  },
  {
    id: "the-squad",
    name: "The Squad",
    summary: "Surgeon, nurse, doctor, technician and therapist stand shoulder to shoulder, tossing the ball down the line.",
    mood: "Warm and inclusive. Every role belongs, echoing the poster.",
    Component: TheSquad,
  },
] as const;

export type SceneId = (typeof scenes)[number]["id"];

export function Scene({ id }: { id: SceneId }) {
  const scene = scenes.find((candidate) => candidate.id === id) ?? scenes[0];
  return <scene.Component />;
}

export { palette };
