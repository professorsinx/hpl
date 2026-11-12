import type { CSSProperties } from "react";
import "@/styles/roster.css";

/**
 * The HPL roster as a pixel-art team line-up, in the same sprite style as the
 * umpire. A tennis ball is headed down the line; whoever has it hops and is
 * named in the caption, then the whole team jumps together. Pure SVG and CSS;
 * a still team photo under reduced motion.
 */

const colours: Record<string, string> = {
  S: "#cf9468", // skin tones
  s: "#a86f4a",
  L: "#e8b98d",
  H: "#8a5a3b", // hair
  h: "#55443c",
  g: "#aab5ae",
  E: "#0c211d", // eyes
  W: "#f7f8f2",
  G: "#d5dccf",
  P: "#e79ab4",
  Y: "#d3f25a",
  T: "#4fa391",
  C: "#7fb4d6",
  N: "#5a7fa6",
  K: "#5b6a64",
  B: "#f1dca6",
  R: "#e0604f",
  A: "#e9a23b",
  O: "#8a5a3b", // shoes
};

const COLS = 10;
const ROWS = 17;

const legs = (c: string) => Array<string>(4).fill(`..${c}${c}..${c}${c}..`);

const team: { role: string; sprite: string[] }[] = [
  {
    role: "Doctor",
    sprite: [
      "..hhhhhh..",
      "..hhhhhh..",
      "..SESSES..",
      "..SSSSSS..",
      "...SSSS...",
      ".WWPWWPWW.",
      ".WWPWWPWW.",
      ".WWWPPWWW.",
      ".WWWWGWWW.",
      ".SWWWWWWS.",
      "..WWWWWW..",
      "..KKKKKK..",
      ...legs("K"),
      ".OOO..OOO.",
    ],
  },
  {
    role: "Nurse",
    sprite: [
      "..WWPPWW..",
      "..HHHHHH..",
      ".HLELLELH.",
      ".HLLLLLLH.",
      "...LLLL...",
      ".PPPWWPPP.",
      ".PPPPPPPP.",
      ".PPPPPPPP.",
      ".PPPPPPPP.",
      ".LPPPPPPL.",
      "..PPPPPP..",
      "..PPPPPP..",
      ...legs("P"),
      ".WWW..WWW.",
    ],
  },
  {
    role: "Technician",
    sprite: [
      "..hhhhhh..",
      "..hhhhhh..",
      "..sEssEs..",
      "..ssssss..",
      "...ssss...",
      ".CCCCCCCC.",
      ".CCCWWCCC.",
      ".CCCCCCCCW",
      ".CCCCCCCsY",
      ".sCCCCCC.Y",
      "..CCCCCC..",
      "..CCCCCC..",
      ...legs("C"),
      ".WWW..WWW.",
    ],
  },
  {
    role: "Pharmacist",
    sprite: [
      "..gggggg..",
      "..gggggg..",
      "..SESSES..",
      "..SSSSSS..",
      "...SSSS...",
      ".WWWWWWWW.",
      ".WWWWWYWW.",
      ".WWWWYYYW.",
      "RWWWWWYWW.",
      "ASWWWWWWS.",
      "A.WWWWWW..",
      "..KKKKKK..",
      ...legs("K"),
      ".OOO..OOO.",
    ],
  },
  {
    role: "Paramedic",
    sprite: [
      "..RRRRRR..",
      ".RRRRRRR..",
      "..sEssEs..",
      "..ssssss..",
      "...ssss...",
      ".RRRRRRRR.",
      ".YYYYYYYY.",
      ".RRRRRRRR.",
      ".RRRRRRRR.",
      ".sRRRRRRs.",
      "..RRRRRRWW",
      "..RRRRRRWR",
      "..RR..RR..",
      "..RR..RR..",
      "..YY..YY..",
      "..RR..RR..",
      ".OOO..OOO.",
    ],
  },
  {
    role: "Therapist",
    sprite: [
      "..HHHHHH..",
      "..PPPPPP..",
      "..LELLELH.",
      "..LLLLLLH.",
      "...LLLL...",
      ".YYYYYYYY.",
      ".LYYYYYYL.",
      ".LYYYYYYL.",
      ".LYYYYYYL.",
      ".LYYYYYYL.",
      "..YYYYYY..",
      "..KKKKKK..",
      "..KK..KK..",
      "..LL..LL..",
      "..LL..LL..",
      "..LL..LL..",
      ".WWW..WWW.",
    ],
  },
  {
    role: "Admin",
    sprite: [
      "..hhhhhh..",
      "..hhhhhh..",
      "..SESSES..",
      "..SSSSSS..",
      "...SSSS...",
      ".NNWPPWNN.",
      ".NNWPPWNN.",
      ".NNNPPNNN.",
      ".NNNNNNNN.",
      ".SNNNNNNS.",
      "..NNNNNNBB",
      "..KKKKKKBB",
      ...legs("K"),
      ".OOO..OOO.",
    ],
  },
  {
    role: "Reception",
    sprite: [
      "..HHHHHH..",
      "..HHHHHH..",
      ".GsEssEsG.",
      ".GssssssH.",
      "..Gssss...",
      ".BBBBBBBB.",
      ".BBBPPBBB.",
      ".BBBPPBBB.",
      ".BBBBBBBB.",
      ".sBBBBBBs.",
      "..BBBBBB..",
      "..NNNNNN..",
      ...legs("N"),
      ".OOO..OOO.",
    ],
  },
  {
    role: "Housekeeping",
    sprite: [
      "..TTTTTT..",
      "..hhhhhh..",
      "..SESSES.B",
      "..SSSSSS.B",
      "...SSSS..B",
      ".TTTTTTTTB",
      ".TTWWWWTTB",
      ".TTWWWWTTB",
      ".TTWWWWTSB",
      ".STWWWWT.B",
      "..TWWWWT.B",
      "..TTTTTT.B",
      "..TT..TT.B",
      "..TT..TT.B",
      "..TT..TT.B",
      "..TT..TT.W",
      ".OOO..OOWW",
    ],
  },
  {
    role: "Security",
    sprite: [
      "..NNNNNN..",
      ".NNNYYNNN.",
      "..sEssEs..",
      "..shhhhs..",
      "...ssss...",
      ".NNNNNNNN.",
      ".NNNNNYNN.",
      ".NNNNNNNN.",
      ".NNNNNNNN.",
      ".sBBBBBBs.",
      "..NNNNNN..",
      "..KKKKKK..",
      ...legs("K"),
      ".OOO..OOO.",
    ],
  },
];

