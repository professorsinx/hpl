import type { CSSProperties, ReactNode } from "react";

/**
 * A small kit of flat, geometric healthcare-worker characters. Every figure
 * is drawn in its own coordinate space with the feet at (0, 0) and the head
 * around y = -176, facing right. Scenes position, scale and flip them.
 */

export type Pt = readonly [number, number];

export const toPath = (points: readonly Pt[]) =>
  points.map(([x, y], index) => `${index ? "L" : "M"}${x},${y}`).join(" ");

export const palette = {
  ink: "#0c211d",
  lime: "#d3f25a",
  pink: "#e79ab4",
  paper: "#f7f8f2",
  willow: "#f1dca6",
  willowDark: "#d6ba76",
  teal: "#46b7a8",
  sky: "#8fc4ea",
  leaf: "#8cc152",
  rose: "#ee8fae",
  amber: "#f3b562",
  coat: "#fbfcf7",
  skin: { light: "#e8b48c", tan: "#cf9468", brown: "#a86f48", deep: "#8a5a3b" },
  hair: { black: "#17120f", brown: "#3b2619" },
} as const;

export type Look = {
  skin: string;
  hair: string;
  hairStyle?: "short" | "bun" | "long";
  /** Scrub top and trousers. */
  scrubs: string;
  coat?: boolean;
  stethoscope?: boolean;
  headwear?: "surgical-cap" | "nurse-cap";
  mask?: boolean;
  lanyard?: boolean;
};

export const looks = {
  doctor: {
    skin: palette.skin.tan,
    hair: palette.hair.black,
    scrubs: palette.teal,
    coat: true,
    stethoscope: true,
  },
  nurse: {
    skin: palette.skin.brown,
    hair: palette.hair.black,
    hairStyle: "bun",
    scrubs: palette.rose,
    headwear: "nurse-cap",
  },
  surgeon: {
    skin: palette.skin.light,
    hair: palette.hair.brown,
    scrubs: palette.sky,
    headwear: "surgical-cap",
    mask: true,
  },
  technician: {
    skin: palette.skin.deep,
    hair: palette.hair.black,
    hairStyle: "long",
    scrubs: palette.leaf,
    lanyard: true,
  },
  therapist: {
    skin: palette.skin.tan,
    hair: palette.hair.brown,
    scrubs: palette.amber,
    stethoscope: true,
  },
} satisfies Record<string, Look>;

