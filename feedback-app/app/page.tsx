import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

function DashboardMockup() {
  const sidebarIcons = [50, 78, 106, 134, 162, 190];
  const dataPoints: [number, number][] = [
    [406, 158], [432, 143], [458, 151], [484, 122],
    [510, 134], [536, 112], [562, 120], [588, 103],
  ];
  const tableRows = [
    { cy: 248, fill: "#22c55e", stars: "★★★★★", w1: 58, w2: 42 },
    { cy: 272, fill: "#f59e0b", stars: "★★★★☆", w1: 46, w2: 60 },
    { cy: 296, fill: "#ef4444", stars: "★★★☆☆", w1: 54, w2: 36 },
    { cy: 320, fill: "#3b82f6", stars: "★★★★★", w1: 62, w2: 50 },
    { cy: 344, fill: "#22c55e", stars: "★★★★☆", w1: 42, w2: 56 },
  ];

  return (
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
        <pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="0.7" fill="#2a3441" />
        </pattern>
        <clipPath id="mapClip">
          <rect x="46" y="30" width="344" height="350" />
        </clipPath>
      </defs>

      {/* ── Window frame ── */}
      <rect x="0" y="0" width="600" height="380" rx="12" fill="#0d1117" />

      {/* Title bar */}
      <rect x="0" y="0" width="600" height="30" rx="12" fill="#161b22" />
      <rect x="0" y="18" width="600" height="12" fill="#161b22" />
      <circle cx="18" cy="15" r="5" fill="#ff5f57" />
      <circle cx="34" cy="15" r="5" fill="#ffbd2e" />
      <circle cx="50" cy="15" r="5" fill="#28c840" />
      <text x="300" y="19" textAnchor="middle" fill="#4b5563" fontSize="9" fontFamily="system-ui,sans-serif">
        DriveMe — Activity Monitor
      </text>

      {/* ── Sidebar ── */}
      <rect x="0" y="30" width="46" height="350" fill="#0f1318" />
      <rect x="45.5" y="30" width="0.5" height="350" fill="#1f2937" />
      {sidebarIcons.map((y, i) => (
        <rect key={i} x="11" y={y} width="24" height="24" rx="6" fill={i === 0 ? "#1d4ed8" : "#161c24"} />
      ))}

      {/* ── Map area ── */}
      <rect x="46" y="30" width="344" height="350" fill="#080d14" />
      <rect x="46" y="30" width="344" height="350" fill="url(#dots)" clipPath="url(#mapClip)" />

      {/* Subtle street grid */}
      <g stroke="#111827" strokeWidth="1" clipPath="url(#mapClip)">
        <line x1="100" y1="30" x2="100" y2="380" />
        <line x1="200" y1="30" x2="200" y2="380" />
        <line x1="300" y1="30" x2="300" y2="380" />
        <line x1="46" y1="130" x2="390" y2="130" />
        <line x1="46" y1="230" x2="390" y2="230" />
        <line x1="46" y1="320" x2="390" y2="320" />
      </g>

      {/* Connection lines */}
      <g stroke="#2d3f52" strokeWidth="1.5" clipPath="url(#mapClip)">
        <line x1="158" y1="122" x2="243" y2="196" />
        <line x1="282" y1="97" x2="243" y2="196" />
        <line x1="243" y1="196" x2="182" y2="296" />
        <line x1="243" y1="196" x2="335" y2="252" />
        <line x1="158" y1="122" x2="282" y2="97" strokeDasharray="5 3" strokeWidth="1" stroke="#223040" />
      </g>

      {/* ── Nodes ── */}
      {/* Center */}
      <circle cx="243" cy="196" r="20" fill="#111827" stroke="#6b7280" strokeWidth="1.5" />
      <circle cx="243" cy="196" r="12" fill="#1f2937" />
      <circle cx="243" cy="196" r="4" fill="#9ca3af" />

      {/* Green — Passenger */}
      <circle cx="158" cy="122" r="22" fill="#052e16" stroke="#22c55e" strokeWidth="1.5" />
      <circle cx="158" cy="122" r="14" fill="#14532d" />
      <text x="158" y="126" textAnchor="middle" fill="white" fontSize="10" fontFamily="system-ui,sans-serif" fontWeight="bold">P</text>

      {/* Yellow — Driver */}
      <circle cx="282" cy="97" r="19" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx="282" cy="97" r="12" fill="#78350f" />
      <text x="282" y="101" textAnchor="middle" fill="white" fontSize="10" fontFamily="system-ui,sans-serif" fontWeight="bold">D</text>

      {/* Red — Passenger */}
      <circle cx="182" cy="296" r="19" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
      <circle cx="182" cy="296" r="12" fill="#7f1d1d" />
      <text x="182" y="300" textAnchor="middle" fill="white" fontSize="10" fontFamily="system-ui,sans-serif" fontWeight="bold">P</text>

      {/* Blue — Driver */}
      <circle cx="335" cy="252" r="17" fill="#0a1628" stroke="#3b82f6" strokeWidth="1.5" />
      <circle cx="335" cy="252" r="10" fill="#1e3a5f" />
      <text x="335" y="256" textAnchor="middle" fill="white" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="bold">D</text>

      {/* ── Pop-up: Passenger card ── */}
      <rect x="54" y="62" width="88" height="54" rx="6" fill="#131c2b" stroke="#2d3d52" strokeWidth="0.8" />
      <text x="62" y="76" fill="#6b7280" fontSize="7" fontFamily="system-ui,sans-serif" fontWeight="600" letterSpacing="0.5">PASSENGER</text>
      <circle cx="66" cy="93" r="7" fill="#15803d" />
      <rect x="78" y="88" width="54" height="5" rx="2" fill="#1f2937" />
      <rect x="78" y="97" width="38" height="3.5" rx="2" fill="#0f1821" stroke="#2d3748" strokeWidth="0.5" />
      <line x1="142" y1="89" x2="148" y2="108" stroke="#374151" strokeWidth="0.5" />

      {/* ── Pop-up: Avg Rating ── */}
      <rect x="215" y="218" width="84" height="44" rx="5" fill="#131c2b" stroke="#2d3d52" strokeWidth="0.8" />
      <text x="223" y="232" fill="#6b7280" fontSize="7" fontFamily="system-ui,sans-serif">Avg Rating</text>
      <text x="223" y="250" fill="#22c55e" fontSize="16" fontFamily="system-ui,sans-serif" fontWeight="bold">4.8</text>
      <text x="248" y="250" fill="#4b5563" fontSize="7.5" fontFamily="system-ui,sans-serif"> / 5</text>

      {/* ── Right panel divider ── */}
      <rect x="390" y="30" width="0.5" height="350" fill="#1f2937" />

      {/* ── Chart panel ── */}
      <rect x="390" y="30" width="210" height="178" fill="#0a0f17" />
      <text x="402" y="52" fill="#e2e8f0" fontSize="8.5" fontFamily="system-ui,sans-serif" fontWeight="600">Overall Satisfaction</text>
      <text x="402" y="64" fill="#4b5563" fontSize="7" fontFamily="system-ui,sans-serif">Last 7 days</text>

      {/* Chart background */}
      <rect x="398" y="70" width="194" height="118" rx="4" fill="#0c1520" />

      {/* Grid lines */}
      <g stroke="#151f2e" strokeWidth="0.5">
        <line x1="398" y1="88" x2="592" y2="88" />
        <line x1="398" y1="108" x2="592" y2="108" />
        <line x1="398" y1="128" x2="592" y2="128" />
        <line x1="398" y1="148" x2="592" y2="148" />
        <line x1="398" y1="168" x2="592" y2="168" />
      </g>

      {/* Y-axis labels */}
      <text x="400" y="78" fill="#2d3d52" fontSize="6" fontFamily="system-ui,sans-serif">100%</text>
      <text x="402" y="128" fill="#2d3d52" fontSize="6" fontFamily="system-ui,sans-serif">50%</text>
      <text x="404" y="178" fill="#2d3d52" fontSize="6" fontFamily="system-ui,sans-serif">0%</text>

      {/* Fill */}
      <polygon
        points={`${dataPoints.map(([x, y]) => `${x},${y}`).join(" ")} 588,188 406,188`}
        fill="url(#greenFill)"
      />

      {/* Line */}
      <polyline
        points={dataPoints.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data point dots */}
      {dataPoints.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#22c55e" />
      ))}

      {/* ── Table panel ── */}
      <rect x="390" y="208" width="210" height="0.5" fill="#1f2937" />
      <rect x="390" y="209" width="210" height="171" fill="#0a0f17" />
      <text x="402" y="228" fill="#e2e8f0" fontSize="8.5" fontFamily="system-ui,sans-serif" fontWeight="600">Recent Reports</text>
      <rect x="398" y="234" width="194" height="0.5" fill="#1f2937" />

      {tableRows.map(({ cy, fill, stars, w1, w2 }, i) => (
        <g key={i}>
          <circle cx="408" cy={cy} r="6" fill={fill} opacity="0.2" />
          <circle cx="408" cy={cy} r="3" fill={fill} />
          <rect x="420" y={cy - 5} width={w1} height="5" rx="2" fill="#1a2232" />
          <rect x="420" y={cy + 2} width={w2} height="3.5" rx="1.5" fill="#0f1821" stroke="#1f2937" strokeWidth="0.5" />
          <text x="590" y={cy + 3} textAnchor="end" fill={fill} fontSize="8" fontFamily="system-ui,sans-serif">{stars}</text>
          {i < tableRows.length - 1 && (
            <rect x="398" y={cy + 13} width="194" height="0.5" fill="#111827" />
          )}
        </g>
      ))}
    </svg>
  );
}

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden bg-black">
      {/* Radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 35%, #050a1a 0%, #000000 75%)",
        }}
      />

      {/* Wireframe mesh */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.055 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mesh" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
              <path d="M 70 0 L 0 0 0 70" fill="none" stroke="white" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="70" y2="70" stroke="white" strokeWidth="0.3" />
              <line x1="70" y1="0" x2="0" y2="70" stroke="white" strokeWidth="0.3" />
              <circle cx="0" cy="0" r="1.2" fill="white" />
              <circle cx="70" cy="0" r="1.2" fill="white" />
              <circle cx="0" cy="70" r="1.2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mesh)" />
        </svg>
      </div>

      {/* 4-pointed star — bottom right */}
      <div className="absolute bottom-14 right-14 pointer-events-none" style={{ opacity: 0.12 }}>
        <svg width="70" height="70" viewBox="0 0 70 70">
          <path
            d="M35 4 L38.5 31 L66 35 L38.5 39 L35 66 L31.5 39 L4 35 L31.5 31 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* ── Hero ── */}
      <div className="relative flex-1 flex items-center w-full max-w-7xl mx-auto px-8 py-16 gap-12 xl:gap-20">
        {/* Left: text */}
        <div className="flex flex-col flex-1">
          <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight">
            Bienvenido a la<br />Feedback App
          </h1>

          <h2 className="mt-5 text-2xl xl:text-3xl font-bold">
            <span style={{ color: "#B0B0B0" }}>DriveMe </span>
            <span className="text-white">Feedback</span>
          </h2>

          <p className="mt-6 text-white/50 text-base xl:text-lg leading-relaxed max-w-sm">
            El sistema inteligente de calificaciones y reportes para conductores
            y pasajeros. Impulsando la transparencia y la confianza en cada viaje.
          </p>

          <Link
            href="/dashboard"
            className="mt-10 self-start inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-sm font-semibold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:bg-white/90 active:scale-[0.97] transition-all"
          >
            Ir al Dashboard
            <span>↗</span>
          </Link>
        </div>

        {/* Right: mockup */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="w-full max-w-[600px] rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_0_80px_rgba(30,58,138,0.25)]">
            <DashboardMockup />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="relative flex items-center justify-between px-8 pb-8">
        <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/20 text-xs font-semibold">
          N
        </div>
        <p className="text-white/15 text-xs">
          Nuestra Misión: Mejorar la experiencia de movilidad urbana.
        </p>
        <div className="w-7" />
      </footer>
    </div>
  );
}
