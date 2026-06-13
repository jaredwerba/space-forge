/* Technical line diagrams for the NEO-INDUSTRIAL system.
   Hard strokes, pixel rings instead of circles, mono callouts. */

function pixelRingCells(r: number, dash = false): [number, number][] {
  const out: [number, number][] = [];
  const range = Math.ceil(r) + 1;
  for (let j = -range; j <= range; j++) {
    for (let i = -range; i <= range; i++) {
      const d = Math.hypot(i, j);
      if (Math.abs(d - r) <= 0.55 && (!dash || (i + j) % 2 === 0)) {
        out.push([i, j]);
      }
    }
  }
  return out;
}

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-cmono), monospace",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

/* ============ DR-01 top-view blueprint (Echelon specs style) ============ */

const ROTOR_RING = pixelRingCells(7, true);

export function DroneBlueprint({ className = "" }: { className?: string }) {
  const C = 4;
  const rotors: [number, number][] = [
    [-62, -62],
    [62, -62],
    [-62, 62],
    [62, 62],
  ];
  return (
    <svg viewBox="-160 -152 320 312" className={className} aria-hidden="true">
      {/* crosshair */}
      <g stroke="currentColor" strokeWidth="1" strokeDasharray="6 5" opacity="0.6">
        <line x1="-152" y1="0" x2="152" y2="0" />
        <line x1="0" y1="-144" x2="0" y2="144" />
      </g>
      {/* corner brackets */}
      <g stroke="currentColor" strokeWidth="2" fill="none">
        <path d="M -152 -132 v -12 h 12" />
        <path d="M 152 -132 v -12 h -12" />
        <path d="M -152 132 v 12 h 12" />
        <path d="M 152 132 v 12 h -12" />
      </g>
      {/* arms */}
      <g stroke="currentColor" strokeWidth="5">
        <line x1="-22" y1="-22" x2="-58" y2="-58" />
        <line x1="22" y1="-22" x2="58" y2="-58" />
        <line x1="-22" y1="22" x2="-58" y2="58" />
        <line x1="22" y1="22" x2="58" y2="58" />
      </g>
      {/* body */}
      <rect x="-28" y="-28" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="-14" y="-14" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="-5" y="-5" width="10" height="10" fill="currentColor" />
      {/* emitter hatches */}
      <g stroke="currentColor" strokeWidth="2">
        <line x1="-28" y1="36" x2="-16" y2="36" />
        <line x1="-28" y1="42" x2="-16" y2="42" />
        <line x1="16" y1="36" x2="28" y2="36" />
        <line x1="16" y1="42" x2="28" y2="42" />
      </g>
      {/* rotors: pixel-dashed rings */}
      {rotors.map(([cx, cy], k) => (
        <g key={k} transform={`translate(${cx} ${cy})`} fill="currentColor">
          <rect x="-5" y="-5" width="10" height="10" />
          {ROTOR_RING.map(([i, j], n) => (
            <rect
              key={n}
              x={i * C - C / 2}
              y={j * C - C / 2}
              width={C}
              height={C}
            />
          ))}
        </g>
      ))}
      {/* dimension line */}
      <g stroke="currentColor" strokeWidth="1.5">
        <line x1="-92" y1="120" x2="92" y2="120" />
        <line x1="-92" y1="112" x2="-92" y2="128" />
        <line x1="92" y1="112" x2="92" y2="128" />
      </g>
      <text x="0" y="142" textAnchor="middle" fontSize="10" fill="currentColor" style={MONO}>
        1.2 M ENVELOPE
      </text>
      <text x="-148" y="-116" fontSize="9" fill="currentColor" style={MONO}>
        TOP VIEW
      </text>
      <text x="148" y="-116" fontSize="9" textAnchor="end" fill="currentColor" style={MONO}>
        REV 2.6
      </text>
    </svg>
  );
}

/* ============ terraform site cross-section (ARC overview style) ============ */

const CELL = 17;
const CX = 250;
const CY = 318;

function domeRing(r: number) {
  return pixelRingCells(r).filter(([, j]) => j <= 0);
}

