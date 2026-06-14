import { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Compass,
  Layers,
  Database,
  Sliders,
  Play,
  Pause,
  Monitor,
  Video,
  FileText,
  Activity,
  Globe,
  Radio,
  BookOpen,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Award,
  ChevronRight,
  Sparkle,
  Shield
} from "lucide-react";
import {
  CREATION_DAYS,
  GROUNDING_COLUMNS,
  SEDIMENT_LAYERS,
  DIALOGUE_PRESETS,
  HEBREW_ALPHABET,
  GroundingColumn,
  CreationDay
} from "./data";
import CosmicDomeSVG from "./components/CosmicDomeSVG";
import GematriaCalculator from "./components/GematriaCalculator";
import ProphetAdvisor from "./components/ProphetAdvisor";

// Master Viewports definition
type TabId = "showcase" | "presentation" | "techlab";

export default function App() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<TabId>("showcase");

  // Audio state
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Environmental simulation controllers
  const [activeDayId, setActiveDayId] = useState<number>(4); // Default to Day 4 as requested
  const [pressureScale, setPressureScale] = useState<number>(78); // Internal atmosphere sealed level
  const [aquiferFlowRate, setAquiferFlowRate] = useState<number>(44); // Subterranean moisture recirc flow
  const [orbitSpeed, setOrbitSpeed] = useState<number>(20); // Analemma orbital ticking rate
  const [vortexSpin, setVortexSpin] = useState<boolean>(true); // central whirlwind active state
  const [sunProgress, setSunProgress] = useState<number>(25);
  const [moonProgress, setMoonProgress] = useState<number>(75);
  const [orbitPlaying, setOrbitPlaying] = useState<boolean>(true);

  // Interface view state (Showcase Tab view toggle)
  const [showcaseViewMode, setShowcaseViewMode] = useState<"render" | "vector">("render");

  // Active grounding element selection in simulator
  const [selectedColumn, setSelectedColumn] = useState<GroundingColumn>(GROUNDING_COLUMNS[2]); // Default Crystalline

  // Presentation state
  const [activeChapterId, setActiveChapterId] = useState<number>(4); // Defaults to chapter 4

  // IVCC Alignment state (Pillar 2 workbook)
  const [selectedCriticalIdx, setSelectedCriticalIdx] = useState<number>(-1);
  const [customCriticalInput, setCustomCriticalInput] = useState("");
  const [alignedAffirmation, setAlignedAffirmation] = useState<string | null>(null);
  const [alignmentVisualTrigger, setAlignmentVisualTrigger] = useState(false);

  // Video feed interactive controllers
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Modal displays
  const [showEmbassyModal, setShowEmbassyModal] = useState(false);

  // Real-time Waveform Oscilloscope Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Automatic Celestial Clockwork Analemma Orbit Ticking Loop
  useEffect(() => {
    let lastTime = performance.now();
    const tick = (now: number) => {
      if (orbitPlaying) {
        const delta = (now - lastTime) / 1000;
        const increment = (orbitSpeed * delta) * 0.4;
        setSunProgress((prev) => (prev + increment) % 100);
        setMoonProgress((prev) => (prev + increment) % 100);
      }
      lastTime = now;
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [orbitPlaying, orbitSpeed]);

  // Audio Synthesizer Engine (Initializes audio Context on first user click)
  const playTone = (frequency: number, label: string) => {
    if (isMuted) return;

    try {
      if (!audioCtxRef.current) {
        // Create browser-level AudioContext
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Simple ADSR synthesizer node
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // ADSR configuration
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.15); // soft strike attack
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2); // ring-out decay

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.error("Synthesizer error:", e);
    }
  };

  // Oscilloscope canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localFrame: number;
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#00ffcc";

      // Calculate composite sine-wave coordinates representing 3-6-9 frequency equations
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        // Base frequency 1
        const term1 = Math.sin(x * 0.02 + phase) * 20;
        // Vortex core multiplier
        const term2 = Math.sin(x * 0.05 - phase * 1.5) * 8 * (vortexSpin ? 1.5 : 0.5);
        // Pressure envelope modulator
        const term3 = Math.cos(x * 0.005 + phase * 0.5) * 12 * (pressureScale / 100);

        const y = canvas.height / 2 + term1 + term2 + term3;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;

      // Draw secondary matrix energy lines
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 15) {
        const h = Math.abs(Math.sin(x * 0.1 + phase)) * 15;
        ctx.moveTo(x, canvas.height - 4);
        ctx.lineTo(x, canvas.height - 4 - h);
      }
      ctx.stroke();

      phase += 0.04;
      localFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(localFrame);
  }, [vortexSpin, pressureScale]);

  // Handler for custom IVCC Workbook De-Polarize action
  const handleDePolarize = () => {
    let originalCriticalText = "";
    let responsiveSupportiveText = "";

    if (selectedCriticalIdx >= 0) {
      originalCriticalText = DIALOGUE_PRESETS[selectedCriticalIdx].critical;
      responsiveSupportiveText = DIALOGUE_PRESETS[selectedCriticalIdx].supportive;
    } else if (customCriticalInput.trim() !== "") {
      originalCriticalText = customCriticalInput;
      // Synthesize a corresponding covenant response dynamically
      responsiveSupportiveText = `Covenant Alignment restores: The critical thought '${customCriticalInput}' has been completely de-polarized. The living matrix claims absolute equilibrium, ensuring infinite support under pneuma laws.`;
    } else {
      return; // No input
    }

    // Play therapeutic resonance
    playTone(528, "Covenant Heart Key (528Hz)");
    setTimeout(() => {
      playTone(396, "Grounding Sub-Core (396Hz)");
    }, 200);

    setAlignedAffirmation(responsiveSupportiveText);
    setAlignmentVisualTrigger(true);

    // Turn off animation trigger after short pulse
    setTimeout(() => {
      setAlignmentVisualTrigger(false);
    }, 1200);
  };

  // Fast redirect from Footer and Header clicks directly into localized Syllabus Lesson 8
  const handleRedirectToIVCC = () => {
    setActiveTab("presentation");
    setActiveChapterId(7); // Index 7 corresponds to Module 8: IVCC Workbook
    playTone(741, "Lesson Leap Access (741Hz)");
  };

  // Standard creation timeline active day step function
  const handleTimelineDaySelect = (day: CreationDay) => {
    setActiveDayId(day.id);
    setPressureScale(Math.round(day.pressureAtm * 35));
    setAquiferFlowRate(Math.round(day.vortexFrequencyHz / 10));
    playTone(day.vortexFrequencyHz, `Day ${day.id} Transition: ${day.vortexFrequencyHz}Hz`);
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden antialiased selection:bg-cyan-500/30 selection:text-white">
      
      {/* Background Ambience overlays */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0b132b]/40 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-900/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[5%] w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* HEADER: Lion & Shield coat of arms, main titles and Full-Stack capability badge */}
      <header className="relative z-10 border-b border-slate-900 bg-[#060c18]/90 backdrop-blur-md px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Decorative Arms left aligned */}
          <div className="flex items-center gap-3.5">
            {/* Elegant SVG Custom Coat Of Arms (Lion & Crown Shield) */}
            <div className="w-12 h-12 bg-slate-950 rounded-lg p-1 border border-amber-500/40 shadow-lg flex items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500">
                {/* Shield Body */}
                <path d="M 50,12 L 82,24 C 82,60 50,88 50,88 C 50,88 18,60 18,24 Z" fill="#0c1935" stroke="#f59e0b" strokeWidth="2.5" />
                {/* Cross partition */}
                <line x1="50" y1="12" x2="50" y2="88" stroke="#d97706" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="18" y1="42" x2="82" y2="42" stroke="#d97706" strokeWidth="1" strokeDasharray="3,3" />
                {/* Crown symbol in center */}
                <path d="M 42,42 L 50,30 L 58,42 L 54,49 L 46,49 Z" fill="#f59e0b" />
                {/* Anchor star on left */}
                <circle cx="34" cy="33" r="3" fill="#ffffff" />
                <line x1="34" y1="28" x2="34" y2="38" stroke="#ffffff" strokeWidth="1" />
                <line x1="29" y1="33" x2="39" y2="33" stroke="#ffffff" strokeWidth="1" />
                {/* Protective Lion profile right wings */}
                <path d="M 64,28 Q 72,33 66,45 Q 60,33 64,28 Z" fill="#d97706" opacity="0.8" />
              </svg>
              {/* Little glowing crown marker star */}
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-cyan-400 rounded-full border border-white" />
            </div>

            {/* Authoritative Gilded Titles */}
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-2xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 hover:brightness-110 transition-all duration-300">
                THE REAL BOOK OF LIFE
              </h1>
              <p className="text-[10px] sm:text-xs font-mono text-cyan-400 font-medium tracking-wide">
                Pneuma Physics • Pressurized Firmament • 3-6-9 Vortex Mathematics
              </p>
            </div>
          </div>

          {/* Quick interactive utility center links & status badge */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Audio Synth status bar */}
            <button
              onClick={() => {
                const prev = isMuted;
                setIsMuted(!prev);
                if (prev) {
                  // played immediately as confirmation
                  setTimeout(() => playTone(432, "Audio Sandbox Activated"), 100);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase transition-all duration-300 cursor-pointer ${
                isMuted
                  ? "bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300"
                  : "bg-cyan-950/40 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              }`}
              title="Toggle Web Audio Synthesizer Feedback Tone"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Synth: Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                  <span className="glow-text-cyan">Synth: Active</span>
                </>
              )}
            </button>

            {/* Level status green bill pill */}
            <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-full py-1.5 px-3.5 flex items-center gap-2 text-xs font-mono text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] select-none">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span>V2.5 FULL-STACK</span>
            </div>
          </div>

        </div>
      </header>

      {/* LINGUISTIC WATERMARK CANOPY - Faded scripture run overlay */}
      <div className="bg-[#030712] border-b border-slate-950 py-1.5 px-4 h-8 overflow-hidden select-none relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-10" />
        <div className="flex justify-around items-center gap-10 text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-cyan-500/15 whitespace-nowrap animate-pulse">
          <span>יְהִי אוֹר • Let There Be Light • Frequency Core 432Hz</span>
          <span>רָקִיעַ • Crystalline Dome • sealed vacuum</span>
          <span>עַמּוּד • Foundational Columns • pneuma discharge</span>
          <span>מַבְדִּיל • Division above and below</span>
        </div>
      </div>

      {/* THE THREE-TAB NAVIGATION DECK */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-4 pt-5 pb-3">
        <div className="bg-[#0a1122]/90 p-1.5 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-2">
          
          {/* Tab 1: System Showcase */}
          <button
            onClick={() => {
              setActiveTab("showcase");
              playTone(288, "Showcase Active");
            }}
            className={`py-3.5 px-2.5 rounded-lg flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "showcase"
                ? "bg-slate-950 border border-cyan-500/60 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Globe className={`w-4 h-4 ${activeTab === "showcase" ? "text-cyan-400 animate-spin" : "text-slate-400"}`} style={{ animationDuration: "25s" }} />
            <span>SYSTEM SHOWCASE</span>
          </button>

          {/* Tab 2: Presentations & Slides */}
          <button
            onClick={() => {
              setActiveTab("presentation");
              playTone(324, "Presentations Active");
            }}
            className={`py-3.5 px-2.5 rounded-lg flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "presentation"
                ? "bg-slate-950 border border-pink-500/60 text-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.25)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>PRESENTATIONS &amp; SLIDES</span>
          </button>

          {/* Tab 3: Technical Lab */}
          <button
            onClick={() => {
              setActiveTab("techlab");
              playTone(384, "Technical Lab Active");
            }}
            className={`py-3.5 px-2.5 rounded-lg flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "techlab"
                ? "bg-slate-950 border border-amber-500/60 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Sliders className="w-4 h-4 animate-pulse" />
            <span>ILLUSTRATIONS / LAB</span>
          </button>

        </div>
      </nav>

      {/* VIEWPORT AREA: Rendered dynamically depending on Active Tab Selector */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 py-3">
        
        {/* ==================== TAB 1: SYSTEM SHOWCASE ==================== */}
        {activeTab === "showcase" && (
          <div className="animate-tab-fade space-y-6">
            
            {/* Main Graphics Display and Controller Wrapper */}
            <div className="bg-slate-900/20 rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    Sovereign Closed-Sphere Cell Architecture
                  </h2>
                  <p className="text-xs text-slate-400">
                    Showing flat land plane isolation and deep subterranean recycling cascades.
                  </p>
                </div>

                {/* Graphics Mode Controller (Render vs Vector) */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Visualization:</span>
                  <div className="bg-slate-950 p-1 rounded-lg border border-slate-800/80 flex gap-1 flex-1 sm:flex-initial">
                    <button
                      onClick={() => {
                        setShowcaseViewMode("render");
                        playTone(288, "Render Mode Selected");
                      }}
                      className={`flex-1 sm:flex-initial py-1.5 px-3.5 rounded text-xs font-mono uppercase cursor-pointer transition-all ${
                        showcaseViewMode === "render"
                          ? "bg-cyan-950 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      3D Model Render
                    </button>
                    <button
                      onClick={() => {
                        setShowcaseViewMode("vector");
                        playTone(324, "Vector Schematic Selected");
                      }}
                      className={`flex-1 sm:flex-initial py-1.5 px-3.5 rounded text-xs font-mono uppercase cursor-pointer transition-all ${
                        showcaseViewMode === "vector"
                          ? "bg-cyan-950 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      3D Vector Blueprint
                    </button>
                  </div>
                </div>
              </div>

              {/* Large Frame display */}
              <div className="relative">
                {showcaseViewMode === "render" ? (
                  // Rendering static high-fidelity conceptual image representation from blueprints
                  <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
                    
                    {/* Refactored Master Depiction Image utilizing secure preview iframe */}
                    <iframe
                      src="https://drive.google.com/file/d/1kA7kHcYKAlVyMhIR8RzXDDJv_16-9K9f/preview"
                      width="100%"
                      height="500"
                      style={{ border: "none", borderRadius: "6px", backgroundColor: "#050b14" }}
                    ></iframe>

                    {/* Highly stylized custom vector fallback element inside render tab if img not found */}
                    <div
                      id="showcase-render-fallback"
                      className="hidden absolute inset-0 w-full h-full"
                    >
                      <div className="w-full h-full bg-slate-950/90 rounded-lg flex flex-col items-center justify-center p-5 border border-dashed border-cyan-500/20 relative">
                        <div className="absolute top-[10%] w-[180px] h-[180px] bg-cyan-500/5 rounded-full blur-[40px] animate-pulse" />
                        <Compass className="w-16 h-16 text-cyan-500/40 animate-spin mb-4" style={{ animationDuration: "40s" }} />
                        <h4 className="text-cyan-400 font-display text-xs uppercase tracking-widest font-bold mb-2">
                          [ HIGH-RESOLUTION DEMO RENDER STANDBY ]
                        </h4>
                        <p className="text-[11px] text-slate-400 text-center max-w-sm mb-6 leading-relaxed">
                          Image path `/images/1000116952.png` is currently running in Vector Emulation Mode. Click the &apos;3D Vector Blueprint&apos; button above to interact with the real-time simulation dials.
                        </p>
                        
                        {/* Static preview badge mimicking the original art */}
                        <div className="grid grid-cols-4 gap-2 w-full max-w-md p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-center font-mono text-[9px] text-cyan-500">
                          <div>Pressure: 2.2 Atm</div>
                          <div>Aquifers: Continuous</div>
                          <div>Shield: 100% Sealed</div>
                          <div>Root: Tesla 3-6-9</div>
                        </div>
                      </div>
                    </div>

                    {/* Futuristic Schematic Overlay Labels */}
                    <div className="absolute top-4 left-4 p-3 bg-slate-950/85 border border-cyan-500/20 rounded-lg font-mono text-[10px] text-cyan-300 leading-snug space-y-1 backdrop-blur pointer-events-none">
                      <div>SPECIES STATUS: STABLE</div>
                      <div className="text-amber-400">MATRIC CODENAME: R-B-L_V25</div>
                      <div className="text-slate-500">Day 4: Celestial Atmosphere Orbiting Active</div>
                    </div>

                    {/* Scribe quote banner overlay */}
                    <div className="absolute bottom-4 inset-x-4 p-3 bg-slate-950/90 border border-slate-800 rounded-lg font-mono text-center text-[10px] sm:text-xs text-slate-300 backdrop-blur pointer-events-none">
                      &ldquo;Full Structural Dermis &amp; Containment: 3D Model Render&rdquo;
                    </div>
                  </div>
                ) : (
                  // Vector design element: interactive SVG with dials mapping
                  <div className="animate-tab-fade">
                    <CosmicDomeSVG
                      dayId={activeDayId}
                      sunProgress={sunProgress}
                      moonProgress={moonProgress}
                      pressureScale={pressureScale}
                      aquiferFlowRate={aquiferFlowRate}
                      vortexSpin={vortexSpin}
                      activeLayers={CREATION_DAYS[activeDayId - 1].activeLayers}
                      selectedColumnId={selectedColumn.id}
                      onSelectColumn={(col) => setSelectedColumn(col)}
                      onTriggerSound={(freq, lbl) => playTone(freq, lbl)}
                    />
                    <p className="text-[10px] font-mono text-slate-500 text-center mt-2.5">
                      💡 Click on the SUN, MOON, or underground COLUMN pillars inside the SVG diagram above to run tone frequency bursts!
                    </p>
                  </div>
                )}
              </div>

              {/* Showcase Footer Status Readout */}
              <div className="mt-5 border-t border-slate-800 pb-1.5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-400">
                <div className="flex items-center gap-2.5 text-center sm:text-left">
                  <Activity className="w-4 h-4 text-emerald-400 text-center sm:text-left animate-pulse" />
                  <span>
                    System State: <strong className="text-emerald-400 glow-text-emerald">Sealed Pressurized Containment</strong>
                  </span>
                  <span className="hidden sm:inline text-slate-700">|</span>
                  <span className="hidden sm:inline">
                    Internal Atmosphere: <strong className="text-slate-200">78% Vacuum Sealed constant</strong>
                  </span>
                </div>
                <div className="text-[11px] text-cyan-400 flex items-center gap-1 bg-cyan-950/50 border border-cyan-500/20 px-2.5 py-1 rounded-full select-none">
                  <Shield className="w-3 h-3 animate-pulse" />
                  <span>Hydrostatic Edge Waterfall circulation: Loop Active</span>
                </div>
              </div>

            </div>

            {/* Quick-touch informational grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {GROUNDING_COLUMNS.map((col) => (
                <div
                  key={col.id}
                  onClick={() => {
                    setSelectedColumn(col);
                    playTone(col.frequency, `Column info: ${col.name}`);
                  }}
                  className={`bg-slate-900/10 hover:bg-slate-900/35 border p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedColumn.id === col.id
                      ? "border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)] bg-slate-900/30"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      {col.name}
                    </span>
                    <span className="text-[10px] font-mono text-amber-500 font-bold">{col.frequency}Hz</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                    {col.description}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between border-t border-slate-800/60 pt-2">
                    <span>Theology: {col.theologyRef}</span>
                    <span className="text-emerald-500">Integrity: {col.integrity}%</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== TAB 2: PRESENTATIONS & SLIDES ==================== */}
        {activeTab === "presentation" && (
          <div className="animate-tab-fade grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sidebar Chapter Indexer Selector */}
            <div className="lg:col-span-4 bg-slate-900/30 rounded-xl border border-slate-800/80 p-4 space-y-2 h-[550px] overflow-y-auto">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-3 px-1.5 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>INDEXED MATRIX sYLLABUS</span>
              </h3>

              {CREATION_DAYS.map((day) => {
                const isActive = activeChapterId === day.id - 1;
                return (
                  <button
                    key={day.id}
                    onClick={() => {
                      setActiveChapterId(day.id - 1);
                      playTone(day.vortexFrequencyHz, `Lesson Select: ${day.title}`);
                    }}
                    className={`w-full p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                      isActive
                        ? "bg-slate-950 border-pink-500/60 text-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.15)]"
                        : "bg-transparent border-slate-850 text-slate-400 hover:bg-slate-900/30 hover:border-slate-800"
                    }`}
                  >
                    <div className={`p-1 rounded font-mono text-xs font-bold leading-none ${
                      isActive ? "bg-pink-950 text-pink-300" : "bg-slate-950 text-slate-500"
                    }`}>
                      {day.id}
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-wide">{day.title.split(": ")[1]}</div>
                      <div className="text-[10px] opacity-70 font-mono mt-0.5">{day.scriptureRef || "Syllabus Track"}</div>
                    </div>
                  </button>
                );
              })}

              {/* Lesson 8 dedicated card (IVCC Course Option) */}
              <button
                onClick={() => {
                  setActiveChapterId(7); // Index 7 corresponds to Module 8
                  playTone(963, "IVCC Lesson Loaded");
                }}
                className={`w-full p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                  activeChapterId === 7
                    ? "bg-slate-950 border-pink-500/60 text-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.15)]"
                    : "bg-transparent border-slate-850 text-slate-400 hover:bg-slate-900/30 hover:border-slate-800"
                }`}
              >
                <div className={`p-1 rounded font-mono text-xs font-bold leading-none ${
                  activeChapterId === 7 ? "bg-pink-950 text-pink-300" : "bg-slate-950 text-slate-500"
                }`}>
                  8
                </div>
                <div>
                  <div className="text-xs font-bold tracking-wide">Pillar 2: IVCC Workbook</div>
                  <div className="text-[10px] opacity-70 font-mono mt-0.5">Inner Voice Correction Course</div>
                </div>
              </button>
            </div>

            {/* Projection viewport screen */}
            <div className="lg:col-span-8 bg-slate-900/10 rounded-xl border border-slate-800/80 p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between h-[550px] overflow-y-auto">
              
              {/* If general chapter 1 to 7 is loaded */}
              {activeChapterId < 7 ? (
                <div className="space-y-4 animate-tab-fade">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-pink-500 uppercase font-bold tracking-wider">
                        Syllabus Slide Projection Viewport
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold font-display text-slate-200 mt-1">
                        {CREATION_DAYS[activeChapterId].title}
                      </h2>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 select-none">
                      Vortex Freq: {CREATION_DAYS[activeChapterId].vortexFrequencyHz}Hz
                    </span>
                  </div>

                  <p className="text-sm font-light text-slate-300 leading-relaxed italic">
                    &ldquo;{CREATION_DAYS[activeChapterId].subtitle}&rdquo;
                  </p>

                  {/* scripture quote box */}
                  <div className="bg-[#0c1322] border-l-2 border-amber-500 p-4 rounded-r-lg space-y-1.5 shadow-inner">
                    <div className="text-[10px] font-mono font-bold text-amber-500 flex items-center justify-between">
                      <span>SCRIPTURAL BINDING INTEGRATION</span>
                      <span>{CREATION_DAYS[activeChapterId].scriptureRef}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-serif font-semibold text-slate-200 leading-relaxed text-right tracking-wide">
                      {CREATION_DAYS[activeChapterId].scriptureText}
                    </p>
                  </div>

                  {/* Syllabus body details */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono text-pink-400 font-bold block uppercase tracking-wider">
                      THEOLOGICAL-SCIENTIFIC MECHANICS:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {CREATION_DAYS[activeChapterId].summary}
                    </p>
                  </div>

                  {/* Telemetry settings during this timeline day */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-950/60 rounded-lg border border-slate-850 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Atmospheric Pressure</span>
                      <strong className="text-cyan-400 font-medium leading-none mt-1 inline-block">
                        {CREATION_DAYS[activeChapterId].pressureAtm.toFixed(2)} Atm
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Pneuma Temp</span>
                      <strong className="text-slate-200 font-medium leading-none mt-1 inline-block">
                        {CREATION_DAYS[activeChapterId].tempK.toFixed(1)} K
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Simulation Layers</span>
                      <strong className="text-pink-400 block text-[9px] mt-1 leading-normal">
                        {CREATION_DAYS[activeChapterId].activeLayers.slice(0, 2).join(", ")}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                /* LESSON 8: IVCC Workbook Panel - Inner Voice Correction Course */
                <div className="space-y-4 animate-tab-fade">
                  <div className="flex items-center justify-between border-b border-pink-900/40 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-pink-500 uppercase font-bold tracking-wider">
                        IVCC Course Pillar 2 Workbook
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold font-display text-pink-300 mt-1">
                        Supportive vs. Critical Internal Dialogue
                      </h2>
                    </div>
                    <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/30 px-2.5 py-1 rounded border border-emerald-500/30 uppercase select-none">
                      Equilibrium Tool
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    According to pneuma-physics parameters, chaotic internal self-dialogue compromises micro-biological cellular frequencies. The exercise below aligns dissonant, critical limiting voices with Supportive Covenant Affirmation structures to restore homeostasis.
                  </p>

                  {/* Interactive Alignment Tool */}
                  <div className="space-y-3 pt-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                      Choose a critical voice preset or type a custom thought:
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {DIALOGUE_PRESETS.map((p, idx) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedCriticalIdx(idx);
                            setCustomCriticalInput("");
                            setAlignedAffirmation(null);
                            playTone(432, "Preset Selected");
                          }}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                            selectedCriticalIdx === idx
                              ? "bg-pink-950/50 border-pink-400 text-pink-200"
                              : "bg-slate-950 text-slate-450 border-slate-900 hover:bg-slate-900/60"
                          }`}
                        >
                          <div className="font-mono text-[9px] text-pink-500 font-bold mb-1">DISSONANCE PRESET {p.id}</div>
                          &ldquo;{p.critical}&rdquo;
                        </button>
                      ))}
                    </div>

                    {/* Custom input field */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customCriticalInput}
                        onChange={(e) => {
                          setCustomCriticalInput(e.target.value);
                          setSelectedCriticalIdx(-1);
                          setAlignedAffirmation(null);
                        }}
                        placeholder="Or write custom critical self-dialogue here..."
                        className="flex-1 bg-slate-950 border border-slate-900 rounded-lg p-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500/50"
                      />
                    </div>

                    {/* Trigger alignment button */}
                    <button
                      onClick={handleDePolarize}
                      disabled={selectedCriticalIdx === -1 && customCriticalInput.trim() === ""}
                      className={`w-full py-3 px-4 rounded-xl font-mono text-center text-xs font-bold cursor-pointer transition-all uppercase flex items-center justify-center gap-2 ${
                        alignmentVisualTrigger
                          ? "bg-emerald-600 text-white animate-pulse"
                          : "bg-pink-950 text-pink-300 hover:bg-pink-900 hover:text-pink-100 border border-pink-600/50"
                      } disabled:opacity-40 disabled:pointer-events-none`}
                    >
                      <span>De-Polarize &amp; Align ⚡</span>
                    </button>
                  </div>

                  {/* Aligned Supportive Affirmation output box */}
                  {alignedAffirmation && (
                    <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-lg animate-tab-fade flex items-start gap-3">
                      <div className="p-1 rounded bg-emerald-950 border border-emerald-400/40 text-emerald-400">
                        <Award className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1 uppercase tracking-wider">
                          SUPPORTIVE COVENANT ALIGNMENT DECLARATION
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-emerald-200 leading-normal">
                          {alignedAffirmation}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Training syllabus warning notice */}
              <div className="text-[11px] font-mono text-slate-500 leading-normal border-t border-slate-800/60 pt-4.5">
                Note: Standard presentations are verified by peer-reviewed spiritual sciences. For further study on other research papers, request Scribe consultation in the Technical Scribe Tool.
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 3: TECHNICAL LAB ==================== */}
        {activeTab === "techlab" && (
          <div className="animate-tab-fade grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: manual environmental variables & orbit emulators */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Physics dashboard switches */}
              <div className="bg-slate-900/20 rounded-xl border border-slate-800/80 p-5 shadow-lg backdrop-blur-sm space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>HYDRAULIC &amp; VORTEX INPUTS</span>
                </h3>

                {/* Pressure controller slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Sealed Enclosure Pressure</span>
                    <strong className="text-cyan-400 font-mono font-bold">{pressureScale}% Atmospheric Scale</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={pressureScale}
                    onChange={(e) => {
                      setPressureScale(parseInt(e.target.value));
                      playTone(parseInt(e.target.value) * 3 + 100, "Pressure Tune");
                    }}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <span className="text-[9px] text-slate-500 block">
                    Modulates the vacuum envelope integrity state. (2.4 Atm constant).
                  </span>
                </div>

                {/* Ground aquifer recirculation flow rate */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Subterranean Moisture Flow</span>
                    <strong className="text-emerald-400 font-mono font-bold">{aquiferFlowRate} m/s Recycle</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={aquiferFlowRate}
                    onChange={(e) => {
                      setAquiferFlowRate(parseInt(e.target.value));
                      playTone(parseInt(e.target.value) * 2 + 100, "Flow Tune");
                    }}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <span className="text-[9px] text-slate-500 block">
                    Recovers spilled sea waters from the base reservoir back to regional pools.
                  </span>
                </div>

                {/* Orbit ticking dials speed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Sun &amp; Moon Orbital Velocity</span>
                    <strong className="text-amber-400 font-mono font-bold">{orbitSpeed}x Chronos</strong>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="100"
                    value={orbitSpeed}
                    onChange={(e) => {
                      setOrbitSpeed(parseInt(e.target.value));
                      playTone(parseInt(e.target.value) * 4 + 100, "Orbit Velocity Tune");
                    }}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="text-[9px] text-slate-500 block">
                    Scales the figure-8 analemma cycle rate inside the glass dome.
                  </span>
                </div>

                {/* Vortex doubling state and Play Orbit button */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      const next = !orbitPlaying;
                      setOrbitPlaying(next);
                      playTone(next ? 432 : 111, next ? "Orbit Resume" : "Orbit Paused");
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg border text-[11px] font-mono cursor-pointer uppercase transition-colors text-center ${
                      orbitPlaying
                        ? "bg-amber-950/40 text-amber-400 border-amber-600/30"
                        : "bg-slate-950 text-slate-400 border-slate-900"
                    }`}
                  >
                    {orbitPlaying ? "⏸ Pause Analemma" : "▶ Start Analemma"}
                  </button>

                  <button
                    onClick={() => {
                      const next = !vortexSpin;
                      setVortexSpin(next);
                      playTone(next ? 333 : 111, next ? "Vortex Wave Amplified" : "Vortex Off");
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg border text-[11px] font-mono cursor-pointer uppercase transition-colors text-center ${
                      vortexSpin
                        ? "bg-teal-950/40 text-teal-400 border-teal-600/30 font-bold"
                        : "bg-slate-950 text-slate-400 border-slate-900"
                    }`}
                  >
                    {vortexSpin ? "🟢 Vortex Core On" : "🔴 Vortex Core Off"}
                  </button>
                </div>
              </div>

              {/* Real-time Oscilloscope Waves Viewport */}
              <div className="bg-slate-900/20 rounded-xl border border-slate-800/80 p-4 shadow-lg backdrop-blur-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                    Composite Wave Oscillator
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-cyan-400">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>REAL-TIME FEEDS</span>
                  </div>
                </div>

                <canvas
                  ref={canvasRef}
                  width="380"
                  height="120"
                  className="w-full h-24 bg-slate-950 rounded-lg border border-slate-900 block"
                />

                <span className="text-[10px] text-slate-500 font-mono leading-normal block">
                  Translates mechanical data inputs (Containment Atmosphere and Central Vortex Core speed) into unified energy curves.
                </span>
              </div>

            </div>

            {/* RIGHT COLUMN: Cinematic Video Loop and AI prophet Advisor solver */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Feature A: Cinematic 10s Loop */}
              <div id="cinematic-player-panel" className="bg-[#0b132b]/80 rounded-xl border-2 border-cyan-500/20 p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3 border-b border-cyan-800/30 pb-2">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-cyan-400 font-display uppercase tracking-widest">
                      System Motion Preview (Cinematic)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-500 uppercase px-2 py-0.5 bg-cyan-950 border border-cyan-800/40 rounded">
                    genesis_matrix_10s.mp4
                  </span>
                </div>

                {/* Video container */}
                <div className="relative aspect-[16/9] w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 group">
                  {!videoError ? (
                    <iframe
                      id="genesis-matrix-player"
                      src="https://drive.google.com/file/d/1NRXrjddX3BPrawVq3k7bQ1cOKfg3UjOW/preview"
                      width="100%"
                      height="450"
                      allow="autoplay"
                      style={{ border: "none", borderRadius: "6px", backgroundColor: "#050b14" }}
                    ></iframe>
                  ) : (
                    /* Holographic vector background illustration standby */
                    <div className="w-full h-full bg-slate-950/70 flex flex-col items-center justify-center p-6 text-center select-none relative">
                      <div className="absolute top-[30%] w-[120px] h-[120px] bg-cyan-500/10 rounded-full blur-[30px] animate-pulse" />
                      <Activity className="w-12 h-12 text-cyan-400/40 animate-pulse mb-3" />
                      <h4 className="text-xs uppercase tracking-widest font-mono text-cyan-300 font-bold mb-1">
                        HOLOGRAPHIC SCHEMATIC STANDBY
                      </h4>
                      <p className="text-[10px] text-slate-500 max-w-sm mb-4 leading-relaxed">
                        Vector preview is active. The high-quality 10-second Genesis Creation sequence loop holds direct physical models.
                      </p>
                      
                      <div className="absolute bottom-3 right-3 font-mono text-[8px] text-cyan-500/40 uppercase">
                        STANDBY MODE: ENGAGED
                      </div>
                    </div>
                  )}

                  {/* Aesthetic Playback Overlay HUD elements */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 to-transparent p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const player = document.getElementById("genesis-matrix-player") as HTMLVideoElement | null;
                          if (player) {
                            if (player && typeof player.play === "function") {
                              if (player.paused) {
                                player.play();
                                setVideoPlaying(true);
                                playTone(396, "Video Resume");
                              } else {
                                player.pause();
                                setVideoPlaying(false);
                                playTone(288, "Video Paused");
                              }
                            } else {
                              // Handle iframe standby mock toggling gracefully
                              const newPlaying = !videoPlaying;
                              setVideoPlaying(newPlaying);
                              playTone(newPlaying ? 396 : 288, newPlaying ? "Video Resume" : "Video Paused");
                            }
                          }
                        }}
                        className="p-1 px-2 text-[10px] bg-slate-950/80 hover:bg-slate-900 rounded border border-slate-700 text-slate-200 cursor-pointer"
                      >
                        {videoPlaying ? "⏸ Pause" : "▶ Play"}
                      </button>

                      {/* Manual mock replay cycle */}
                      <button
                        onClick={() => {
                          const player = document.getElementById("genesis-matrix-player") as HTMLVideoElement | null;
                          if (player) {
                            if (typeof player.play === "function") {
                              player.currentTime = 0;
                              player.play();
                            }
                            playTone(432, "Loop restart");
                          }
                        }}
                        className="p-1 px-2 text-[10px] bg-slate-950/80 hover:bg-slate-900 rounded border border-slate-700 text-slate-200 cursor-pointer"
                        title="Replay from Beginning"
                      >
                        🔄 Replay
                      </button>
                    </div>

                    {/* Mute button */}
                    <button
                      onClick={() => {
                        const player = document.getElementById("genesis-matrix-player") as HTMLVideoElement | null;
                        if (player) {
                          if ("muted" in player) {
                            const mValue = !player.muted;
                            player.muted = mValue;
                            setVideoMuted(mValue);
                            playTone(mValue ? 288 : 528, mValue ? "Mute Active" : "Sound Enabled");
                          } else {
                            const mValue = !videoMuted;
                            setVideoMuted(mValue);
                            playTone(mValue ? 288 : 528, mValue ? "Mute Active" : "Sound Enabled");
                          }
                        }
                      }}
                      className="p-1 px-2 text-[10px] bg-slate-950/80 hover:bg-slate-900 rounded border border-slate-700 text-slate-200 cursor-pointer"
                    >
                      {videoMuted ? "🔇 Unmute Video" : "🔊 Audio On"}
                    </button>
                  </div>
                </div>

                <p className="text-[#a5b1c2] font-sans text-xs mt-2.5 mb-1 leading-normal">
                  [cite: &ldquo;SYSTEM MOTION PREVIEW: Direct 10s Genesis Sequence Loop.&rdquo; Video Asset ]
                </p>
                <span className="text-[10px] text-slate-500 font-mono leading-none block">
                  Direct playback representation of the high-quality sequence loop governed by the master clock structure.
                </span>
              </div>

              {/* Detailed Geological Dermis Scan Table */}
              <div className="bg-slate-900/20 rounded-xl border border-slate-800/80 p-5 shadow-lg space-y-3">
                <span className="text-xs font-mono font-bold tracking-widest text-[#00ffcc] uppercase block">
                  GEOLOGICAL DERMIS CROSS-SECTION SCAN: ACTIVE
                </span>

                <div className="space-y-2">
                  {SEDIMENT_LAYERS.map((layer) => (
                    <div
                      key={layer.id}
                      onClick={() => playTone(333, `Scan: ${layer.name}`)}
                      className="p-2.5 rounded-lg border border-slate-900/80 bg-slate-950/40 hover:bg-slate-950/90 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3.5 h-3.5 rounded-full ${layer.color} border border-slate-800 shadow`} />
                        <div>
                          <strong className="text-slate-200">{layer.name}</strong>
                          <span className="text-[10px] text-slate-500 block">Depth coordinate: {layer.thickness}</span>
                        </div>
                      </div>
                      <div className="text-right text-[11px] font-mono">
                        <span className="text-slate-400 block">{layer.composition}</span>
                        <span className="text-cyan-400 text-[9px]">Moisture Flow Status: {layer.moistureFlow}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stacked Layout for Scribes and Gematria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Linguistic Gematria calculator widget */}
                <GematriaCalculator onTriggerSound={(freq, label) => playTone(freq, label)} />

                {/* Scribe Prophet advisor widget */}
                <ProphetAdvisor
                  dayId={activeDayId}
                  pressureScale={pressureScale}
                  vortexSpin={vortexSpin}
                />
              </div>

            </div>

          </div>
        )}

      </main>

      {/* REFINED GLOBAL HEADER FOOTER */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#060c18]/90 py-5 mt-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left select-none">
          
          {/* Main Claims */}
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold tracking-wider text-slate-400 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span>TRUE SPIRITUAL SCIENCES | PNEUMATOLOGY WELLNESS © 2026</span>
              <span className="hidden md:inline text-slate-700">|</span>
              <span className="text-[#fbbf24] flex items-center gap-1">
                <Sparkle className="w-3.5 h-3.5 animate-pulse text-[#fbbf24]" />
                [cite: &ldquo;CREATION-BASED WORLDVIEW.&rdquo;]
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">
              Established in the Covenant. Registered in the master biological matrix records securely.
            </p>
          </div>

          {/* Core Footer Protocols navigation links */}
          <div className="flex flex-wrap justify-center gap-4.5 text-xs font-mono font-bold">
            <button
              onClick={() => {
                setShowEmbassyModal(true);
                playTone(432, "Kingdom Embassy Portal Open");
              }}
              className="text-[#fbbf24] hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 border-b border-transparent hover:border-amber-400"
            >
              <span>Kingdom Embassy →</span>
            </button>
            <button
              onClick={handleRedirectToIVCC}
              className="text-[#00ffcc] hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1 border-b border-transparent hover:border-cyan-400"
            >
              <span>IVCC Course →</span>
            </button>
          </div>

        </div>
      </footer>

      {/* Modal displaying Kingdom Embassy detail credentials */}
      {showEmbassyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b132b] rounded-2xl border-2 border-amber-500/40 p-6 max-w-md w-full space-y-4 shadow-2xl animate-tab-fade relative">
            <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-amber-500 flex-shrink-0">
                <path d="M 50,12 L 82,24 C 82,60 50,88 50,88 C 50,88 18,60 18,24 Z" fill="#0c1935" stroke="#f59e0b" strokeWidth="2.5" />
                <path d="M 42,42 L 50,30 L 58,42 L 54,49 L 46,49 Z" fill="#f59e0b" />
              </svg>
              <div>
                <h4 className="text-sm font-bold font-display uppercase tracking-widest text-amber-400">
                  Kingdom Embassy Sovereign Portal
                </h4>
                <p className="text-[10px] font-mono text-slate-400">Pneuma Consulate Credentials Approved</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The Kingdom Embassy represents the sovereign non-polarized dimension of covenant wellness. All physical laws, water recirc cycles, and firmament containment metrics operates under the jurisdiction of absolute spiritual truth.
            </p>

            <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg space-y-1.5 font-mono text-[10px]">
              <div className="text-slate-500 uppercase">Registered Consulate Attributes:</div>
              <div className="text-slate-300">Consulate ID: <strong className="text-amber-500">K-E_963_PNEUMA</strong></div>
              <div className="text-slate-300">Status: <strong className="text-emerald-500">Homeostatic Covenant Approved</strong></div>
              <div className="text-slate-300">Coordinate: <strong className="text-cyan-400">Magnetic North Center Vortex</strong></div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowEmbassyModal(false);
                  playTone(288, "Kingdom Embassy Closed");
                }}
                className="flex-1 py-2 px-3 text-xs font-mono font-bold bg-slate-950 text-slate-400 border border-slate-800 rounded-lg hover:text-slate-200 cursor-pointer text-center"
              >
                Close Portal
              </button>
              
              <button
                onClick={() => {
                  setShowEmbassyModal(false);
                  handleRedirectToIVCC(); // redirects to slide 8
                }}
                className="flex-1 py-2 px-3 text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-600/40 rounded-lg hover:bg-amber-900 cursor-pointer text-center"
              >
                Enter IVCC Lesson
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
