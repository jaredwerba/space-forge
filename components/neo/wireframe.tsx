/* MS-01 — mobile sintering unit, side elevation.
   Technical wireframe in the ARC product-overview style: fine ink
   linework, exploded modules, dot-anchored callout leaders, dimension
   lines, hatching. Strokes only — no fills except leader dots. */

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-cmono), monospace",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return (
      <line
        key={i}
        x1={cx + 8 * Math.cos(a)}
        y1={cy + 8 * Math.sin(a)}
        x2={cx + 33 * Math.cos(a)}
        y2={cy + 33 * Math.sin(a)}
      />
    );
  });
  const grousers = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8;
    return (
      <line
        key={i}
        x1={cx + 42 * Math.cos(a)}
        y1={cy + 42 * Math.sin(a)}
        x2={cx + 47 * Math.cos(a)}
        y2={cy + 47 * Math.sin(a)}
      />
    );
  });
  return (
    <g className="neo-wheel">
      <circle cx={cx} cy={cy} r={42} />
      <circle cx={cx} cy={cy} r={33} />
      <circle cx={cx} cy={cy} r={8} />
      <circle cx={cx} cy={cy} r={2.5} />
      {spokes}
      {grousers}
    </g>
  );
}

function Label({
  name,
  desc = [],
  x,
  y,
  anchor = "start",
}: {
  name: string;
  desc?: string[];
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <g fill="currentColor" stroke="none">
      <text x={x} y={y} fontSize={11} fontWeight={600} textAnchor={anchor} style={MONO}>
        {name}
      </text>
      {desc.map((d, i) => (
        <text key={i} x={x} y={y + 12 + i * 11} fontSize={8} textAnchor={anchor} style={MONO} opacity={0.75}>
          {d}
        </text>
      ))}
    </g>
  );
}

function Leader({ points, tx, ty }: { points: string; tx: number; ty: number }) {
  return (
    <g>
      <polyline points={points} fill="none" strokeWidth={1} />
      <circle cx={tx} cy={ty} r={2.6} fill="currentColor" stroke="none" />
    </g>
  );
}

