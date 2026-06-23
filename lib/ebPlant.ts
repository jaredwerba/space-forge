/* Procedural pixel-art nuclear plant for the EB hero — the target the
   dust assembles into. Three shaded cooling towers, a containment dome
   with radiation trefoils, and a base building with windows and hazard
   signs. Built from blocks of two sizes with a blue-grey depth ramp so
   the particles can resolve into a structure with real shading. */

export type RGB = [number, number, number];
export type Block = { x: number; y: number; s: number; c: RGB };
export type Tower = { x: number; topY: number; r: number };
export type Plant = { blocks: Block[]; towers: Tower[]; big: number };

// light -> shadow steel ramp (lit from the upper right)
const STEEL: RGB[] = [
  [176, 188, 198],
  [144, 158, 171],
  [113, 128, 144],
  [86, 101, 118],
  [62, 75, 91],
  [42, 51, 64],
];
const HOLE: RGB = [27, 33, 43];
const YELLOW: RGB = [234, 194, 40];
const TRE: RGB = [24, 22, 13];
const WINDOW: RGB = [33, 41, 52];
const PIPE: RGB = [102, 116, 130];

const cI = (i: number) => Math.max(0, Math.min(5, i));

export function buildPlant(cx: number, surfaceY: number, w: number, h: number): Plant {
  const STW = Math.min(w * 0.9, 1080);
  // pick a block unit that targets ~820 body blocks
  const big = Math.max(6, Math.round(Math.sqrt((0.17 * STW * h) / 820)));
  const small = Math.max(3, Math.round(big / 2));
  const blocks: Block[] = [];
  const towers: Tower[] = [];
  const push = (x: number, y: number, s: number, c: RGB) => blocks.push({ x, y, s, c });

  // ---------- cooling tower ----------
  function tower(tcx: number, baseY: number, th: number, tr: number) {
    const rW = tr * 0.46;
    const rT = tr * 0.6;
    const wT = 0.66;
    const A = (rW - tr - (rT - tr) * wT) / (wT * wT - wT);
    const B = rT - tr - A;
    const rows = Math.max(6, Math.floor(th / big));
    for (let row = 0; row <= rows; row++) {
      const y = baseY - row * big;
      const t = row / rows;
      const r = Math.max(big, A * t * t + B * t + tr);
      const band = row % 5 === 0 && row > 0 && t < 0.9 ? 1 : 0;
      const isTop = t > 0.9;
      const cols = Math.floor(r / big);
      for (let col = -cols; col <= cols; col++) {
        const dx = col * big;
        const frac = (dx + r) / (2 * r);
        if (isTop) {
          if (Math.abs(dx) >= r - big * 1.1) {
            push(tcx + dx, y, big, STEEL[cI(5 - Math.round(frac * 4))]);
          } else {
            push(tcx + dx, y, big, HOLE);
          }
          continue;
        }
        let bias = band;
        if (t < 0.05) bias += 1; // ground contact shadow
        push(tcx + dx, y, big, STEEL[cI(5 - Math.round(frac * 4) + bias)]);
      }
    }
    towers.push({ x: tcx, topY: baseY - th, r: rT });
  }

  // ---------- radiation trefoil ----------
  function trefoil(sx: number, sy: number, rad: number) {
    const cells = Math.ceil(rad / small);
    for (let gy = -cells; gy <= cells; gy++) {
      for (let gx = -cells; gx <= cells; gx++) {
        const px = gx * small;
        const py = gy * small;
        const d = Math.hypot(px, py);
        if (d > rad) continue;
        const a = (Math.atan2(py, px) * 180) / Math.PI;
        const aa = (a + 360) % 360;
        const wedge = [90, 210, 330].some((wa) => {
          let dd = Math.abs(aa - wa);
          dd = Math.min(dd, 360 - dd);
          return dd < 28;
        });
        const center = d < rad * 0.26;
        const rim = d > rad * 0.9;
        push(sx + px, sy + py, small, wedge || center || rim ? TRE : YELLOW);
      }
    }
  }

  // ---------- containment dome ----------
  function dome(dcx: number, baseY: number, dh: number, dr: number) {
    const rows = Math.max(6, Math.floor(dh / big));
    for (let row = 0; row <= rows; row++) {
      const y = baseY - row * big;
      const t = row / rows;
      let hw: number;
      if (t < 0.32) hw = dr * (0.72 + 0.28 * (t / 0.32));
      else hw = dr * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.32) / 0.68, 2)));
      if (hw < big) continue;
      const cols = Math.floor(hw / big);
      for (let col = -cols; col <= cols; col++) {
        const dx = col * big;
        const frac = (dx + hw) / (2 * hw);
        const rib = Math.abs(col) % 3 === 2 ? 1 : 0;
        const crown = t > 0.72 ? -1 : 0; // domed crown catches light
        push(dcx + dx, y, big, STEEL[cI(5 - Math.round(frac * 4) + rib + crown)]);
      }
    }
    // two hazard trefoils across the dome face
    trefoil(dcx - dr * 0.42, baseY - dh * 0.42, dr * 0.3);
    trefoil(dcx + dr * 0.42, baseY - dh * 0.42, dr * 0.3);
  }

  // ---------- base building ----------
  function base(bcx: number, baseY: number, halfW: number, bh: number) {
    const rows = Math.max(4, Math.floor(bh / big));
    const cols = Math.floor(halfW / big);
    for (let row = 0; row <= rows; row++) {
      const y = baseY - row * big;
      const t = row / rows;
      for (let col = -cols; col <= cols; col++) {
        const x = bcx + col * big;
        const win =
          row % 2 === 1 &&
          (col + cols) % 2 === 0 &&
          t > 0.2 &&
          t < 0.85 &&
          Math.abs(col) < cols - 1;
        if (win) {
          push(x, y, big, Math.random() < 0.16 ? YELLOW : WINDOW);
        } else {
          push(x, y, big, STEEL[cI(4 - Math.round(t * 2))]);
        }
      }
    }
  }

  // ---------- hazard sign on the base ----------
  function sign(sx: number, sy: number, sz: number) {
    const half = Math.round(sz / small);
    for (let gy = -half; gy <= half; gy++) {
      for (let gx = -half; gx <= half; gx++) {
        const edge = Math.abs(gx) === half || Math.abs(gy) === half;
        push(sx + gx * small, sy + gy * small, small, edge ? TRE : YELLOW);
      }
    }
    trefoil(sx, sy, sz * 0.7);
  }

  // ---------- connecting pipes ----------
  function pipe(x1: number, x2: number, y: number) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x += big) {
      push(x, y, big, PIPE);
      push(x, y + big, big, STEEL[4]);
    }
  }

  // ---------- layout (pushed back to front) ----------
  const thC = Math.min(h * 0.42, STW * 0.62);
  const thS = thC * 0.84;
  const trC = STW * 0.105;
  const trS = STW * 0.088;
  const bh = STW * 0.1;
  const dr = STW * 0.155;
  // keep the dome below the central tower top so all three towers read
  const dh = Math.min(STW * 0.34, thC * 0.9);

  tower(cx - 0.3 * STW, surfaceY, thS, trS); // left
  tower(cx + 0.3 * STW, surfaceY, thS, trS); // right
  tower(cx, surfaceY, thC, trC); // centre (tall, behind)

  pipe(cx - 0.3 * STW, cx + 0.3 * STW, surfaceY - bh * 0.78);
  base(cx, surfaceY, 0.45 * STW, bh);
  dome(cx, surfaceY - bh * 0.18, dh, dr);

  sign(cx - 0.36 * STW, surfaceY - bh * 0.5, big * 1.6);
  sign(cx + 0.33 * STW, surfaceY - bh * 0.5, big * 1.6);

  return { blocks, towers, big };
}