const RING_A = domeRing(3.2);
const RING_B = domeRing(4.6);
const RING_C_ALL = domeRing(6);
// apex of the outer course is still being printed
const RING_C = RING_C_ALL.filter(([i, j]) => !(Math.abs(i) <= 2 && j < -4.5));
const RING_C_GHOST = RING_C_ALL.filter(([i, j]) => i >= -1 && i <= 0 && j < -4.5);
const ACTIVE = RING_C_ALL.filter(([i, j]) => Math.abs(i) === 3 && j <= -4);

const DUST_STREAM: [number, number][] = [
  [428, 286], [420, 270], [410, 252], [398, 236], [384, 222],
  [368, 210], [350, 200], [332, 192], [314, 186], [298, 182],
];

const DUST_SCATTER: [number, number][] = [
  [196, 198], [205, 188], [188, 210], [214, 196], [180, 222],
  [305, 170], [296, 162], [312, 158], [288, 175], [320, 168],
];

function MiniDrone({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="currentColor">
      <rect x="-22" y="-6" width="12" height="3" />
      <rect x="10" y="-6" width="12" height="3" />
      <rect x="-17" y="-3" width="2" height="3" />
      <rect x="15" y="-3" width="2" height="3" />
      <rect x="-16" y="0" width="32" height="7" />
      <rect x="-6" y="7" width="2" height="5" />
      <rect x="4" y="7" width="2" height="5" />
    </g>
  );
}

function domeRect(i: number, j: number, ghost = false, color?: string) {
  const x = CX + i * CELL - (CELL - 3) / 2;
  const y = CY + j * CELL - (CELL - 3) / 2;
  return ghost ? (
    <rect
      key={`g${i}-${j}`}
      x={x}
      y={y}
      width={CELL - 3}
      height={CELL - 3}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="3 3"
    />
  ) : (
    <rect
      key={`${i}-${j}`}
      x={x}
      y={y}
      width={CELL - 3}
      height={CELL - 3}
      fill={color ?? "currentColor"}
    />
  );
}

