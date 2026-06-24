/* Procedural 16-bit moon nuclear reactor for the EB hero — the target the
   dust assembles into. A large segmented containment dome on a drum, flanked
   by two banded cooling towers, with a row of curved pipes across the front.
   Built from pixel blocks in a pale-stone depth ramp so the particles resolve
   into a shaded, detailed structure. */

export type RGB = [number, number, number];
export type Block = { x: number; y: number; s: number; c: RGB };
export type Tower = { x: number; topY: number; r: number };
export type Plant = { blocks: Block[]; towers: Tower[]; big: number };

// pale stone ramp, light -> shadow (lit from the upper right)
const STONE: RGB[] = [
  [228, 221, 205],
  [205, 197, 179],
  [178, 169, 151],
  [146, 137, 121],
  [110, 103, 92],
  [76, 71, 63],
];
const cI = (i: number) => Math.max(0, Math.min(5, i));
const norm = (x: number, y: number, z: number): RGB => {
  const m = Math.hypot(x, y, z) || 1;
  return [x / m, y / m, z / m];
};

export function buildPlant(cx: number, surfaceY: number, w: number, h: number): Plant {
  // width-bound on portrait, height-bound on landscape — keeps the whole
  // structure inside the sky band with the headline clear above it
  const STW = Math.min(w * 0.9, h * 0.78, 1080);
  const big = Math.max(5, Math.round(Math.sqrt((0.14 * STW * h) / 900)));
  const blocks: Block[] = [];
  const towers: Tower[] = [];
  const push = (x: number, y: number, s: number, c: RGB) => blocks.push({ x, y, s, c });

  // ---------- segmented containment dome ----------
  function dome(dcx: number, baseY: number, DR: number) {
    const L = norm(-0.34, 0.66, 0.64); // light dir — upper-left, toward viewer
    const DRv = DR * 0.82; // squashed: wider than tall, like the reference
    for (let up = 0; up <= DRv; up += big) {
      for (let dx = -DR; dx <= DR; dx += big) {
        const nx = dx / DR;
        const ny = up / DRv;
        const rr = nx * nx + ny * ny;
        if (rr > 1) continue;
        const nz = Math.sqrt(Math.max(0, 1 - rr));
        let b = nx * L[0] + ny * L[1] + nz * L[2];
        b = Math.max(0, b);
        let idx = Math.round((1 - b) * 4.4) + 1; // 1 (lit) .. 5 (shadow)
        const lat = (Math.asin(Math.min(1, ny)) * 180) / Math.PI; // 0..90
        const lon = (Math.atan2(nx, Math.max(0.001, nz)) * 180) / Math.PI; // -90..90
        const mer = Math.abs(lon - Math.round(lon / 16) * 16);
        const par = Math.abs(lat - Math.round(lat / 13) * 13);
        const line = mer < 2.2 || par < 1.8 || lat > 86;
        if (line) {
          idx = cI(idx + 2);
        } else {
          const pid = (Math.floor((lon + 90) / 16) * 31 + Math.floor(lat / 13) * 17) % 5;
          idx = cI(idx + (pid % 3) - 1);
        }
        push(dcx + dx, baseY - up, big, STONE[cI(idx)]);
      }
    }
  }

  // ---------- drum base under the dome ----------
  function drum(dcx: number, baseY: number, dr: number, dh: number) {
    const rows = Math.max(3, Math.floor(dh / big));
    for (let row = 0; row <= rows; row++) {
      const y = baseY - row * big;
      const cols = Math.floor(dr / big);
      for (let col = -cols; col <= cols; col++) {
        const dx = col * big;
        const frac = (dx + dr) / (2 * dr);
        let idx = cI(5 - Math.round((1 - frac) * 3.6)); // lit from the left
        if (row === rows || row === 0) idx = cI(idx + 1); // lip + ground shadow
        push(dcx + dx, y, big, STONE[idx]);
      }
    }
  }

  // ---------- cooling tower ----------
  function tower(tcx: number, baseY: number, th: number, tr: number) {
    const rW = tr * 0.6; // pinched waist
    const rT = tr * 0.82; // flared rim
    const wT = 0.66; // waist height (fraction)
    const A = (rW - tr - (rT - tr) * wT) / (wT * wT - wT);
    const B = rT - tr - A;
    const rows = Math.max(8, Math.floor(th / big));
    for (let row = 0; row <= rows; row++) {
      const y = baseY - row * big;
      const t = row / rows;
      const r = Math.max(big, A * t * t + B * t + tr);
      const band = row % 4 === 0 && t > 0.04 && t < 0.92 ? 1 : 0;
      const cols = Math.floor(r / big);
      for (let col = -cols; col <= cols; col++) {
        const dx = col * big;
        const frac = (dx + r) / (2 * r);
        let bias = band;
        if (t < 0.04) bias += 1; // base shadow
        let idx = cI(5 - Math.round((1 - frac) * 3.6) + bias); // lit from the left
        if (t > 0.93) idx = cI(idx + 1); // top rim
        // dark interior at the open rim
        if (t > 0.95 && Math.abs(dx) < r * 0.62) idx = 5;
        push(tcx + dx, y, big, STONE[idx]);
      }
    }
    towers.push({ x: tcx, topY: baseY - th, r: rT });
  }

  // ---------- curved front pipe (an inverted-U tube) ----------
  function arch(ax: number, baseY: number, span: number, legH: number, thick: number) {
    const r = span / 2;
    const springY = baseY - legH;
    const tubeIdx = (off: number) => {
      const sf = Math.abs(off) / (thick / 2); // 0 centre .. 1 edge
      return cI(1 + Math.round(sf * 3.5)); // bright centre highlight, dark edges
    };
    for (const side of [-1, 1]) {
      const vx = ax + side * r;
      for (let y = baseY; y >= springY; y -= big) {
        for (let o = -thick / 2; o <= thick / 2; o += big) {
          push(vx + o, y, big, STONE[tubeIdx(o)]);
        }
      }
    }
    for (let a = 0; a <= 180; a += 4) {
      const rad = (a * Math.PI) / 180;
      const px = ax - Math.cos(rad) * r;
      const py = springY - Math.sin(rad) * r;
      for (let o = -thick / 2; o <= thick / 2; o += big) {
        push(px + o * Math.cos(rad), py + o * Math.sin(rad), big, STONE[tubeIdx(o)]);
      }
    }
  }

  // ---------- layout ----------
  const DR = STW * 0.32;
  const drumH = STW * 0.13;
  const drumR = DR * 0.82;
  const baseY = surfaceY;
  const domeBaseY = baseY - drumH;

  const towerR = STW * 0.088;
  const towerH = (drumH + DR) * 0.74;
  const towerOffset = DR + STW * 0.06;

  // back to front: towers, drum, dome, front pipes
  tower(cx - towerOffset, baseY, towerH, towerR);
  tower(cx + towerOffset, baseY, towerH, towerR);
  drum(cx, baseY, drumR, drumH);
  dome(cx, domeBaseY, DR);

  // a row of curved pipes across the front of the drum
  const pipeSpan = DR * 0.42;
  const thick = Math.max(big * 2, DR * 0.1);
  const legH = drumH * 0.7;
  const n = 5;
  const startX = cx - DR * 0.72;
  const stepX = (DR * 1.44) / (n - 1);
  for (let i = 0; i < n; i++) {
    arch(startX + i * stepX, baseY + big, pipeSpan, legH, thick);
  }

  return { blocks, towers, big };
}
