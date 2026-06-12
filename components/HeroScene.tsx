import { mulberry32 } from "@/lib/prng";

const rand = mulberry32(2034);

const STARS = Array.from({ length: 110 }, () => ({
  x: Math.round(rand() * 14400) / 10,
  y: Math.round(rand() * 4600) / 10,
  r: Math.round((rand() * 1.0 + 0.3) * 100) / 100,
  delay: Math.round(rand() * 40) / 10,
  dur: Math.round((rand() * 3 + 2.2) * 10) / 10,
}));

function Rover({
  tx,
  ty,
  s = 1,
  flip = false,
}: {
  tx: number;
  ty: number;
  s?: number;
  flip?: boolean;
}) {
  return (
    <g transform={`translate(${tx} ${ty}) scale(${flip ? -s : s} ${s})`}>
      {/* wheels */}
      {[2, 27, 52].map((cx) => (
        <g key={cx}>
          <circle
            cx={cx}
            cy={24}
            r={9}
            fill="#11131a"
            stroke="#4a5160"
            strokeWidth={3}
          />
          <circle cx={cx} cy={24} r={2} fill="#6b7382" />
        </g>
      ))}
      {/* chassis + body */}
      <rect x={-12} y={4} width={78} height={14} rx={4} fill="url(#hsMetal)" />
      <rect
        x={-6}
        y={-8}
        width={36}
        height={14}
        rx={2.5}
        fill="#272c38"
        stroke="#4a5160"
        strokeWidth={1}
      />
      {/* mast + laser emitter head */}
      <rect x={42} y={-26} width={4.5} height={32} fill="#818899" />
      <rect
        x={34}
        y={-37}
        width={22}
        height={12}
        rx={3}
        fill="#232838"
        stroke="#5e6577"
        strokeWidth={1}
      />
      {/* antenna + status light */}
      <line x1={0} y1={-8} x2={-7} y2={-20} stroke="#818899" strokeWidth={1.5} />
      <circle cx={-7} cy={-20} r={1.5} fill="#5ee6ff" opacity={0.8} />
      <circle className="blink" cx={-8} cy={8} r={2.4} fill="#5ee6ff" />
    </g>
  );
}

function Beam({
  x1,
  y1,
  x2,
  y2,
  delay,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}) {
  return (
    <g
      className="laser-beam"
      style={{ animationDelay: `${delay}s` }}
      filter="url(#hsGlow)"
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#5ee6ff"
        strokeOpacity={0.28}
        strokeWidth={5.5}
        strokeLinecap="round"
      />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#dffaff"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </g>
  );
}

function MeltSite({ x, y, r = 26, delay = 0 }: { x: number; y: number; r?: number; delay?: number }) {
  const embers = [
    { dx: -7, d: delay - 0.2, r: 2.3 },
    { dx: 3, d: delay - 1.4, r: 1.6 },
    { dx: 9, d: delay - 2.3, r: 2.1 },
    { dx: -2, d: delay - 3.0, r: 1.5 },
  ];
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r * 1.9}
        fill="url(#hsMelt)"
        opacity={0.5}
        className="melt"
        style={{ animationDelay: `${delay - 1}s` }}
      />
      <circle
        cx={x}
        cy={y}
        r={r * 0.85}
        fill="url(#hsMelt)"
        className="melt"
        style={{ animationDelay: `${delay}s` }}
      />
      <circle cx={x} cy={y} r={3.4} fill="#fff8e8" filter="url(#hsGlow)" />
      {embers.map((e, i) => (
        <circle
          key={i}
          className="ember-p"
          cx={x + e.dx}
          cy={y - 4}
          r={e.r}
          fill="#ffc46b"
          style={{ animationDelay: `${e.d}s` }}
        />
      ))}
    </g>
  );
}