export function TerraformDiagram({ className = "" }: { className?: string }) {
  const drones: [number, number][] = [
    [150, 84],
    [282, 52],
    [408, 112],
  ];
  const a1 = ACTIVE.find(([i]) => i < 0) ?? [-3, -5];
  const a2 = ACTIVE.find(([i]) => i > 0) ?? [3, -5];
  const p1 = [CX + a1[0] * CELL, CY + a1[1] * CELL];
  const p2 = [CX + a2[0] * CELL, CY + a2[1] * CELL];
  return (
    <svg viewBox="0 0 520 392" className={className} aria-hidden="true">
      {/* ground + hatching */}
      <line x1="16" y1={CY + 9} x2="504" y2={CY + 9} stroke="currentColor" strokeWidth="3" />
      <g stroke="currentColor" strokeWidth="1.2" opacity="0.8">
        {Array.from({ length: 27 }, (_, k) => {
          const x = 22 + k * 18;
          return <line key={k} x1={x} y1={CY + 10} x2={x - 9} y2={CY + 21} />;
        })}
      </g>

      {/* fission core */}
      <g>
        <rect x={CX - 22} y={CY - 70} width="44" height="78" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x={CX - 22} y={CY - 70} width="44" height="11" fill="currentColor" />
        <line x1={CX - 10} y1={CY - 52} x2={CX - 10} y2={CY - 2} stroke="currentColor" strokeWidth="3" />
        <line x1={CX} y1={CY - 52} x2={CX} y2={CY - 2} stroke="currentColor" strokeWidth="3" />
        <line x1={CX + 10} y1={CY - 52} x2={CX + 10} y2={CY - 2} stroke="currentColor" strokeWidth="3" />
      </g>

      {/* printed dome courses */}
      <g opacity="0.92">{RING_A.map(([i, j]) => domeRect(i, j))}</g>
      <g opacity="0.78">{RING_B.map(([i, j]) => domeRect(i, j))}</g>
      <g opacity="0.62">{RING_C.map(([i, j]) => domeRect(i, j))}</g>
      {RING_C_GHOST.map(([i, j]) => domeRect(i, j, true))}
      {ACTIVE.map(([i, j]) => domeRect(i, j, false, "var(--neo-orange)"))}

      {/* drones — hovering */}
      {drones.map(([x, y], k) => (
        <g key={k} className="neo-hover" style={{ animationDelay: `${-k * 0.9}s` }}>
          <MiniDrone x={x} y={y} />
        </g>
      ))}

      {/* laser paths — pixelated zap, anchored into the drone underside */}
      <g stroke="var(--neo-orange)" strokeWidth="2.5">
        <line className="neo-zap" x1={drones[0][0]} y1={drones[0][1] + 8} x2={p1[0]} y2={p1[1]} />
        <line className="neo-zap" style={{ animationDelay: "-0.45s" }} x1={drones[1][0]} y1={drones[1][1] + 8} x2={p2[0]} y2={p2[1]} />
        <line className="neo-zap" style={{ animationDelay: "-0.9s" }} x1={drones[2][0]} y1={drones[2][1] + 8} x2="436" y2="290" />
      </g>
      {/* impact sparks — flash with their beam */}
      <g fill="var(--neo-orange)">
        <rect className="neo-zap" x={p1[0] - 3} y={p1[1] - 9} width="6" height="6" />
        <rect className="neo-zap" style={{ animationDelay: "-0.45s" }} x={p2[0] + 1} y={p2[1] - 10} width="5" height="5" />
        <rect className="neo-zap" style={{ animationDelay: "-0.9s" }} x="432" y="280" width="6" height="6" />
      </g>
      {/* dust popping up from the cuts */}
      {[
        { x: p1[0] - 3, y: p1[1] - 7, d: "0s" },
        { x: p1[0] + 2, y: p1[1] - 4, d: "-0.7s" },
        { x: p2[0] + 2, y: p2[1] - 7, d: "-1.1s" },
        { x: p2[0] - 4, y: p2[1] - 3, d: "-1.6s" },
        { x: 433, y: 286, d: "-0.4s" },
        { x: 440, y: 283, d: "-1.3s" },
      ].map((p, i) => (
        <rect
          key={`du${i}`}
          className="neo-dust"
          x={p.x}
          y={p.y}
          width="3"
          height="3"
          fill="currentColor"
          style={{ animationDelay: p.d }}
        />
      ))}

      {/* regolith intake pile */}
      <g fill="currentColor">
        {[0, 1, 2, 3, 4].map((k) => (
          <rect key={`pa${k}`} x={414 + k * 11} y={CY - 3} width="9" height="9" />
        ))}
        {[0, 1, 2].map((k) => (
          <rect key={`pb${k}`} x={425 + k * 11} y={CY - 14} width="9" height="9" />
        ))}
        <rect x="436" y={CY - 25} width="9" height="9" />
      </g>

      {/* charged dust stream + scatter */}
      <g fill="currentColor" opacity="0.75">
        {DUST_STREAM.map(([x, y], k) => (
          <rect key={`s${k}`} x={x} y={y} width="3.5" height="3.5" />
        ))}
        {DUST_SCATTER.map(([x, y], k) => (
          <rect key={`d${k}`} x={x} y={y} width="2.5" height="2.5" />
        ))}
      </g>

      {/* callouts */}
      <g stroke="currentColor" strokeWidth="1.3" fill="none">
        <polyline points="96,40 140,40 148,72" />
        <polyline points="442,56 420,56 412,100" />
        <polyline points="58,176 150,176 168,224" />
        <polyline points="58,266 140,266 158,286" />
        <polyline points="120,355 200,355 228,330" />
        <polyline points="470,222 452,242 448,278" />
      </g>
      <g fill="currentColor" fontSize="9" style={MONO}>
        <text x="14" y="36">DR-01 SWARM</text>
        <text x="14" y="48">UNIT ×24</text>
        <text x="446" y="52">LASER</text>
        <text x="446" y="64">SINTER</text>
        <text x="14" y="172">ACTIVE COURSE</text>
        <text x="14" y="184">N+1 / 8 MM</text>
        <text x="14" y="262">PRINTED SHIELD</text>
        <text x="14" y="274">SHELL — 4 M</text>
        <text x="64" y="351">FISSION CORE</text>
        <text x="64" y="363">FROM EARTH</text>
        <text x="474" y="218">REGOLITH</text>
        <text x="474" y="230">INTAKE</text>
      </g>
      <text x="504" y="385" textAnchor="end" fontSize="9" fill="currentColor" style={MONO}>
        SCALE 1:200 — SECTION A-A
      </text>
      <text x="16" y="385" fontSize="9" fill="currentColor" style={MONO}>
        SITE NEO-06 / MARE TRANQUILLITATIS
      </text>
    </svg>
  );
}
