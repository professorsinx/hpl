import "@/styles/umpire.css";

/**
 * A chunky pixel-art umpire in the spirit of turn-of-the-millennium cricket
 * video games. He stands at the end of the key-dates timeline and cycles
 * through two signals, OUT and SIX, flipping between frames (no tweening)
 * just like a sprite would. Pure SVG and CSS; static under reduced motion.
 */

const colours: Record<string, string> = {
  H: "#f1dca6", // sun hat
  B: "#102d25", // hat band
  S: "#cf9468", // skin
  E: "#0c211d", // eyes
  M: "#f7f8f2", // moustache
  W: "#f7f8f2", // coat
  G: "#d5dccf", // coat shading
  T: "#e79ab4", // tie
  K: "#5b6a64", // trousers
  O: "#8a5a3b", // shoes
};

// 20 columns wide. Arms are drawn separately so they can change per frame.
const body = [
  "......HHHHHHHH......",
  ".....HHHHHHHHHH.....",
  ".....BBBBBBBBBB.....",
  "....HHHHHHHHHHHH....",
  "......SSSSSSSS......",
  "......SESSSSES......",
  "......SSSSSSSS......",
  "......SMMMMMMS......",
  ".......SSSSSS.......",
  "........SSSS........",
  "......WWWTTWWW......",
  ".....WWWWTTWWWW.....",
  ".....WGWWTTWWGW.....",
  ".....WGWWWWWWGW.....",
  ".....WGWWWWWWGW.....",
  ".....WGWWWWWWGW.....",
  ".....WGWWWWWWGW.....",
  ".....WGWWWWWWGW.....",
  ".....WWWWWWWWWW.....",
  ".....WWWWWWWWWW.....",
  ".....KKKKKKKKKK.....",
  ".....KKKK..KKKK.....",
  ".....KKKK..KKKK.....",
  ".....KKKK..KKKK.....",
  ".....KKKK..KKKK.....",
  ".....KKKK..KKKK.....",
  "....OOOOO..OOOOO....",
];

const TOP = 5; // empty rows above the hat, room for raised arms
const U = 8; // one sprite pixel, in SVG units

type Block = [x: number, y: number, w: number, h: number, colour: string];

const arms: Record<string, Block[]> = {
  idleLeft: [[3, 16, 2, 7, "W"], [3, 23, 2, 1, "S"]],
  idleRight: [[15, 16, 2, 7, "W"], [15, 23, 2, 1, "S"]],
  raisedLeft: [[3, 15, 2, 2, "W"], [2, 6, 2, 10, "W"], [2, 4, 2, 2, "S"]],
  raisedRight: [[15, 15, 2, 2, "W"], [16, 6, 2, 10, "W"], [16, 4, 2, 2, "S"]],
  finger: [[17, 2, 1, 2, "S"]],
};

function Blocks({ blocks }: { blocks: Block[] }) {
  return blocks.map(([x, y, w, h, colour], index) => (
    <rect key={index} x={x * U} y={y * U} width={w * U} height={h * U} fill={colours[colour]} />
  ));
}

// Merge horizontal runs of the same colour into single rects.
const bodyBlocks: Block[] = body.flatMap((row, y) => {
  const runs: Block[] = [];
  for (let x = 0; x < row.length; ) {
    const colour = row[x];
    let end = x;
    while (row[end] === colour) end++;
    if (colour !== ".") runs.push([x, y + TOP, end - x, 1, colour]);
    x = end;
  }
  return runs;
});

export function PixelUmpire() {
  return (
    <div className="umpire" role="img" aria-label="A pixel-art cricket umpire signalling out, then six.">
      <div className="umpire-calls" aria-hidden="true">
        <span className="umpire-call umpire-call-out">OUT!</span>
        <span className="umpire-call umpire-call-six">SIX!</span>
      </div>
      <svg viewBox="0 0 160 264" shapeRendering="crispEdges" aria-hidden="true">
        <rect x={16} y={256} width={128} height={8} className="umpire-shadow" />
        <g className="umpire-body">
          <Blocks blocks={bodyBlocks} />
          <g className="umpire-idle-left"><Blocks blocks={arms.idleLeft} /></g>
          <g className="umpire-idle-right"><Blocks blocks={arms.idleRight} /></g>
          <g className="umpire-raised-left"><Blocks blocks={arms.raisedLeft} /></g>
          <g className="umpire-raised-right">
            <Blocks blocks={arms.raisedRight} />
            <g className="umpire-finger"><Blocks blocks={arms.finger} /></g>
          </g>
        </g>
      </svg>
    </div>
  );
}