export default function HeroScene() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1440 810"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id="hsGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f434e" />
          <stop offset="0.18" stopColor="#2b2e38" />
          <stop offset="1" stopColor="#121420" />
        </linearGradient>
        <linearGradient id="hsRidge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#262933" />
          <stop offset="1" stopColor="#101218" />
        </linearGradient>
        <linearGradient id="hsMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9dde6" />
          <stop offset="0.5" stopColor="#9aa1b0" />
          <stop offset="1" stopColor="#62687a" />
        </linearGradient>
        <linearGradient id="hsShield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3d9e4" />
          <stop offset="1" stopColor="#737b8c" />
        </linearGradient>
        <linearGradient id="hsFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05060c" stopOpacity="0" />
          <stop offset="1" stopColor="#05060c" />
        </linearGradient>
        <radialGradient id="hsMelt">
          <stop offset="0" stopColor="#fff7e0" />
          <stop offset="0.28" stopColor="#ffc46b" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#ff7a29" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff7a29" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hsSiteLight">
          <stop offset="0" stopColor="#ff9a4d" stopOpacity="0.3" />
          <stop offset="1" stopColor="#ff9a4d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hsEarth" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#b8e4ff" />
          <stop offset="0.45" stopColor="#5ba6ec" />
          <stop offset="1" stopColor="#1b4d8f" />
        </radialGradient>
        <radialGradient id="hsEarthHalo">
          <stop offset="0.5" stopColor="#78beff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#78beff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hsNebCyan">
          <stop offset="0" stopColor="#5ee6ff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#5ee6ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hsNebEmber">
          <stop offset="0" stopColor="#ff7a29" stopOpacity="0.05" />
          <stop offset="1" stopColor="#ff7a29" stopOpacity="0" />
        </radialGradient>
        <filter id="hsGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="hsEarthClip">
          <circle r="54" />
        </clipPath>
      </defs>

      {/* deep space */}
      <rect width="1440" height="810" fill="#05060c" />
      <ellipse cx="300" cy="190" rx="340" ry="170" fill="url(#hsNebCyan)" />
      <ellipse cx="1040" cy="270" rx="400" ry="210" fill="url(#hsNebEmber)" />

      {/* starfield */}
      <g>
        {STARS.map((s, i) => (
          <circle
            key={i}
            className="star"
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#cfd8ea"
            style={{
              animationDelay: `-${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </g>

      {/* Earth */}
      <g transform="translate(1150 132)">
        <circle r="92" fill="url(#hsEarthHalo)" />
        <g clipPath="url(#hsEarthClip)">
          <circle r="54" fill="url(#hsEarth)" />
          <path
            d="M-50 -14 C -30 -22, -6 -16, 14 -22 C 30 -26, 44 -18, 52 -10"
            stroke="#ffffff"
            strokeOpacity="0.35"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M-46 12 C -22 6, 2 14, 24 8 C 38 5, 48 10, 53 14"
            stroke="#ffffff"
            strokeOpacity="0.25"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="22" cy="12" r="56" fill="#03040a" opacity="0.5" />
        </g>
      </g>

      {/* terrain */}
      <path
        d="M0 586 C 220 570, 420 584, 640 574 C 860 564, 1100 582, 1440 568 L 1440 660 L 0 660 Z"
        fill="url(#hsRidge)"
        opacity="0.85"
      />
      <path
        d="M0 612 C 140 596, 260 604, 410 598 C 560 592, 700 606, 860 596 C 1020 586, 1180 600, 1440 590 L 1440 810 L 0 810 Z"
        fill="url(#hsGround)"
      />

      {/* warm light cast by the forge sites */}
      <ellipse cx="466" cy="608" rx="150" ry="40" fill="url(#hsSiteLight)" />
      <ellipse cx="950" cy="615" rx="200" ry="52" fill="url(#hsSiteLight)" opacity="0.85" />

      {/* craters */}
      {[
        { cx: 200, cy: 692, rx: 58, ry: 13 },
        { cx: 560, cy: 762, rx: 84, ry: 19 },
        { cx: 1252, cy: 678, rx: 46, ry: 10 },
        { cx: 868, cy: 728, rx: 64, ry: 14 },
      ].map((c, i) => (
        <g key={i} opacity={0.8}>
          <ellipse cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} fill="#0d0f17" />
          <ellipse
            cx={c.cx}
            cy={c.cy - 2}
            rx={c.rx}
            ry={c.ry}
            fill="none"
            stroke="#5b6170"
            strokeOpacity={0.3}
            strokeWidth={1.5}
          />
        </g>
      ))}

      {/* finished shield plates, staged */}
      <g opacity="0.95">
        <rect x="788" y="588" width="48" height="8" rx="2" fill="url(#hsMetal)" />
        <rect x="792" y="579" width="40" height="8" rx="2" fill="url(#hsMetal)" />
        <rect x="796" y="570" width="34" height="8" rx="2" fill="url(#hsMetal)" />
      </g>

      {/* reactor shield dome under construction */}
      <ellipse cx="950" cy="612" rx="150" ry="20" fill="#0c0e15" opacity="0.9" />
      <path
        d="M 830 598 A 120 104 0 0 1 1070 598"
        fill="none"
        stroke="url(#hsShield)"
        strokeWidth="13"
        strokeDasharray="34 8"
      />
      <path
        d="M 858 598 A 92 80 0 0 1 1042 598"
        fill="none"
        stroke="url(#hsMetal)"
        strokeWidth="9"
        strokeDasharray="26 7"
        opacity="0.9"
      />
      <path
        d="M 886 598 A 64 56 0 0 1 1014 598"
        fill="none"
        stroke="#4a5160"
        strokeWidth="7"
        strokeDasharray="18 6"
        opacity="0.8"
      />
      {/* freshly forged seam, still hot */}
      <path
        className="laser-beam"
        d="M 833 580 A 120 104 0 0 1 950 494"
        fill="none"
        stroke="#ff7a29"
        strokeWidth="2.5"
        filter="url(#hsGlow)"
      />
      {/* gantry crane */}
      <rect x="1080" y="470" width="6" height="142" fill="#343947" />
      <rect x="988" y="468" width="98" height="5" fill="#343947" />
      <line x1="1006" y1="473" x2="1006" y2="522" stroke="#565d6b" strokeWidth="1.5" />
      <path
        d="M 986 530 A 26 18 0 0 1 1026 530"
        fill="none"
        stroke="url(#hsShield)"
        strokeWidth="6"
      />

      {/* regolith feedstock pile */}
      <path
        d="M396 614 Q 432 574 472 588 Q 506 596 524 616 Q 460 626 396 614 Z"
        fill="#232631"
      />
      <path
        d="M412 602 Q 440 582 470 589"
        fill="none"
        stroke="#3d4250"
        strokeWidth="2"
        opacity="0.8"
      />

      {/* PROPS rovers */}
      <Rover tx={310} ty={588} s={1.15} />
      <Rover tx={640} ty={600} s={0.95} />
      <Rover tx={1190} ty={614} s={0.85} flip />

      {/* laser network — two beams converge on the dome apex */}
      <Beam x1={363} y1={554} x2={466} y2={586} delay={-0.4} />
      <Beam x1={684} y1={572} x2={940} y2={499} delay={-1.2} />
      <Beam x1={1151} y1={588} x2={958} y2={500} delay={-2.0} />

      {/* melt pools */}
      <MeltSite x={466} y={589} r={26} delay={-0.6} />
      <MeltSite x={950} y={496} r={22} delay={-1.8} />

      {/* fade into page background */}
      <rect x="0" y="700" width="1440" height="110" fill="url(#hsFade)" />
    </svg>
  );
}