export function UnitWireframe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 920 620"
      className={className}
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.3"
      fill="none"
    >
      {/* ====== ground ====== */}
      <line x1="24" y1="520" x2="896" y2="520" strokeWidth="2" />
      {Array.from({ length: 39 }, (_, i) => (
        <line key={i} x1={32 + i * 22} y1={521} x2={22 + i * 22} y2={534} strokeWidth="0.8" opacity="0.6" />
      ))}

      {/* ====== drive: wheels + rocker-bogie ====== */}
      <Wheel cx={170} cy={478} />
      <Wheel cx={290} cy={478} />
      <Wheel cx={410} cy={478} />
      <polyline points="170,478 230,408 290,478" />
      <circle cx={230} cy={408} r={6} />
      <polyline points="230,408 320,392 410,478" />
      <circle cx={320} cy={392} r={6} />
      <line x1="320" y1="392" x2="320" y2="368" />

      {/* ====== chassis deck ====== */}
      <rect x="118" y="350" width="364" height="54" />
      <line x1="200" y1="350" x2="200" y2="404" opacity="0.6" />
      <line x1="280" y1="350" x2="280" y2="404" opacity="0.6" />
      <line x1="368" y1="350" x2="368" y2="404" opacity="0.6" />
      <line x1="118" y1="368" x2="482" y2="368" opacity="0.4" />
      {[126, 192, 272, 360, 474].map((x) => (
        <circle key={x} cx={x} cy={358} r={1.6} fill="currentColor" stroke="none" />
      ))}

      {/* ====== regolith intake: dozer blade + drum + conveyor ====== */}
      <polygon points="118,380 118,500 76,500 58,470 98,380" />
      <circle cx={88} cy={482} r={14} />
      <circle cx={88} cy={482} r={2} fill="currentColor" stroke="none" />
      <path d="M 70 462 A 24 24 0 0 1 92 456" strokeWidth="1" />
      <polyline points="92,456 87,453 91,461" strokeWidth="1" />
      <line x1="100" y1="404" x2="152" y2="362" />
      <line x1="108" y1="412" x2="160" y2="370" />
      <circle cx={104} cy={408} r={5} />
      <circle cx={156} cy={366} r={5} />

      {/* ====== electrostatic separator ====== */}
      <rect x="132" y="298" width="86" height="52" />
      <line x1="146" y1="306" x2="178" y2="342" opacity="0.7" />
      <line x1="162" y1="306" x2="194" y2="342" opacity="0.7" />
      <line x1="178" y1="306" x2="210" y2="342" opacity="0.7" />
      <text x="139" y="345" fontSize="8" style={MONO} fill="currentColor" stroke="none">
        +/−
      </text>

      {/* ====== feedstock hopper ====== */}
      <polygon points="244,298 334,298 318,350 260,350" />
      <line x1="252" y1="316" x2="326" y2="316" strokeDasharray="5 4" opacity="0.7" />
      <line x1="256" y1="330" x2="322" y2="330" strokeDasharray="5 4" opacity="0.7" />
      <path d="M 262 298 A 28 12 0 0 1 316 298" opacity="0.7" />

      {/* ====== radiator fins ====== */}
      <rect x="448" y="288" width="11" height="62" />
      <rect x="464" y="294" width="11" height="56" />
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`ra${i}`} x1={448} y1={296 + i * 8} x2={459} y2={296 + i * 8} opacity="0.6" strokeWidth="0.9" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`rb${i}`} x1={464} y1={302 + i * 8} x2={475} y2={302 + i * 8} opacity="0.6" strokeWidth="0.9" />
      ))}

      {/* ====== lattice sinter mast ====== */}
      <circle cx={392} cy={336} r={17} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i * Math.PI) / 3;
        return (
          <circle
            key={i}
            cx={392 + 12 * Math.cos(a)}
            cy={336 + 12 * Math.sin(a)}
            r={1.4}
            fill="currentColor"
            stroke="none"
          />
        );
      })}
      <line x1="384" y1="320" x2="384" y2="152" />
      <line x1="400" y1="320" x2="400" y2="152" />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <line x1="384" y1={312 - i * 34} x2="400" y2={278 - i * 34} strokeWidth="0.9" />
          <line x1="400" y1={312 - i * 34} x2="384" y2={278 - i * 34} strokeWidth="0.9" />
        </g>
      ))}
      <path d="M 380 320 C 372 270, 376 200, 381 156" strokeWidth="0.8" opacity="0.7" />

      {/* ====== emitter head (rotated to beam angle, aims aft-down) ====== */}
      <g transform="rotate(64 392 146)">
        <rect x="352" y="128" width="64" height="36" />
        <polygon points="416,132 444,146 416,160" />
        {Array.from({ length: 4 }, (_, i) => (
          <line key={i} x1={360 + i * 14} y1={128} x2={360 + i * 14} y2={120} strokeWidth="1" />
        ))}
        <path d="M 426 138 A 11 11 0 0 1 426 154" opacity="0.8" />
      </g>
      <circle cx={392} cy={146} r={9} />
      <circle cx={392} cy={146} r={2} fill="currentColor" stroke="none" />
      <g className="neo-emit" strokeWidth="0.8" opacity="0.8">
        <circle cx={392} cy={146} r={15} strokeDasharray="3 3" />
        <line x1="371" y1="146" x2="413" y2="146" />
        <line x1="392" y1="125" x2="392" y2="167" />
      </g>

      {/* ====== beam + melt + printed track ====== */}
      <line className="neo-beam" x1="417" y1="198" x2="566" y2="514" strokeDasharray="7 5" strokeWidth="1.6" />
      <g className="neo-melt">
        <ellipse cx={570} cy={517} rx={22} ry={5} />
        {[-14, -4, 6].map((dx, i) => (
          <line key={i} x1={570 + dx} y1={508} x2={576 + dx} y2={498} strokeWidth="1" />
        ))}
      </g>
      <line x1="592" y1="512" x2="880" y2="512" />
      <line x1="592" y1="520" x2="880" y2="520" strokeWidth="2" />
      {Array.from({ length: 16 }, (_, i) => (
        <line key={i} x1={602 + i * 17.5} y1={512} x2={602 + i * 17.5} y2={520} strokeWidth="0.9" />
      ))}

      {/* ====== exploded: control module ====== */}
      <rect x="648" y="248" width="112" height="68" />
      <rect x="656" y="256" width="96" height="52" opacity="0.6" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={662 + i * 17} y1={316} x2={662 + i * 17} y2={324} strokeWidth="1" />
      ))}
      <rect x="740" y="256" width="8" height="8" fill="currentColor" stroke="none" />
      <rect x="446" y="356" width="26" height="22" strokeDasharray="4 3" />

      {/* ====== exploded: laser power unit ====== */}
      <rect x="648" y="392" width="112" height="70" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={660 + i * 12} y1={398} x2={660 + i * 12} y2={456} strokeWidth="0.8" opacity="0.6" />
      ))}
      <path d="M 648 426 C 600 430, 560 412, 482 398" strokeWidth="1" />
      <rect x="556" y="408" width="14" height="9" />

      {/* ====== height dimension ====== */}
      <line x1="36" y1="120" x2="36" y2="520" strokeWidth="0.9" />
      <line x1="28" y1="120" x2="44" y2="120" strokeWidth="0.9" />
      <line x1="28" y1="520" x2="44" y2="520" strokeWidth="0.9" />
      <text
        x="30"
        y="320"
        fontSize="10"
        textAnchor="middle"
        style={{ ...MONO, writingMode: "vertical-rl" as const }}
        fill="currentColor"
        stroke="none"
      >
        3.4 M
      </text>

      {/* ====== callouts ====== */}
      <Label
        name="Emitter head"
        desc={["12 kW phased fiber array.", "Melt-pool lock at 10 kHz."]}
        x={300}
        y={92}
        anchor="end"
      />
      <Leader points="306,96 352,122" tx={354} ty={123} />

      <Label
        name="Lattice sinter mast"
        desc={["Articulated; 360° envelope."]}
        x={300}
        y={150}
        anchor="end"
      />
      <Leader points="306,154 384,244" tx={384} ty={244} />

      <Label
        name="Feedstock hopper"
        desc={["Sized Fe·Ti·Al powder."]}
        x={300}
        y={206}
        anchor="end"
      />
      <Leader points="300,210 294,296" tx={292} ty={298} />

      <Label
        name="Regolith intake"
        desc={["Dozer-feed into electrostatic", "+ magnetic separation."]}
        x={42}
        y={258}
        anchor="start"
      />
      <Leader points="60,290 60,358 90,386" tx={92} ty={388} />

      <Label
        name="Rocker-bogie drive"
        desc={["Six wheels, 15° grade, sealed hubs."]}
        x={290}
        y={566}
        anchor="middle"
      />
      <Leader points="290,552 290,528" tx={290} ty={526} />

      <Label
        name="Radiators"
        desc={["kW-class heat rejection."]}
        x={496}
        y={222}
        anchor="start"
      />
      <Leader points="500,228 478,252 467,286" tx={466} ty={289} />

      <Label name="Control module" x={648} y={240} anchor="start" />
      <Label
        name=""
        desc={["Real-time autonomy stack; swarm", "uplink. Mount: deck aft (dashed)."]}
        x={648}
        y={328}
        anchor="start"
      />

      <Label name="Laser power unit" x={648} y={384} anchor="start" />
      <Label
        name=""
        desc={["Swappable battery + laser driver."]}
        x={648}
        y={474}
        anchor="start"
      />

      <Label
        name="Sintered course"
        desc={["8 mm layers, laid in place."]}
        x={888}
        y={556}
        anchor="end"
      />
      <Leader points="812,552 770,552 726,524" tx={724} ty={522} />

      {/* ====== spec block, dotted leaders ====== */}
      <g fill="currentColor" stroke="none" style={MONO}>
        <text x="600" y="68" fontSize="10">MASS....... 740 KG</text>
        <text x="600" y="84" fontSize="10">LENGTH..... 4.2 M</text>
        <text x="600" y="100" fontSize="10">LASER...... 12 KW</text>
        <text x="600" y="116" fontSize="10">TRAVERSE... 0.4 M/S</text>
        <text x="600" y="132" fontSize="10">DUTY....... CONTINUOUS</text>
      </g>
    </svg>
  );
}