type ArmProps = {
  /** Shoulder → elbow → hand. */
  points: readonly [Pt, Pt, Pt];
  look: Look;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** An arm with a short scrub sleeve (or a full coat sleeve) and a hand. */
export function Arm({ points, look, className, style, children }: ArmProps) {
  const [shoulder, elbow, hand] = points;
  const sleeve = look.coat ? palette.coat : look.scrubs;
  return (
    <g className={className} style={style}>
      <path d={toPath(points)} className="fig-limb" stroke={look.coat ? sleeve : look.skin} strokeWidth={11} />
      {!look.coat && (
        <path d={toPath([shoulder, mid(shoulder, elbow, 0.72)])} className="fig-limb" stroke={sleeve} strokeWidth={13} />
      )}
      <circle cx={hand[0]} cy={hand[1]} r={6.4} fill={look.skin} />
      {children}
    </g>
  );
}

function mid(a: Pt, b: Pt, t: number): Pt {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

type FigureProps = {
  x: number;
  y: number;
  scale?: number;
  /** Face left instead of right. */
  flip?: boolean;
  look: Look;
  /** Hip → knee → foot for each leg, back leg first. */
  legs?: readonly [readonly [Pt, Pt, Pt], readonly [Pt, Pt, Pt]];
  /** Drawn behind the torso. */
  backArm?: ReactNode;
  /** Drawn in front of the torso. */
  frontArm?: ReactNode;
  /** Class for the whole body, e.g. a hop animation. */
  className?: string;
  style?: CSSProperties;
};

const standingLegs = [
  [[-8, -88], [-9, -46], [-10, -6]],
  [[8, -88], [9, -46], [10, -6]],
] as const satisfies FigureProps["legs"];

export const restingArms = {
  back: [[-19, -144], [-23, -112], [-21, -82]],
  front: [[19, -144], [23, -112], [21, -82]],
} as const satisfies Record<string, ArmProps["points"]>;

export function Figure({ x, y, scale = 1, flip, look, legs = standingLegs, backArm, frontArm, className, style }: FigureProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <ellipse cx={0} cy={2} rx={34} ry={6} className="fig-shadow" />
      <g className={className} style={style}>
        {backArm}
        {legs.map((leg, index) => (
          <g key={index}>
            <path d={toPath(leg)} className="fig-limb" stroke={look.scrubs} strokeWidth={15} />
            <ellipse cx={leg[2][0] + 4} cy={leg[2][1] + 1} rx={11.5} ry={6} fill={palette.paper} />
          </g>
        ))}
        <Torso look={look} />
        <Head look={look} />
        {frontArm}
      </g>
    </g>
  );
}

function Torso({ look }: { look: Look }) {
  return (
    <g>
      <path
        d="M-21,-145 Q-21,-153 -13,-153 L13,-153 Q21,-153 21,-145 L18,-90 Q18,-83 11,-83 L-11,-83 Q-18,-83 -18,-90 Z"
        fill={look.scrubs}
      />
      {/* trouser tie line and V-neck */}
      <path d="M-17,-96 L17,-96" stroke="rgb(12 33 29 / 14%)" strokeWidth={2} />
      <path d="M-7,-153 L0,-141 L7,-153 Z" fill={look.skin} />
      <rect x={-5.5} y={-162} width={11} height={12} rx={4} fill={look.skin} />

      {look.coat && (
        <g>
          <path d="M-23,-146 Q-23,-154 -14,-154 L-6,-154 L-9,-118 L-7,-64 L-24,-66 Z" fill={palette.coat} />
          <path d="M23,-146 Q23,-154 14,-154 L6,-154 L9,-118 L7,-64 L24,-66 Z" fill={palette.coat} />
          <path d="M-6,-154 L-9,-118 L-15,-140 Z M6,-154 L9,-118 L15,-140 Z" fill="#e3e8dc" />
          <rect x={11} y={-112} width={9} height={8} rx={1.5} fill="none" stroke="#cfd6c8" strokeWidth={1.4} />
        </g>
      )}

      {look.lanyard && (
        <g>
          <path d="M-6,-152 L0,-124 L6,-152" fill="none" stroke={palette.ink} strokeWidth={1.8} strokeOpacity={0.7} />
          <rect x={-6} y={-126} width={12} height={15} rx={2} fill={palette.paper} />
          <rect x={-3.5} y={-122} width={7} height={2.4} rx={1} fill={palette.pink} />
        </g>
      )}

      {look.stethoscope && (
        <g fill="none" stroke={palette.ink} strokeWidth={2.4} strokeLinecap="round">
          <path d="M-9,-153 C-12,-130 -5,-120 0,-119 C5,-120 12,-130 9,-153" />
          <path d="M0,-119 L0,-111" />
          <circle cx={0} cy={-106} r={4.6} fill="#d9dfd6" strokeWidth={2} />
        </g>
      )}
    </g>
  );
}

function Head({ look }: { look: Look }) {
  const cy = -177;
  return (
    <g>
      {look.hairStyle === "long" && (
        <>
          <path d="M-19,-180 Q-19,-196 0,-196 Q19,-196 19,-180 L21,-152 Q14,-147 9,-152 L9,-170 L-9,-170 L-9,-152 Q-14,-147 -21,-152 Z" fill={look.hair} />
          <rect x={-5.5} y={-164} width={11} height={14} rx={4} fill={look.skin} />
        </>
      )}
      {look.hairStyle === "bun" && <circle cx={-3} cy={-198} r={7.5} fill={look.hair} />}
      <circle cx={0} cy={cy} r={17} fill={look.skin} />

      {look.headwear === "surgical-cap" ? (
        <path d="M-18.5,-177 A18.5,20 0 0 1 18.5,-177 Q10,-184 0,-183 Q-10,-184 -18.5,-177 Z" fill={look.scrubs} />
      ) : (
        <path d="M-17.6,-177 A17.6,17.6 0 0 1 17.6,-177 Q13,-187 2,-186 Q-10,-185 -17.6,-177 Z" fill={look.hair} />
      )}

      {look.headwear === "nurse-cap" && (
        <g>
          <path d="M-11,-190 L11,-190 L8.5,-202 L-8.5,-202 Z" fill={palette.paper} />
          <path d="M0,-199.5 V-192.5 M-3.5,-196 H3.5" stroke={palette.pink} strokeWidth={2.4} strokeLinecap="round" />
        </g>
      )}

      {look.mask ? (
        <g>
          <path d="M-13,-174 Q0,-178 13,-174 L11.5,-165 Q0,-157 -11.5,-165 Z" fill="#e9f4f3" />
          <path d="M-13,-173 L-17,-177 M13,-173 L17,-177" stroke="#e9f4f3" strokeWidth={1.4} />
        </g>
      ) : (
        <path d="M-5,-169 Q0,-165 5,-169" fill="none" stroke={palette.ink} strokeOpacity={0.6} strokeWidth={1.6} strokeLinecap="round" />
      )}
      <circle cx={-6} cy={-178} r={1.7} fill={palette.ink} />
      <circle cx={6} cy={-178} r={1.7} fill={palette.ink} />
    </g>
  );
}

/** Cricket bat, handle at the top. Drawn hanging straight down from (x, y). */
export function Bat({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-3.6} y={-6} width={7.2} height={36} rx={3.4} fill={palette.pink} />
      <path d="M-9,28 Q-9,24 -5,24 L5,24 Q9,24 9,28 L9,86 Q9,96 0,96 Q-9,96 -9,86 Z" fill={palette.willow} />
      <path d="M0,32 V88" stroke={palette.willowDark} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

/** A tennis ball, centred on the origin. */
export function Ball({ r = 10 }: { r?: number }) {
  return (
    <g className="scene-ball-spin">
      <circle r={r} fill={palette.lime} />
      <path
        d={`M${-r * 0.92},${-r * 0.35} Q0,${r * 0.2} ${r * 0.35},${-r * 0.92} M${-r * 0.35},${r * 0.92} Q0,${-r * 0.2} ${r * 0.92},${r * 0.35}`}
        fill="none"
        stroke={palette.paper}
        strokeWidth={r * 0.17}
        strokeLinecap="round"
      />
    </g>
  );
}

/** Three stumps and two bails with the middle stump at x, standing on y. */
export function Stumps({ x, y, className }: { x: number; y: number; className?: string }) {
  return (
    <g transform={`translate(${x} ${y})`} className={className}>
      <rect x={-14.5} y={-66} width={5} height={66} rx={2} fill={palette.willow} className="stump stump-off" />
      <rect x={-2.5} y={-66} width={5} height={66} rx={2} fill={palette.willow} className="stump stump-middle" />
      <rect x={9.5} y={-66} width={5} height={66} rx={2} fill={palette.willow} className="stump stump-leg" />
      <rect x={-14} y={-70} width={13} height={4} rx={2} fill={palette.paper} className="bail bail-one" />
      <rect x={1} y={-70} width={13} height={4} rx={2} fill={palette.paper} className="bail bail-two" />
    </g>
  );
}

/** Pill label that pops in at a moment of the scene ("SIX!", "HOWZAT!"). */
export function Callout({ x, y, text, className, tone = "pink" }: { x: number; y: number; text: string; className?: string; tone?: "pink" | "lime" }) {
  const width = text.length * 12.5 + 30;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={className}>
        <rect x={-width / 2} y={-17} width={width} height={34} rx={6} fill={tone === "pink" ? palette.pink : palette.lime} transform="rotate(-6)" />
        <text className="scene-callout-text" textAnchor="middle" y={6} transform="rotate(-6)">
          {text}
        </text>
      </g>
    </g>
  );
}

/**
 * The shared stage: an arch-shaped floodlit ground that figures can break out
 * of. `id` keeps gradient and clip ids unique when several scenes share a page.
 */
export function Stage({ id, children }: { id: string; children: ReactNode }) {
  const arch = "M10,414 V236 A270,226 0 0 1 550,236 V414 Q550,432 532,432 H28 Q10,432 10,414 Z";
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f8a67" />
          <stop offset="1" stopColor="#1c5c45" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.28" r="0.6">
          <stop offset="0" stopColor="#d3f25a" stopOpacity="0.34" />
          <stop offset="1" stopColor="#d3f25a" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d={arch} />
        </clipPath>
      </defs>
      <path d={arch} fill={`url(#${id}-sky)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={10} y={10} width={540} height={422} fill={`url(#${id}-glow)`} />
        <circle cx={280} cy={246} r={150} className="stage-ring" />
        <circle cx={280} cy={246} r={222} className="stage-ring" />
        <rect x={10} y={356} width={540} height={76} fill="#237253" />
        <path d="M96,372 H464 L514,432 H46 Z" fill="#e4dba7" fillOpacity={0.92} />
        <path d="M76,396 H484" stroke={palette.paper} strokeOpacity={0.75} strokeWidth={2.5} />
      </g>
      <path d={arch} className="stage-outline" />
      {/* The cast is choreographed on a 560-wide stage, then scaled up about the crease. */}
      <g transform="translate(280 402) scale(1.15) translate(-280 -402)">{children}</g>
    </>
  );
}

export const battingLegs = [
  [[-8, -88], [-16, -46], [-22, -6]],
  [[8, -88], [22, -48], [30, -6]],
] as const;

/** Both arms on the bat handle; rotates around the shoulders as one unit. */
export function BattingArms({ look, className }: { look: Look; className: string }) {
  const pivot = { transformOrigin: "2px -146px" };
  return {
    back: <Arm className={className} style={pivot} look={look} points={[[-6, -146], [8, -120], [15, -98]]} />,
    front: (
      <g className={className} style={pivot}>
        <Bat x={16} y={-100} />
        <Arm look={look} points={[[10, -146], [24, -120], [17, -88]]} />
      </g>
    ),
  };
}
