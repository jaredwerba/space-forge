/* Pixel-built marks for the NEO-INDUSTRIAL system.
   Everything is rects on a grid — no curves, no rounding. */

import { mulberry32 } from "@/lib/prng";

/* --- pixelated moon: a shaded sphere quantized into square cells, with
       craters, a vertical forge laser, and a pixel impact + ground splash --- */
export function PixelMoon({ className = "" }: { className?: string }) {
  const C = 12; // cell size in viewBox units
  const R = 13; // moon radius in cells
  const rnd = mulberry32(8);
  const craters = [
    { x: -6, y: -4, r: 3.2 },
    { x: 4, y: -7, r: 2.1 },
    { x: 5, y: 3, r: 2.7 },
    { x: -3, y: 6, r: 1.9 },
    { x: -9, y: 2, r: 1.6 },
    { x: 2, y: 0, r: 1.3 },
  ];
  const L = { x: -0.55, y: -0.55, z: 0.63 };
  const tones = ["#1b1b17", "#4f4e47", "#8d8b82", "#c2c0b6"]; // dark→light
  const moon: React.ReactNode[] = [];
  for (let j = -R; j <= R; j++) {
    for (let i = -R; i <= R; i++) {
      const d2 = i * i + j * j;
      if (d2 > (R - 0.25) * (R - 0.25)) continue;
      const nz = Math.sqrt(Math.max(0, 1 - d2 / (R * R)));
      let b = (i / R) * L.x + (j / R) * L.y + nz * L.z;
      for (const c of craters) {
        const cd = Math.hypot(i - c.x, j - c.y);
        if (cd < c.r) b += cd < c.r * 0.55 ? -0.5 : 0.28;
      }
      b += (rnd() - 0.5) * 0.1;
      const t = b > 0.66 ? 3 : b > 0.34 ? 2 : b > 0.05 ? 1 : 0;
      moon.push(
        <rect key={`m${i}_${j}`} x={i * C} y={j * C} width={C} height={C} fill={tones[t]} />
      );
    }
  }
  // ground splash beneath the moon
  const ground: React.ReactNode[] = [];
  for (let j = R; j <= R + 1; j++) {
    for (let i = -8; i <= 8; i++) {
      if (rnd() > 0.82 - (Math.abs(i) / 8) * 0.5 - (j - R) * 0.18) continue;
      ground.push(
        <rect key={`g${i}_${j}`} x={i * C} y={j * C} width={C} height={C} fill="#1b1b17" />
      );
    }
  }
  // forge laser column (i = 0), fading above the moon
  const laser: React.ReactNode[] = [];
  for (let j = -(R + 3); j <= R - 1; j++) {
    const above = j < -R;
    if (above && j % 2 === 0) continue;
    laser.push(
      <rect key={`l${j}`} x={-C / 2} y={j * C} width={C} height={C} fill={above ? "#ff8a3d" : "#ff5a05"} />
    );
  }
  const burst: [number, number][] = [
    [0, R - 1], [-1, R - 1], [1, R - 1], [0, R - 2], [-1, R - 2],
    [1, R - 2], [-2, R - 1], [2, R - 1], [0, R - 3],
  ];
  return (
    <svg
      viewBox={`${-(R + 1) * C} ${-(R + 3.5) * C} ${(2 * R + 2) * C} ${(2 * R + 6) * C}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {moon}
      {ground}
      {laser}
      {burst.map(([i, j]) => (
        <rect key={`b${i}_${j}`} x={i * C} y={j * C} width={C} height={C} fill="#ff7a1e" />
      ))}
    </svg>
  );
}

function PixelGlyph({
  rows,
  cell = 4,
  width,
  fill = "currentColor",
  className = "",
}: {
  rows: string[];
  cell?: number;
  width?: number;
  fill?: string;
  className?: string;
}) {
  const w = rows[0].length * cell;
  const h = rows.length * cell;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={width ?? w}
      height={((width ?? w) / w) * h}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {rows.flatMap((row, j) =>
        [...row].map((ch, i) =>
          ch === "X" ? (
            <rect
              key={`${i}-${j}`}
              x={i * cell}
              y={j * cell}
              width={cell}
              height={cell}
              fill={fill}
            />
          ) : null
        )
      )}
    </svg>
  );
}

/* --- pixel US flag (canton + bars) --- */
export function PixelFlag({ width = 30 }: { width?: number }) {
  return (
    <svg
      viewBox="0 0 28 14"
      width={width}
      height={(width / 28) * 14}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {[0, 4, 8, 12].map((y) => (
        <rect key={y} x="0" y={y} width="28" height="2" fill="currentColor" />
      ))}
      <rect x="0" y="0" width="12" height="6" fill="currentColor" />
      {[1, 4, 7, 10].map((x) => (
        <rect key={`a${x}`} x={x} y={1} width="1" height="1" fill="var(--neo-paper, #e9e7df)" />
      ))}
      {[2.5, 5.5, 8.5].map((x) => (
        <rect key={`b${x}`} x={x} y={3} width="1" height="1" fill="var(--neo-paper, #e9e7df)" />
      ))}
    </svg>
  );
}

/* --- barcode --- */
const BAR_WIDTHS = [
  3, 1, 1, 2, 1, 3, 2, 1, 1, 1, 2, 1, 3, 1, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 3,
  1, 2, 2, 1, 1, 1, 3,
];

export function Barcode({
  height = 30,
  label,
}: {
  height?: number;
  label?: string;
}) {
  let x = 0;
  const bars = BAR_WIDTHS.map((w, i) => {
    const r = <rect key={i} x={x} y={0} width={w * 1.6} height={26} fill="currentColor" />;
    x += w * 1.6 + 1.8;
    return r;
  });
  return (
    <span className="inline-flex flex-col items-end gap-1">
      <svg
        viewBox={`0 0 ${x} 26`}
        height={height}
        width={(height / 26) * x}
        shapeRendering="crispEdges"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {bars}
      </svg>
      {label && (
        <span className="neo-mono text-[9px] tracking-[0.3em]">{label}</span>
      )}
    </span>
  );
}

/* --- the striped moon — horizontal bars forming a sphere, with an
       offset crater split (Optimal Energy sphere, lunar edition) --- */
export function StripedMoon({
  size = 200,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const R = 100;
  const rowH = 9;
  const gap = 5;
  const bars: React.ReactNode[] = [];
  let idx = 0;
  for (let y = -R + 4; y + rowH <= R - 2; y += rowH + gap) {
    const mid = y + rowH / 2;
    const half = Math.sqrt(Math.max(0, R * R - mid * mid));
    if (half < 8) {
      idx++;
      continue;
    }
    // crater: split bars on a band right of center
    if (idx >= 5 && idx <= 8) {
      const gapStart = 12 + (idx - 5) * 4;
      const gapEnd = gapStart + 34 - (idx - 5) * 6;
      const leftEnd = Math.min(gapStart, half);
      const rightStart = Math.min(gapEnd, half);
      bars.push(
        <rect key={`${idx}a`} x={-half} y={y} width={leftEnd + half} height={rowH} />
      );
      if (rightStart < half) {
        bars.push(
          <rect key={`${idx}b`} x={rightStart} y={y} width={half - rightStart} height={rowH} />
        );
      }
    } else {
      bars.push(<rect key={idx} x={-half} y={y} width={half * 2} height={rowH} />);
    }
    idx++;
  }
  return (
    <svg
      viewBox="-104 -104 208 208"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      {bars}
    </svg>
  );
}

/* --- pixel rosette (the reference "flower", rebuilt from squares) --- */
const FLOWER = [
  "......XXX......",
  ".....XXXXX.....",
  "..X...XXX...X..",
  ".XXX..XXX..XXX.",
  ".XXXX.....XXXX.",
  "..XXX.....XXX..",
  "XXX.........XXX",
  "XXXX...X...XXXX",
  "XXX.........XXX",
  "..XXX.....XXX..",
  ".XXXX.....XXXX.",
  ".XXX..XXX..XXX.",
  "..X...XXX...X..",
  ".....XXXXX.....",
  "......XXX......",
];

export function PixelFlower({ size = 56 }: { size?: number }) {
  return <PixelGlyph rows={FLOWER} width={size} />;
}

/* --- side-view pixel drone --- */
const DRONE = [
  "XXXX.......XXXX",
  "..X.........X..",
  ".XXXXXXXXXXXXX.",
  "....XXXXXXX....",
  "....XXXXXXX....",
  ".....X...X.....",
  ".....X...X.....",
];

export function PixelDrone({ size = 60 }: { size?: number }) {
  return <PixelGlyph rows={DRONE} width={size} />;
}

/* --- hard chevrons >>>> --- */
export function Chevrons({
  count = 4,
  height = 28,
  className = "",
}: {
  count?: number;
  height?: number;
  className?: string;
}) {
  const w = count * 16;
  return (
    <svg
      viewBox={`0 0 ${w} 20`}
      height={height}
      width={(height / 20) * w}
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      {Array.from({ length: count }, (_, i) => (
        <polygon
          key={i}
          points={`${i * 16},0 ${i * 16 + 7},0 ${i * 16 + 14},10 ${i * 16 + 7},20 ${i * 16},20 ${i * 16 + 7},10`}
        />
      ))}
    </svg>
  );
}

/* --- Bayer-dithered density ramp bar --- */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export function DitherBar({
  cols = 60,
  rows = 6,
  cell = 4,
  reverse = false,
  className = "",
}: {
  cols?: number;
  rows?: number;
  cell?: number;
  reverse?: boolean;
  className?: string;
}) {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = reverse ? 1 - c / cols : c / cols;
      if (BAYER[r % 4][c % 4] / 16 < 1 - t) {
        cells.push(
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} />
        );
      }
    }
  }
  return (
    <svg
      viewBox={`0 0 ${cols * cell} ${rows * cell}`}
      className={className}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
      fill="currentColor"
    >
      {cells}
    </svg>
  );
}

/* --- hard-edged up-right arrow --- */
export function ArrowUpRight({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <polygon points="8,4 20,4 20,16 16,16 16,10.8 6.8,20 4,17.2 13.2,8 8,8" />
    </svg>
  );
}
