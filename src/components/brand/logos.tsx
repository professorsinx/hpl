import Image from "next/image";

/**
 * Four flat, vector HPL marks drawn in the site's own palette, plus the
 * original metallic crest. Each mark is a 120 × 120 SVG that stays legible
 * down to favicon size. Compare them at /logos and choose in src/lib/site.ts.
 */

const forest = "#102d25";
const lime = "#d3f25a";
const pink = "#e79ab4";
const paper = "#f7f8f2";
const willow = "#f1dca6";
const willowDark = "#d6ba76";

type MarkProps = { className?: string; title?: string };

function Svg({ className, title, children }: MarkProps & { children: React.ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 120 120" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {children}
    </svg>
  );
}

function Roundel() {
  return (
    <>
      <circle cx={60} cy={60} r={58} fill={forest} />
      <circle cx={60} cy={60} r={55} fill="none" stroke={lime} strokeWidth={4} />
    </>
  );
}

/** 1. The awareness ribbon, with one tail finishing as a cricket bat. */
export function RibbonBat(props: MarkProps) {
  return (
    <Svg {...props}>
      <Roundel />
      <g transform="translate(57 62) scale(1.08)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* back tail and loop */}
        <path d="M-16,38 L7,-10 C13,-24 9,-36 0,-36 C-9,-36 -13,-24 -7,-10 L-1,3" stroke={pink} strokeWidth={11} />
        {/* front tail: handle, then blade */}
        <g transform="translate(-1 3) rotate(-25.6)">
          <path d="M0,0 V10" stroke={pink} strokeWidth={8} />
          <rect x={-8.5} y={9} width={17} height={34} rx={5} fill={willow} />
          <path d="M0,15 V37" stroke={willowDark} strokeWidth={2.4} />
        </g>
      </g>
      <circle cx={88} cy={47} r={9} fill={lime} />
      <path d="M81,43 Q88,48 91,39" fill="none" stroke={forest} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

/** 2. Three stumps standing on a heartbeat line. */
export function PulseStumps(props: MarkProps) {
  return (
    <Svg {...props}>
      <Roundel />
      <g fill={willow}>
        <rect x={27} y={36} width={8} height={48} rx={3} />
        <rect x={42} y={36} width={8} height={48} rx={3} />
        <rect x={57} y={36} width={8} height={48} rx={3} />
      </g>
      <g fill={paper}>
        <rect x={27} y={29} width={18} height={5} rx={2.5} />
        <rect x={47} y={29} width={18} height={5} rx={2.5} />
      </g>
      <path
        d="M16,86 H70 L77,70 L86,100 L92,86 H104"
        fill="none"
        stroke={lime}
        strokeWidth={5.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={85} cy={44} r={10} fill={pink} />
      <path d="M77,40 Q85,46 88,35" fill="none" stroke={forest} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** 3. A tennis ball carrying a medical cross. The simplest and boldest. */
export function CrossBall(props: MarkProps) {
  return (
    <Svg {...props}>
      <circle cx={60} cy={60} r={56} fill={lime} stroke={forest} strokeWidth={3} />
      <g fill="none" stroke={forest} strokeWidth={5} strokeLinecap="round">
        <path d="M19,22 Q39,60 19,98" />
        <path d="M101,22 Q81,60 101,98" />
      </g>
      <path
        d="M51,37 Q51,34 54,34 H66 Q69,34 69,37 V51 H80 Q83,51 83,54 V66 Q83,69 80,69 H69 V83 Q69,86 66,86 H54 Q51,86 51,83 V69 H40 Q37,69 37,66 V54 Q37,51 40,51 H51 Z"
        fill={forest}
      />
      <path d="M60,56 C57,51 50,54 52.5,60 C54,64 60,68 60,68 C60,68 66,64 67.5,60 C70,54 63,51 60,56 Z" fill={pink} />
    </Svg>
  );
}

/** 4. A league shield with the HPL lettermark, ball and heartbeat. */
export function LeagueShield(props: MarkProps) {
  return (
    <Svg {...props}>
      <path d="M60,5 L106,19 V58 C106,88 86,106 60,116 C34,106 14,88 14,58 V19 Z" fill={forest} stroke={lime} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={60} cy={33} r={10} fill={lime} />
      <path d="M52,29 Q60,35 63,24" fill="none" stroke={forest} strokeWidth={2} strokeLinecap="round" />
      <text
        x={60}
        y={76}
        textAnchor="middle"
        fill={paper}
        fontSize={33}
        fontWeight={900}
        letterSpacing={-1.5}
        style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}
      >
        HPL
      </text>
      <path
        d="M32,90 H50 L55,82 L62,99 L67,90 H88"
        fill="none"
        stroke={pink}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** The original metallic crest, cropped to its round medal. */
function OriginalCrest({ className, title }: MarkProps) {
  return (
    <span className={className ? `logo-original ${className}` : "logo-original"}>
      <Image src="/images/hpl-logo.jpeg" alt={title ?? ""} width={176} height={86} />
    </span>
  );
}

export const logos = [
  {
    id: "ribbon-bat",
    name: "Ribbon Bat",
    summary: "The cancer-awareness ribbon, with one tail finishing as a cricket bat.",
    note: "Says both halves of the story, cause and cricket, in a single shape.",
    Component: RibbonBat,
  },
  {
    id: "pulse-stumps",
    name: "Pulse Stumps",
    summary: "Three stumps standing on a heartbeat line, with a ball in the air.",
    note: "The most literal 'healthcare meets cricket'. Echoes the Pulse Rally animation.",
    Component: PulseStumps,
  },
  {
    id: "cross-ball",
    name: "Cross Ball",
    summary: "A tennis ball carrying a medical cross and a small heart.",
    note: "The boldest and simplest. Reads instantly at favicon and jersey-badge size.",
    Component: CrossBall,
  },
  {
    id: "league-shield",
    name: "League Shield",
    summary: "A sports-league shield with the HPL lettermark, a ball and a heartbeat.",
    note: "The most 'official tournament' feel, and the only one that spells out HPL.",
    Component: LeagueShield,
  },
] as const;

export type LogoId = (typeof logos)[number]["id"] | "original";

export function LogoMark({ id, ...props }: MarkProps & { id: LogoId }) {
  const logo = logos.find((candidate) => candidate.id === id);
  return logo ? <logo.Component {...props} /> : <OriginalCrest {...props} />;
}