function Sprite({ rows }: { rows: string[] }) {
  // Merge horizontal runs of the same colour into single rects.
  const rects = rows.flatMap((row, y) => {
    const runs = [];
    for (let x = 0; x < row.length; ) {
      const colour = row[x];
      let end = x;
      while (row[end] === colour) end++;
      if (colour !== ".") {
        runs.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1} fill={colours[colour]} />);
      }
      x = end;
    }
    return runs;
  });

  return (
    <svg viewBox={`0 0 ${COLS} ${ROWS}`} shapeRendering="crispEdges">
      {rects}
    </svg>
  );
}

export function PixelRoster() {
  return (
    <div
      className="roster-stage"
      role="img"
      aria-label="A pixel-art team of ten healthcare workers, from doctor to security, heading a tennis ball down the line."
    >
      <div className="roster-inner" aria-hidden="true">
        <div className="roster-captions">
          {team.map(({ role }, index) => (
            <span className="roster-caption" style={{ "--i": index } as CSSProperties} key={role}>
              {role}
            </span>
          ))}
          <span className="roster-caption roster-caption-all">One team</span>
        </div>
        <div className="roster-lineup">
          <div className="roster-ball-track"><span className="roster-ball" /></div>
          {team.map(({ role, sprite }, index) => (
            <div className="roster-player" style={{ "--i": index } as CSSProperties} key={role}>
              <Sprite rows={sprite} />
            </div>
          ))}
        </div>
      </div>
      <div className="roster-ground" aria-hidden="true" />
    </div>
  );
}
