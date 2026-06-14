import { useMemo } from "react";
import { GROUNDING_COLUMNS, SedimentLayer, GroundingColumn } from "../data";

interface CosmicDomeSVGProps {
  dayId: number;
  sunProgress: number; // 0 to 100 for analemma motion
  moonProgress: number; // 0 to 100
  pressureScale: number; // 0 to 100
  aquiferFlowRate: number; // 0 to 100
  vortexSpin: boolean;
  activeLayers: string[];
  selectedColumnId: string | null;
  onSelectColumn: (col: GroundingColumn) => void;
  onTriggerSound: (freq: number, label: string) => void;
}

export default function CosmicDomeSVG({
  dayId,
  sunProgress,
  moonProgress,
  pressureScale,
  aquiferFlowRate,
  vortexSpin,
  activeLayers,
  selectedColumnId,
  onSelectColumn,
  onTriggerSound,
}: CosmicDomeSVGProps) {
  // Compute Sun coordinates along a figure-8 Spline (Analemma)
  const sunCoords = useMemo(() => {
    const angle = (sunProgress / 100) * 2 * Math.PI;
    // Figure-8 infinity curve formula: x = a*sin(t), y = b*sin(2t)
    // Centered in upper dome (center x: 400, y: 220)
    const x = 400 + Math.sin(angle) * 160;
    const y = 200 + Math.sin(angle * 2) * 55;
    return { x, y };
  }, [sunProgress]);

  // Compute Moon coordinates along the opposite phase of figure-8 path
  const moonCoords = useMemo(() => {
    // 180 degrees out of phase
    const angle = (((moonProgress + 50) % 100) / 100) * 2 * Math.PI;
    const x = 400 + Math.sin(angle) * 160;
    const y = 200 + Math.sin(angle * 2) * 55;
    return { x, y };
  }, [moonProgress]);

  // Handle column selection & trigger tone
  const handleColumnClick = (col: GroundingColumn) => {
    onSelectColumn(col);
    onTriggerSound(col.frequency, `Column: ${col.name}`);
  };

  return (
    <div className="relative w-full aspect-[16/10] bg-slate-950/80 rounded-xl border border-cyan-500/20 shadow-2xl overflow-hidden p-1 select-none">
      <svg
        id="firmament-blueprint-canvas"
        viewBox="0 0 800 500"
        className="w-full h-full text-slate-100"
      >
        <defs>
          {/* Crystalline Dome radial glow */}
          <radialGradient id="domeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#00eeff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Golden sun radiant filter */}
          <radialGradient id="sunRadiance" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="1" />
            <stop offset="40%" stopColor="#ffa500" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ff4500" stopOpacity="0" />
          </radialGradient>

          {/* Silver moon glow */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e9f5ff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#9ccbf5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a1d37" stopOpacity="0" />
          </radialGradient>

          {/* Water gradient */}
          <linearGradient id="horizontalWater" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00779d" stopOpacity="1" />
            <stop offset="15%" stopColor="#00a8cc" stopOpacity="1" />
            <stop offset="50%" stopColor="#00c9e2" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#00a8cc" stopOpacity="1" />
            <stop offset="100%" stopColor="#00779d" stopOpacity="1" />
          </linearGradient>

          {/* Column gradients */}
          <linearGradient id="aquaticColGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#005577" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="livingColGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#065f46" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="crystallineColGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9d174d" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="templeColGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.3" />
          </linearGradient>

          {/* Sediment horizontal lines pattern */}
          <pattern id="sedimentHatch" width="20" height="8" patternUnits="userSpaceOnUse">
            <line x1="0" y1="4" x2="20" y2="4" stroke="#475569" strokeWidth="0.5" strokeOpacity="0.5" />
          </pattern>
        </defs>

        {/* Outer Cosmic Ocean Background */}
        <rect width="100%" height="100%" fill="url(#domeGlow)" />
        <rect width="100%" height="100%" fill="transparent" />

        {/* 3-6-9 Vortex Compass Ring Overlay (Subtle) */}
        <g opacity="0.15">
          <circle cx="400" cy="250" r="235" fill="none" stroke="#ffd700" strokeWidth="1" strokeDasharray="5,15" />
          <circle cx="400" cy="250" r="225" fill="none" stroke="#ffd700" strokeWidth="1" />
          {/* Numbers */}
          <text x="400" y="32" textAnchor="middle" fill="#ffd700" fontSize="11" fontFamily="monospace">9 - ZENITH PORTAL</text>
          <text x="635" y="254" textAnchor="start" fill="#ffd700" fontSize="11" fontFamily="monospace">6 - EAST VECTOR</text>
          <text x="165" y="254" textAnchor="end" fill="#ffd700" fontSize="11" fontFamily="monospace">3 - WEST POLE</text>
        </g>

        {/* Outer Sealed Spherical Shell - Glass Bubble boundary */}
        <circle
          cx="400"
          cy="250"
          r="220"
          fill="none"
          stroke="#00f3ff"
          strokeWidth="3"
          strokeOpacity="0.75"
          className="animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <circle
          cx="400"
          cy="250"
          r="218"
          fill="none"
          stroke="#005577"
          strokeWidth="1"
          strokeDasharray="1,5"
        />

        {/* Faded Hebrew lettering curve on Upper Vault Ring */}
        <path
          id="upperWatersTextPath"
          d="M 195,215 A 210,210 0 0,1 605,215"
          fill="none"
          stroke="none"
        />
        <text className="font-serif italic selection:bg-transparent" opacity="0.45" fill="#00ffcc" fontSize="13">
          <textPath href="#upperWatersTextPath" startOffset="50%" textAnchor="middle">
            יְהִי אוֹר • בְּרֵאשִׁית • אֱלֹהִים • נְשָׁמָה • שַׁבָּת
          </textPath>
        </text>

        {/* Subterranean Cross-Section Segment (Lower Hemisphere) */}
        {/* We clip the lower sediment layers within the bottom arc of the circle (y >= 265) */}
        <g id="geological-strata">
          {/* Silt/Bedrock - Deepest Layer */}
          <path
            d="M 183,270 A 220,220 0 0,0 617,270 L 610,380 A 180,180 0 0,1 190,380 Z"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="1"
          />
          {/* Sieve Gravel band */}
          <path
            d="M 185,285 C 300,290 500,290 615,285 L 610,340 C 500,345 300,345 190,340 Z"
            fill="#1e1e2d"
            stroke="#475569"
            strokeWidth="0.5"
          />
          {/* Humic topsoil */}
          <path
            d="M 188,300 C 300,305 500,305 612,300 L 602,320 C 500,325 300,325 198,320 Z"
            fill="#2c1a0c"
            stroke="#1e1b18"
            strokeWidth="0.5"
          />

          {/* Sediment Grid overlay */}
          <path
            d="M 180,265 A 220,220 0 0,0 620,265 Z"
            fill="url(#sedimentHatch)"
            opacity="0.3"
          />
        </g>

        {/* FOUR GROUNDING PILLARS */}
        {GROUNDING_COLUMNS.map((col, index) => {
          // Left placement coordinates x: 1, 2, 3, 4
          const colX = 280 + index * 80;
          const colYBottom = 420 - Math.abs(index - 1.5) * 15; // Arc fitting
          const isSelected = selectedColumnId === col.id;

          const fillGrad =
            col.id === "aquatic"
              ? "url(#aquaticColGrad)"
              : col.id === "living-core"
              ? "url(#livingColGrad)"
              : col.id === "crystalline"
              ? "url(#crystallineColGrad)"
              : "url(#templeColGrad)";

          const neonStroke =
            col.id === "aquatic"
              ? "#00ffff"
              : col.id === "living-core"
              ? "#34d399"
              : col.id === "crystalline"
              ? "#f472b6"
              : "#fbbf24";

          return (
            <g
              key={col.id}
              onClick={() => handleColumnClick(col)}
              className="cursor-pointer group"
            >
              {/* Highlight Ring */}
              {isSelected && (
                <rect
                  x={colX - 16}
                  y="262"
                  width="32"
                  height={colYBottom - 262 + 10}
                  rx="6"
                  fill="none"
                  stroke={neonStroke}
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  className="animate-spin"
                  style={{ animationDuration: "12s" }}
                />
              )}

              {/* Column Pillar Body */}
              <rect
                x={colX - 10}
                y="265"
                width="20"
                height={colYBottom - 265}
                rx="4"
                fill={fillGrad}
                stroke={isSelected ? neonStroke : "#475569"}
                strokeWidth={isSelected ? 1.5 : 1}
                className="transition-all duration-300 group-hover:opacity-100 opacity-80"
              />

              {/* Cap structures */}
              <rect
                x={colX - 14}
                y="263"
                width="28"
                height="6"
                rx="2"
                fill={neonStroke}
                opacity={isSelected ? "1" : "0.7"}
              />
              <circle
                cx={colX}
                cy={colYBottom}
                r="7"
                fill={neonStroke}
                opacity={isSelected ? "1" : "0.6"}
              />

              {/* Internal Pillar Code lines */}
              <line x1={colX} y1="275" x2={colX} y2={colYBottom - 8} stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3,6" />

              {/* Float Label */}
              <text
                x={colX}
                y="255"
                textAnchor="middle"
                fontSize="10"
                fontFamily="sans-serif"
                fill={isSelected ? "#ffffff" : neonStroke}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none font-bold"
              >
                {col.name.split(" ")[0]}
              </text>
            </g>
          );
        })}

        {/* Detached Horizontal Terrestrial Earth Plane Disk (Middle ground) */}
        {/* Floating level disc (x range: 140 to 660, y: 265, thick: 14) */}
        <g id="flat-earth-disc">
          {/* Main soil basement */}
          <polygon
            points="138,265 662,265 650,277 150,277"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Water Surface Plane on top */}
          <polygon
            points="140,265 660,265 650,272 150,272"
            fill="url(#horizontalWater)"
          />

          {/* Central Landmass Contour (Eurasia/Americas representation in center) */}
          <ellipse cx="400" cy="268.5" rx="160" ry="3" fill="#155e75" opacity="0.6" />
          {/* Floating continents contours */}
          <path d="M 280,268 Q 300,266 320,268 T 360,268 Q 400,266 430,268.5 T 510,268" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 310,269 Q 340,267 380,269" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />

          {/* Continuous Edge Waterfalls cascading from Flat Earth Plane */}
          {/* Left Flow */}
          <path
            d="M 139,267 C 120,270 120,380 140,390 C 145,392 155,392 165,390"
            fill="none"
            stroke="#00eeff"
            strokeWidth="3.5"
            strokeOpacity="0.8"
            strokeDasharray="4,4"
            className="animate-pulse"
          />
          {/* Right Flow */}
          <path
            d="M 661,267 C 680,270 680,380 660,390 C 655,392 645,392 635,390"
            fill="none"
            stroke="#00eeff"
            strokeWidth="3.5"
            strokeOpacity="0.8"
            strokeDasharray="4,4"
            className="animate-pulse"
          />

          {/* Edge waterfall splash rings below */}
          <ellipse cx="140" cy="390" rx="12" ry="4" stroke="#00ffff" strokeWidth="0.5" fill="none" opacity="0.6" className="animate-ping" style={{ animationDuration: "2s" }} />
          <ellipse cx="660" cy="390" rx="12" ry="4" stroke="#00ffff" strokeWidth="0.5" fill="none" opacity="0.6" className="animate-ping" style={{ animationDuration: "2s" }} />
        </g>

        {/* Central North Magnet Vortex Whirlwind Spiral (Day 6 focus / Vortex Core toggle) */}
        {vortexSpin && (
          <g id="central-magnetic-whirlwind" className="pointer-events-none" opacity="0.45">
            <path
              d="M 400,265 C 380,210 420,150 400,60"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <path
              d="M 395,265 C 410,210 380,150 405,60"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="2,8"
            />
            {/* Whirlwind helix lines */}
            <ellipse cx="400" cy="200" rx="35" ry="8" stroke="#34d399" strokeWidth="1" fill="none" />
            <ellipse cx="400" cy="140" rx="45" ry="10" stroke="#60a5fa" strokeWidth="1" fill="none" />
            <ellipse cx="400" cy="80" rx="25" ry="6" stroke="#c084fc" strokeWidth="1" fill="none" />
          </g>
        )}

        {/* Dotted Golden Sun and Moon figure-8 analemma coordinates trajectory background */}
        <path
          d="M 240,200 C 240,145 320,145 400,200 C 480,255 560,255 560,200 C 560,145 480,145 400,200 C 320,255 240,255 240,200 Z"
          fill="none"
          stroke="#eab308"
          strokeWidth="1.2"
          strokeDasharray="3,10"
          strokeOpacity="0.4"
        />

        {/* Tesla 3-6-9 Vortex nodes marked on the Analemma trajectory */}
        <g id="vortex-trajectory-nodes" fontSize="13" fontFamily="monospace" fill="#ffd700" fontWeight="bold">
          {/* Node 3 */}
          <circle cx="240" cy="200" r="4" fill="#a16207" />
          <text x="225" y="204" textAnchor="end">3</text>

          {/* Node 6 */}
          <circle cx="560" cy="200" r="4" fill="#a16207" />
          <text x="575" y="204" textAnchor="start">6</text>

          {/* Node 9 (Zenith Node Anchor top center) */}
          <circle cx="400" cy="90" r="4" fill="#ffd700" />
          <text x="400" y="80" textAnchor="middle">9</text>
        </g>

        {/* SUN ORB (Golden radiating star, clickable) */}
        <g
          onClick={() => onTriggerSound(432, "Sun Analemma Core (432Hz)")}
          className="cursor-pointer group"
          id="sun-satellite-node"
        >
          {/* Radiant Aura */}
          <circle
            cx={sunCoords.x}
            cy={sunCoords.y}
            r="28"
            fill="url(#sunRadiance)"
            className="animate-pulse"
          />
          {/* Main golden ball */}
          <circle
            cx={sunCoords.x}
            cy={sunCoords.y}
            r="11"
            fill="#ffd700"
            stroke="#ff8800"
            strokeWidth="1.5"
            className="transition-all group-hover:scale-125 duration-200"
          />
          {/* Corona spokes */}
          <circle cx={sunCoords.x} cy={sunCoords.y} r="15" fill="none" stroke="#fff176" strokeWidth="0.7" strokeDasharray="3,3" />

          {/* Hover helper text */}
          <text
            x={sunCoords.x}
            y={sunCoords.y - 18}
            textAnchor="middle"
            fill="#ffd700"
            fontSize="9"
            fontFamily="sans-serif"
            className="opacity-0 group-hover:opacity-100 transition-opacity font-bold"
          >
            SUN (432Hz)
          </text>
        </g>

        {/* MOON ORB (Silver crescent, clickable) */}
        <g
          onClick={() => onTriggerSound(528, "Moon Crescent Resonance (528Hz)")}
          className="cursor-pointer group"
          id="moon-satellite-node"
        >
          {/* Lunar atmosphere */}
          <circle
            cx={moonCoords.x}
            cy={moonCoords.y}
            r="20"
            fill="url(#moonGlow)"
          />
          {/* Silver disc */}
          <circle
            cx={moonCoords.x}
            cy={moonCoords.y}
            r="9"
            fill="#cfd8dc"
            stroke="#90a4ae"
            strokeWidth="1"
          />
          {/* Crescent shadow effect */}
          <path
            d={`M ${moonCoords.x - 3},${moonCoords.y - 8} A 8,8 0 0,0 ${moonCoords.x - 3},${moonCoords.y + 8} A 8,8 0 0,1 ${moonCoords.x + 6},${moonCoords.y - 6} Z`}
            fill="#1e3a8a"
            opacity="0.6"
          />

          {/* Hover helper text */}
          <text
            x={moonCoords.x}
            y={moonCoords.y - 16}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="9"
            fontFamily="sans-serif"
            className="opacity-0 group-hover:opacity-100 transition-opacity font-bold"
          >
            MOON (528Hz)
          </text>
        </g>

        {/* Interactive Center Gematria Seal (Hebrew Script badge in upper heavens) */}
        <g
          transform="translate(400, 115)"
          onClick={() => onTriggerSound(963, "Crown Resonance Gematria Key (963Hz)")}
          className="cursor-pointer group"
        >
          <rect
            x="-40"
            y="-15"
            width="80"
            height="30"
            rx="5"
            fill="#050b14"
            stroke="#00ffff"
            strokeWidth="1"
            strokeOpacity="0.4"
            className="group-hover:stroke-pink-500 group-hover:stroke-2 transition-all duration-300"
          />
          <text
            y="5"
            textAnchor="middle"
            fill="#00ffcc"
            fontSize="15"
            fontFamily="serif"
            className="font-bold tracking-widest group-hover:fill-pink-400 group-hover:scale-105 transition-all duration-200"
          >
            יְהִי אוֹר
          </text>
        </g>

        {/* Legend Overlay Info Badges */}
        <g transform="translate(620, 480)" fontSize="8.5" fontFamily="monospace" fill="#00ffcc" opacity="0.8">
          <text x="0" y="0">SEALED SYSTEM STATUS: ACTIVE</text>
          <circle cx="-6" cy="-3" r="2.5" fill="#10b981" />
        </g>
      </svg>
    </div>
  );
}
