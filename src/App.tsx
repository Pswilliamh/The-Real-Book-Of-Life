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
  Shield,
  Lock,
  Music,
  Mic
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
type TabId = "showcase" | "presentation" | "techlab" | "deception";

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
  const [activeDocId, setActiveDocId] = useState<string | null>("real_book_of_life_2");

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
  const [christImageError, setChristImageError] = useState(false);

  // Interactive FAQ / Protocols Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
    <div className="min-h-screen relative bg-gradient-to-br from-[#030712] to-[#0b132b] text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden antialiased selection:bg-cyan-500/30 selection:text-white">
      
      {/* Dynamic Starfield Background Layers */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 stars-layer-1 opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 stars-layer-2 opacity-50 mix-blend-screen" />
        <div className="absolute inset-0 stars-layer-3 opacity-65 mix-blend-screen" />
      </div>

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

            {/* Access IVCC Protocol Dashboard Portal */}
            <a
              href="https://the-real-book-of-life-2-0.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playTone(369, "Accessing IVCC Protocol Dashboard")}
              className="flex items-center gap-2 px-3  py-1.5 rounded-lg border border-[#00ffcc]/30 bg-slate-950/80 hover:bg-[#00ffcc]/10 hover:border-[#00ffcc]/80 text-[#00ffcc] text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_8px_rgba(0,255,204,0.1)] hover:shadow-[0_0_15px_rgba(0,255,204,0.3)] hover:-translate-y-0.5 cursor-pointer relative select-none"
              title="Access IVCC Protocol Dashboard"
            >
              <div className="w-1.5 h-1.5 bg-[#00ffcc] rounded-full animate-pulse shadow-[0_0_4px_#00ffcc]" />
              <span>Access IVCC Protocol Dashboard</span>
            </a>

            {/* Level status green bill pill */}
            <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-full py-1.5 px-3.5 flex items-center gap-2 text-xs font-mono text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] select-none">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span>V2.5 FULL-STACK</span>
            </div>
          </div>

        </div>
      </header>

      {/* LINGUISTIC WATERMARK CANOPY - Faded scripture run overlay */}
      <div className="bg-[#030712] border-b border-slate-950 py-1.5 px-4 h-8 overflow-hidden select-none relative z-10">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-10" />
        <div className="flex justify-around items-center gap-10 text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase whitespace-nowrap">
          <span className="text-glow-light-pulse">יְהִי אוֹר • Let There Be Light • Frequency Core 432Hz</span>
          <span className="text-cyan-500/30">רָקִיעַ • Crystalline Dome • sealed vacuum</span>
          <span className="text-cyan-500/30">עַמּוּד • Foundational Columns • pneuma discharge</span>
          <span className="text-cyan-500/30">מַבְדִּיל • Division above and below</span>
        </div>
      </div>

      {/* THE FOUR-TAB NAVIGATION DECK */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-4 pt-5 pb-3">
        <div className="bg-[#0a1122]/90 p-1.5 rounded-xl border border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-2">
          
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

          {/* Tab 4: FCR Deception Model */}
          <button
            onClick={() => {
              setActiveTab("deception");
              playTone(396, "FCR Deception Active");
            }}
            className={`py-3.5 px-2.5 rounded-lg flex flex-col md:flex-row items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "deception"
                ? "bg-slate-950 border border-purple-500/60 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Shield className="w-4 h-4 animate-pulse text-purple-400" />
            <span>FCR DECEPTION MODEL</span>
          </button>

        </div>
      </nav>

      {/* VIEWPORT AREA: Rendered dynamically depending on Active Tab Selector */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 py-3">
        
        {/* ==================== 5-STEP SYSTEM NAVIGATION GUIDE ==================== */}
        <div className="mb-8">
          <div className="bg-[#070d19]/80 rounded-xl border border-cyan-500/20 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)] backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3 border-b border-cyan-500/10 pb-2">
              <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
              <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                Sovereign System Navigation Guide
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              
              {/* Step 1 */}
              <div 
                onClick={() => {
                  if (isMuted) {
                    setIsMuted(false);
                    setTimeout(() => playTone(432, "Audio Sandbox Activated"), 100);
                  } else {
                    playTone(288, "Synth Status Confirmed");
                  }
                }}
                className="group cursor-pointer bg-[#0c1529]/40 hover:bg-[#101b35]/60 hover:border-cyan-500/40 p-3 rounded-lg border border-slate-800/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-[11px] font-mono font-bold text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                      1
                    </span>
                    <strong className="text-slate-200 text-xs font-mono group-hover:text-cyan-300 transition-colors">
                      Initiate System
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    <span className="font-semibold text-slate-300">[Step 1: Initiate System]</span> Observe the operational status check and ensure{' '}
                    <span className="text-cyan-400 underline decoration-cyan-500/30 group-hover:decoration-cyan-400">
                      &apos;SYNTH: ACTIVE&apos;
                    </span>{' '}
                    is initialized.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div 
                onClick={() => {
                  setActiveTab("showcase");
                  playTone(288, "Examine Showcase viewport");
                }}
                className="group cursor-pointer bg-[#0c1529]/40 hover:bg-[#101b35]/60 hover:border-cyan-500/40 p-3 rounded-lg border border-slate-800/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-[11px] font-mono font-bold text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                      2
                    </span>
                    <strong className="text-slate-200 text-xs font-mono group-hover:text-cyan-300 transition-colors">
                      Examine Showcase
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    <span className="font-semibold text-slate-300">[Step 2: Examine Showcase]</span> Review the master Closed-Sphere Cell Architecture cross-section render on center stage.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div 
                onClick={() => {
                  setActiveTab("showcase");
                  setTimeout(() => {
                    document.getElementById("cinematic-player-panel")?.scrollIntoView({ behavior: "smooth" });
                    playTone(432, "Anchor scroll trigger");
                  }, 120);
                }}
                className="group cursor-pointer bg-[#0c1529]/40 hover:bg-[#101b35]/60 hover:border-cyan-500/40 p-3 rounded-lg border border-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-[0_0_12px_rgba(6,182,212,0.03)]"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-[11px] font-mono font-bold text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                      3
                    </span>
                    <strong className="text-slate-200 text-xs font-mono group-hover:text-cyan-300 transition-colors">
                      Toggle Motion
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    <span className="font-semibold text-slate-300">[Step 3: Toggle Motion]</span> Click the{' '}
                    <span className="text-cyan-300 underline decoration-cyan-400/50 font-medium hover:text-cyan-100 transition-colors">
                      &apos;10 Second Creation Illustration&apos; link
                    </span>{' '}
                    to jump seamlessly to the live kinetic simulation loop.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div 
                onClick={() => {
                  setActiveTab("presentation");
                  playTone(324, "Presentations Active");
                }}
                className="group cursor-pointer bg-[#0c1529]/40 hover:bg-[#101b35]/60 hover:border-cyan-500/40 p-3 rounded-lg border border-slate-800/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-[11px] font-mono font-bold text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                      4
                    </span>
                    <strong className="text-slate-200 text-xs font-mono group-hover:text-pink-300 transition-colors">
                      Analyze Decks
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    <span className="font-semibold text-slate-300">[Step 4: Analyze Decks]</span> Select the{' '}
                    <span className="text-pink-400 font-medium group-hover:underline">
                      &apos;Presentations &amp; Slides&apos; tab
                    </span>{' '}
                    to review foundational structural blueprints and IVCC course parameters.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div 
                onClick={() => {
                  setActiveTab("techlab");
                  playTone(384, "Technical Lab Active");
                }}
                className="group cursor-pointer bg-[#0c1529]/40 hover:bg-[#101b35]/60 hover:border-cyan-500/40 p-3 rounded-lg border border-slate-800/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-[11px] font-mono font-bold text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                      5
                    </span>
                    <strong className="text-slate-200 text-xs font-mono group-hover:text-amber-300 transition-colors">
                      Access Protocols
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    <span className="font-semibold text-slate-300">[Step 5: Access Protocols]</span> Navigate to the{' '}
                    <span className="text-amber-400 font-medium group-hover:underline">
                      &apos;Illustrations / Lab&apos; tab
                    </span>{' '}
                    to study localized real-time telemetry variables and frequency metrics.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
        
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

            {/* THE GENESIS PROTOCOL: SEVEN TIERS OF DIMENSIONAL GOVERNANCE */}
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden select-none mt-6" onContextMenu={(e) => e.preventDefault()}>
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-2">
                <div>
                  <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                    Sovereign Constitutional Charter
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide text-slate-100 mt-1">
                    THE GENESIS PROTOCOL: SEVEN TIERS OF DIMENSIONAL GOVERNANCE
                  </h3>
                </div>
                <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-[9px] text-[#fbbf24] font-bold">
                  CONSTITUTIONAL INDEX: SYSTEMIC REIGN
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {/* Day 1 */}
                <div className="bg-[#040812] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/[0.02] rounded-full blur-lg pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">01</span>
                    <span className="px-1.5 py-0.5 bg-emerald-950/60 border border-emerald-500/30 rounded text-[8px] font-mono font-bold text-emerald-400">
                      ACTIVE
                    </span>
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-slate-100 tracking-tight uppercase leading-snug">
                      [LIGHT RATIO EMISSION]
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-sans leading-relaxed">
                      Separation of primary frequency protocols from primal chaos.
                    </p>
                  </div>
                  <div className="border-t border-slate-900 pt-2 font-mono text-[8px] space-y-0.5 mt-auto">
                    <div className="flex justify-between text-slate-500">
                      <span>LEVEL:</span>
                      <span className="text-cyan-400 font-bold uppercase">ARCHITECTURAL</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>FREQ:</span>
                      <span className="text-amber-500 font-bold">432 Hz</span>
                    </div>
                  </div>
                </div>

                {/* Day 2 */}
                <div className="bg-[#040812] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/[0.02] rounded-full blur-lg pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">02</span>
                    <span className="px-1.5 py-0.5 bg-cyan-950/60 border border-cyan-500/30 rounded text-[8px] font-mono font-bold text-cyan-300">
                      REGULATED
                    </span>
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-slate-100 tracking-tight uppercase leading-snug">
                      [FIRMAMENT CELL]
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-sans leading-relaxed">
                      Establishment of the pressurized dimensional dome boundary layer.
                    </p>
                  </div>
                  <div className="border-t border-slate-900 pt-2 font-mono text-[8px] space-y-0.5 mt-auto">
                    <div className="flex justify-between text-slate-500">
                      <span>LEVEL:</span>
                      <span className="text-[#fbbf24] font-bold uppercase">BOUNDARY SHIELD</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>PRESSURE:</span>
                      <span className="text-cyan-400 font-bold">2.2 Atm</span>
                    </div>
                  </div>
                </div>

                {/* Day 3 */}
                <div className="bg-[#040812] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/[0.02] rounded-full blur-lg pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">03</span>
                    <span className="px-1.5 py-0.5 bg-emerald-950/60 border border-emerald-500/30 rounded text-[8px] font-mono font-bold text-emerald-400">
                      ONLINE
                    </span>
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-slate-100 tracking-tight uppercase leading-snug">
                      [GEOSPHERIC ALIGN]
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-sans leading-relaxed">
                      Organization of hydro-aquifer baselines and systemic vegetation matrices.
                    </p>
                  </div>
                  <div className="border-t border-slate-900 pt-2 font-mono text-[8px] space-y-0.5 mt-auto">
                    <div className="flex justify-between text-slate-500">
                      <span>LEVEL:</span>
                      <span className="text-cyan-400 font-bold uppercase">SYSTEMIC BASE</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>AQUIFER:</span>
                      <span className="text-[#fbbf24] font-bold text-right">CONSTANT 100%</span>
                    </div>
                  </div>
                </div>

                {/* Day 4 */}
                <div className="bg-[#040812] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/[0.02] rounded-full blur-lg pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">04</span>
                    <span className="px-1.5 py-0.5 bg-amber-950/60 border border-amber-500/30 rounded text-[8px] font-mono font-bold text-amber-400">
                      SYNCHRONIZED
                    </span>
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-slate-100 tracking-tight uppercase leading-snug">
                      [LUMINARY CHRONOS]
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-sans leading-relaxed">
                      Activation of celestial tracking frequencies for regulatory governance cycles.
                    </p>
                  </div>
                  <div className="border-t border-slate-900 pt-2 font-mono text-[8px] space-y-0.5 mt-auto">
                    <div className="flex justify-between text-slate-500">
                      <span>LEVEL:</span>
                      <span className="text-cyan-400 font-bold uppercase text-right">CHRONO GOVERN</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>CLOCK:</span>
                      <span className="text-emerald-400 font-bold text-right">3-6-9 PATTERN</span>
                    </div>
                  </div>
                </div>

                {/* Day 5 */}
                <div className="bg-[#040812] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/[0.02] rounded-full blur-lg pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">05</span>
                    <span className="px-1.5 py-0.5 bg-emerald-950/60 border border-emerald-500/30 rounded text-[8px] font-mono font-bold text-emerald-400">
                      OPERATIONAL
                    </span>
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-slate-100 tracking-tight uppercase leading-snug">
                      [BIOSPHERIC TYPE]
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-sans leading-relaxed">
                      Deployment of conscious movement forms within air and water mediums.
                    </p>
                  </div>
                  <div className="border-t border-slate-900 pt-2 font-mono text-[8px] space-y-0.5 mt-auto">
                    <div className="flex justify-between text-slate-500">
                      <span>LEVEL:</span>
                      <span className="text-[#fbbf24] font-bold uppercase text-right">PROPULSION</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>MATRIX:</span>
                      <span className="text-cyan-400 font-bold text-right">78% DENSITY</span>
                    </div>
                  </div>
                </div>

                {/* Day 6 */}
                <div className="bg-[#040812] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/[0.02] rounded-full blur-lg pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">06</span>
                    <span className="px-1.5 py-0.5 bg-purple-950/60 border border-purple-500/30 rounded text-[8px] font-mono font-bold text-purple-400">
                      SECURED
                    </span>
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-slate-100 tracking-tight uppercase leading-snug">
                      [CARBON ARCHITECTURE]
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-sans leading-relaxed">
                      Original rendering of the human template prior to the fractured creation lock.
                    </p>
                  </div>
                  <div className="border-t border-slate-900 pt-2 font-mono text-[8px] space-y-0.5 mt-auto">
                    <div className="flex justify-between text-slate-500">
                      <span>LEVEL:</span>
                      <span className="text-[#fbbf24] font-bold uppercase text-right">COGNITIVE</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>LOCK:</span>
                      <span className="text-rose-400 font-bold text-right">PRE-FRACTURE</span>
                    </div>
                  </div>
                </div>

                {/* Day 7 */}
                <div className="bg-[#040812] border border-[#fbbf24]/30 p-4 rounded-lg flex flex-col justify-between space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#fbbf24]/[0.01] pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-mono text-xs font-bold text-[#fbbf24]">07</span>
                    <span className="px-1.5 py-0.5 bg-amber-950/60 border border-[#fbbf24]/40 rounded text-[8px] font-mono font-bold text-[#fbbf24]">
                      ESTABLISHED
                    </span>
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-[#fbbf24] tracking-tight uppercase leading-snug">
                      [SOVEREIGN REST]
                    </h5>
                    <p className="text-[10px] text-slate-300 mt-1.5 font-sans leading-relaxed">
                      Absolute systemic integration and permanent governance lockdown.
                    </p>
                  </div>
                  <div className="border-t border-slate-800/80 pt-2 font-mono text-[8px] space-y-0.5 mt-auto">
                    <div className="flex justify-between text-slate-500">
                      <span>LEVEL:</span>
                      <span className="text-[#fbbf24] font-bold uppercase text-right">SVRGN REIGN</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>STABILITY:</span>
                      <span className="text-emerald-400 font-bold text-right">ABS LOCKED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 2: SECURE RESOURCE WORKSTATION ==================== */}
        {activeTab === "presentation" && (
          <div className="animate-tab-fade grid grid-cols-1 lg:grid-cols-10 gap-6">
            
            {/* LEFT-HAND COMPONENT SELECTOR LIST (30% Width Grid -> col-span-3 of 10) */}
            <div className="lg:col-span-3 bg-slate-900/30 rounded-xl border border-slate-800/80 p-4 space-y-6 h-[600px] overflow-y-auto">
              
              {/* CATEGORY 1: CORE RESEARCH PAPERS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-cyan-500/10 pb-2 px-1">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                    CORE RESEARCH PAPERS
                  </h3>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: "real_book_of_life_2",
                      title: "The Real Book of Life Origin",
                      subtitle: "Secure Document Vault",
                      badge: "Doc 1",
                      freq: 432
                    },
                    {
                      id: "salvation_kingdom_protocol",
                      title: "The Pneumatology Creation Dimensional Protocol",
                      subtitle: "Secure Document Vault",
                      badge: "Doc 2",
                      freq: 432
                    },
                    {
                      id: "new_creation_protocol",
                      title: "New Creation Protocol",
                      subtitle: "Secure Document Vault",
                      badge: "Doc 3",
                      freq: 432
                    }
                  ].map((doc) => {
                    const isActive = activeDocId === doc.id;
                    return (
                      <button
                        key={doc.id}
                        id={`card-doc-${doc.id}`}
                        onClick={() => {
                          setActiveDocId(doc.id);
                          playTone(doc.freq, `${doc.title} Loaded`);
                        }}
                        className={`w-full p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                          isActive
                            ? "bg-slate-950 border-cyan-500/60 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                            : "bg-transparent border-slate-850 text-slate-400 hover:bg-slate-900/30 hover:border-slate-800"
                        }`}
                      >
                        <div className={`p-1 rounded font-mono text-[10px] font-bold leading-none flex-shrink-0 ${
                          isActive ? "bg-cyan-950 text-cyan-300" : "bg-slate-950 text-slate-500"
                        }`}>
                          {doc.badge}
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight tracking-wide">{doc.title}</div>
                          <div className="text-[10px] opacity-75 font-mono mt-0.5">{doc.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CATEGORY 2: INSTITUTE AUDIO PODCASTS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-pink-500/10 pb-2 px-1">
                  <Radio className="w-4 h-4 text-pink-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ffcc] text-glow-light-pulse">
                    INSTITUTE AUDIO PODCASTS
                  </h3>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: "audio_architecture_origin",
                      title: "Architecture Creation Origin",
                      subtitle: "Secure Audio Podcast",
                      badge: "Audio 1",
                      freq: 528
                    },
                    {
                      id: "audio_pneumatology_matrix",
                      title: "Pneumatology Dimensional Creation Matrix",
                      subtitle: "Secure Audio Podcast",
                      badge: "Audio 2",
                      freq: 528
                    },
                    {
                      id: "audio_closed_sphere_model",
                      title: "Closed Sphere Firmament Cell Model",
                      subtitle: "Secure Audio Podcast",
                      badge: "Audio 3",
                      freq: 528
                    }
                  ].map((audio) => {
                    const isActive = activeDocId === audio.id;
                    return (
                      <button
                        key={audio.id}
                        id={`card-audio-${audio.id}`}
                        onClick={() => {
                          setActiveDocId(audio.id);
                          playTone(audio.freq, `${audio.title} Broadcast Active`);
                        }}
                        className={`w-full p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                          isActive
                            ? "bg-slate-950 border-pink-500/60 text-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.15)]"
                            : "bg-transparent border-slate-850 text-slate-400 hover:bg-slate-900/30 hover:border-slate-800"
                        }`}
                      >
                        <div className={`p-1 rounded font-mono text-[10px] font-bold leading-none flex-shrink-0 ${
                          isActive ? "bg-pink-950 text-pink-300" : "bg-slate-950 text-slate-500"
                        }`}>
                          {audio.badge}
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight tracking-wide">{audio.title}</div>
                          <div className="text-[10px] opacity-75 font-mono mt-0.5">{audio.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CATEGORY 3: SYSTEM VIDEO EXPLAINERS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-purple-500/10 pb-2 px-1">
                  <Video className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ffcc]">
                    SYSTEM VIDEO EXPLAINERS
                  </h3>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: "video_carbon_lock",
                      title: "The 666 Carbon Lock of Sin",
                      subtitle: "Secure Video Explainer",
                      badge: "Video 1",
                      freq: 396
                    },
                    {
                      id: "video_new_birth",
                      title: "Salvation Kingdom Protocol Study",
                      subtitle: "Secure Video Explainer",
                      badge: "Video 2",
                      freq: 396
                    }
                  ].map((vid) => {
                    const isActive = activeDocId === vid.id;
                    return (
                      <button
                        key={vid.id}
                        id={`card-video-${vid.id}`}
                        onClick={() => {
                          setActiveDocId(vid.id);
                          playTone(vid.freq, `${vid.title} Stream Selected`);
                        }}
                        className={`w-full p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                          isActive
                            ? "bg-slate-950 border-purple-500/60 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                            : "bg-transparent border-slate-850 text-slate-400 hover:bg-slate-900/30 hover:border-slate-800"
                        }`}
                      >
                        <div className={`p-1 rounded font-mono text-[10px] font-bold leading-none flex-shrink-0 ${
                          isActive ? "bg-purple-950 text-purple-300" : "bg-slate-950 text-slate-500"
                        }`}>
                          {vid.badge}
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight tracking-wide">{vid.title}</div>
                          <div className="text-[10px] opacity-75 font-mono mt-0.5">{vid.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT-HAND PROTECTED PLAYBACK DISPLAY (70% Width Grid -> col-span-7 of 10) */}
            <div className="lg:col-span-7 bg-slate-900/10 rounded-xl border border-slate-800/80 p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between h-[600px] overflow-y-auto">
              
              <div className="flex flex-col justify-between h-full space-y-4 animate-tab-fade">
                
                {/* Header of Viewframe */}
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>SECURE RESOURCE WORKSTATION</span>
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-display text-slate-200 mt-1">
                      {activeDocId === "real_book_of_life_2" && "The Real Book of Life Origin"}
                      {activeDocId === "salvation_kingdom_protocol" && "The Pneumatology Creation Dimensional Protocol"}
                      {activeDocId === "new_creation_protocol" && "New Creation Protocol"}
                      {activeDocId === "audio_architecture_origin" && "Architecture Creation Origin"}
                      {activeDocId === "audio_pneumatology_matrix" && "Pneumatology Dimensional Creation Matrix"}
                      {activeDocId === "audio_closed_sphere_model" && "Closed Sphere Firmament Cell Model"}
                      {activeDocId === "video_carbon_lock" && "The 666 Carbon Lock of Sin"}
                      {activeDocId === "video_new_birth" && "Salvation Kingdom Protocol Study"}
                      {!activeDocId && "Digital Assets Research Center"}
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded select-none uppercase">
                    PROTECTED STREAM
                  </span>
                </div>

                {/* Main Viewing Canvas wrapper with select-none text blocking and onContextMenu override */}
                <div 
                  className="flex-1 min-h-[320px] bg-slate-950/90 rounded-lg border border-slate-800/60 p-2 flex flex-col items-center justify-center relative overflow-hidden select-none"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  
                  {/* Document Viewframe Iframes using Google Drive Preview Link */}
                  {activeDocId === "real_book_of_life_2" && (
                    <iframe
                      id="viewframe-doc-1"
                      src="https://drive.google.com/file/d/1UkqmM9ekfcktMpik7A_jO3DjBn0sfDZ3/preview"
                      width="100%"
                      height="600"
                      style={{ border: "none", borderRadius: "6px", backgroundColor: "#050b14" }}
                      className="w-full flex-1 min-h-[380px]"
                    ></iframe>
                  )}

                  {activeDocId === "salvation_kingdom_protocol" && (
                    <iframe
                      id="viewframe-doc-2"
                      src="https://drive.google.com/file/d/1j-Afc70V-IWLNWvXqiLSWeBj4zNihibs/preview"
                      width="100%"
                      height="600"
                      style={{ border: "none", borderRadius: "6px", backgroundColor: "#050b14" }}
                      className="w-full flex-1 min-h-[380px]"
                    ></iframe>
                  )}

                  {activeDocId === "new_creation_protocol" && (
                    <iframe
                      id="viewframe-doc-3"
                      src="https://drive.google.com/file/d/1ZCQkTo-3wyUdGn50krzQCmvl1OL35LH8/preview"
                      width="100%"
                      height="600"
                      style={{ border: "none", borderRadius: "6px", backgroundColor: "#050b14" }}
                      className="w-full flex-1 min-h-[380px]"
                    ></iframe>
                  )}

                  {/* Audio Podcast Standard HTML5 Audio - Replaced with Cloud Stream Preview */}
                  {activeDocId === "audio_architecture_origin" && (
                    <div className="w-full flex flex-col justify-center items-center p-4 select-none" onContextMenu={(e) => e.preventDefault()}>
                      {/* Layer A (The Visual Poster) */}
                      <div className="w-full max-w-lg mb-3 bg-[#0a1428]/80 p-5 rounded-lg border border-cyan-500/20 flex flex-col items-center text-center space-y-3 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                          <Mic className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold font-display tracking-wide text-slate-100">
                            Architecture Creation Origin
                          </h4>
                          <p className="text-[10px] uppercase font-mono tracking-widest text-[#fbbf24] font-bold">
                            Core Audio Review
                          </p>
                        </div>
                      </div>
                      {/* Layer B (The Controlled Stream) */}
                      <div className="w-full max-w-lg overflow-hidden rounded-lg bg-slate-950 border border-slate-900 shadow-md opacity-85 hover:opacity-100 transition-opacity">
                        <iframe
                          id="viewframe-audio-1"
                          src="https://drive.google.com/file/d/1BP0-p0aUZzmZ8rwLjJ5pUwMkEt_7X4YU/preview"
                          width="100%"
                          height="60"
                          style={{ border: "none", borderRadius: "0", backgroundColor: "#050b14" }}
                          className="w-full h-[60px]"
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {activeDocId === "audio_pneumatology_matrix" && (
                    <div className="w-full flex flex-col justify-center items-center p-4 select-none" onContextMenu={(e) => e.preventDefault()}>
                      {/* Layer A (The Visual Poster) */}
                      <div className="w-full max-w-lg mb-3 bg-[#0a1428]/80 p-5 rounded-lg border border-cyan-500/20 flex flex-col items-center text-center space-y-3 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                          <Mic className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold font-display tracking-wide text-slate-100">
                            Pneumatology Dimensional Creation Matrix
                          </h4>
                          <p className="text-[10px] uppercase font-mono tracking-widest text-[#fbbf24] font-bold">
                            Acoustic Transmission
                          </p>
                        </div>
                      </div>
                      {/* Layer B (The Controlled Stream) */}
                      <div className="w-full max-w-lg overflow-hidden rounded-lg bg-slate-950 border border-slate-900 shadow-md opacity-85 hover:opacity-100 transition-opacity">
                        <iframe
                          id="viewframe-audio-2"
                          src="https://drive.google.com/file/d/1-edJSR24pbLgqO0QYzlA7yZYPrAv4ffK/preview"
                          width="100%"
                          height="60"
                          style={{ border: "none", borderRadius: "0", backgroundColor: "#050b14" }}
                          className="w-full h-[60px]"
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {activeDocId === "audio_closed_sphere_model" && (
                    <div className="w-full flex flex-col justify-center items-center p-4 select-none" onContextMenu={(e) => e.preventDefault()}>
                      {/* Layer A (The Visual Poster) */}
                      <div className="w-full max-w-lg mb-3 bg-[#0a1428]/80 p-5 rounded-lg border border-cyan-500/20 flex flex-col items-center text-center space-y-3 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                          <Mic className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold font-display tracking-wide text-slate-100">
                            Closed Sphere Firmament Cell Model
                          </h4>
                          <p className="text-[10px] uppercase font-mono tracking-widest text-[#fbbf24] font-bold">
                            System Telemetry Review
                          </p>
                        </div>
                      </div>
                      {/* Layer B (The Controlled Stream) */}
                      <div className="w-full max-w-lg overflow-hidden rounded-lg bg-slate-950 border border-slate-900 shadow-md opacity-85 hover:opacity-100 transition-opacity">
                        <iframe
                          id="viewframe-audio-3"
                          src="https://drive.google.com/file/d/1E_lZaTyt2HLf29Vh1PwSwJ-9JJUu1k5-/preview"
                          width="100%"
                          height="60"
                          style={{ border: "none", borderRadius: "0", backgroundColor: "#050b14" }}
                          className="w-full h-[60px]"
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Video Explainers - Replaced with Cloud Stream Preview */}
                  {activeDocId === "video_carbon_lock" && (
                    <iframe
                      id="viewframe-video-1"
                      src="https://drive.google.com/file/d/1FMhSHpuYzIqBgh7LolFMrWpyqdYd-rZW/preview"
                      width="100%"
                      height="600"
                      style={{ border: "none", borderRadius: "6px", backgroundColor: "#050b14" }}
                      className="w-full flex-1 min-h-[380px]"
                    ></iframe>
                  )}

                  {activeDocId === "video_new_birth" && (
                    <iframe
                      id="viewframe-video-2"
                      src="https://drive.google.com/file/d/1xzvIXN-213DajxC4i5QJUI0cdyKFlzdu/preview"
                      width="100%"
                      height="600"
                      style={{ border: "none", borderRadius: "6px", backgroundColor: "#050b14" }}
                      className="w-full flex-1 min-h-[380px]"
                    ></iframe>
                  )}

                  {/* Fallback if somehow selection is lost */}
                  {!activeDocId && (
                    <div className="text-center p-6 text-slate-500 font-mono text-xs">
                      Please select a Secure Asset Paper, Podcast, or Video from the left-hand directory list.
                    </div>
                  )}

                </div>

                {/* SECURE COPYRIGHT BANNER DISPLAY - permanently center-anchored beneath active media area */}
                <div className="bg-[#050b14] border border-cyan-950/50 p-4 rounded-lg font-mono text-[10px] leading-relaxed text-center space-y-1 mt-2 select-none">
                  <p className="font-bold text-cyan-400 tracking-wider flex items-center justify-center gap-1.5">
                    🔒 SECURITY NOTICE: DOCUMENT, AUDIO, &amp; VIDEO VIEW ONLY. DOWNLOADS ARE FORCE-DISABLED.
                  </p>
                  <p className="text-slate-400 font-sans">Document Content Copyright © All Rights Reserved.</p>
                  <p className="text-pink-500/75 font-semibold uppercase tracking-wider text-[9px]">
                    I.O.D.P.S.S Institute Dimensional Pneumatology Spiritual Sciences
                  </p>
                </div>

              </div>

              {/* Training syllabus warning notice */}
              <div className="text-[11px] font-mono text-slate-550 leading-normal border-t border-slate-800/60 pt-4 mt-4 select-none">
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

        {/* ==================== TAB 4: FCR DECEPTION CONTRAST DECK ==================== */}
        {activeTab === "deception" && (
          <div className="animate-tab-fade space-y-6">
            
            {/* Header section */}
            <div className="bg-slate-900/30 rounded-xl border border-slate-800/80 p-5 shadow-lg backdrop-blur-sm">
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 animate-pulse" />
                <span>TAB 4 CONTRAST DECK: SOVEREIGN TRUTH</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-100 mt-1">
                FCR DECEPTION MODEL WORKSPACE
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-1.5 leading-relaxed">
                Critical research deck examining flat plane electromagnetic confinement against simulated cosmic deception models. Select the corresponding streaming cards to inspect vector assets in real-time.
              </p>
            </div>

            {/* Side-by-side Video Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 1: FCR Creation Deception Model */}
              <div id="deception-card-1" className="bg-[#0b132b]/80 rounded-xl border-2 border-purple-500/20 p-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-950">
                    <span className="text-xs font-mono font-bold text-purple-400 tracking-wider">
                      VIDEO 1: DECEPTION LAYOUT
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800/30">
                      FCR_DECEPTION
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold font-display text-slate-200">
                    The FCR Creation Deception Model
                  </h3>
                  <div 
                    className="relative aspect-[16/9] w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-900 select-none"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <iframe 
                      id="viewframe-deception-1"
                      src="https://drive.google.com/file/d/1TQwUv42lj9P-jbxExI8FAFBksCmqf_t9/preview" 
                      width="100%" 
                      height="450" 
                      allow="autoplay" 
                      style={{ border: "none", borderRadius: "6px", backgroundColor: "#050b14" }}
                      className="w-full h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[450px]"
                    ></iframe>
                  </div>
                </div>
                <div className="mt-3 block font-mono text-[10px] text-slate-500">
                  <span>[Status: Connected - 100% Cloud Stream Preview]</span>
                </div>
              </div>

              {/* Card 2: Current Creation Model Simulation */}
              <div id="deception-card-2" className="bg-[#0b132b]/80 rounded-xl border-2 border-cyan-500/20 p-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-950">
                    <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                      VIDEO 2: CLOSED SIMULATION
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/30">
                      CURRENT_SIMULATION
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold font-display text-slate-200">
                    Current Creation Model Simulation
                  </h3>
                  <div 
                    className="relative aspect-[16/9] w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-900 select-none"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <iframe 
                      id="viewframe-deception-2"
                      src="https://drive.google.com/file/d/1CLtiVD_Dpc7ZZS_9O-OT-GK6u_dIIicT/preview" 
                      width="100%" 
                      height="450" 
                      allow="autoplay" 
                      style={{ border: "none", borderRadius: "6px", backgroundColor: "#050b14" }}
                      className="w-full h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[450px]"
                    ></iframe>
                  </div>
                </div>
                <div className="mt-3 block font-mono text-[10px] text-slate-500">
                  <span>[Status: Connected - 100% Cloud Stream Preview]</span>
                </div>
              </div>

            </div>

            {/* SYNC LOCAL PORTRAIT AND SCRIPTURAL CANVAS - side-by-side or below */}
            <div id="sovereign-anchor-section" className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950/75 rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Left Column: Portrait Container */}
              <div className="md:col-span-4 flex flex-col items-center justify-center space-y-3">
                <span className="font-mono text-[10px] font-bold text-[#fbbf24] uppercase tracking-widest block text-center">
                  Sovereign Ambassador Anchor
                </span>
                <div className="w-48 h-56 rounded-xl border border-slate-800 bg-[#070c19] overflow-hidden shadow-2xl relative group flex flex-col items-center justify-center">
                  {!christImageError ? (
                    <img 
                      src="images/Christ.png" 
                      alt="Ambassador Sovereign Portrait" 
                      onError={() => setChristImageError(true)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    /* High-contrast sacred glowing cross visual fallback */
                    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 text-center select-none relative">
                      <div className="absolute w-24 h-24 bg-amber-500/10 rounded-full blur-[20px] animate-pulse" />
                      {/* Beautiful minimalist SVG representing Sovereign Cross Anchor */}
                      <svg viewBox="0 0 100 100" className="w-20 h-20 text-amber-500/85 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse">
                        <line x1="50" y1="15" x2="50" y2="80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <line x1="30" y1="35" x2="70" y2="35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="50" cy="15" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path d="M 25,60 C 25,75 75,75 75,60" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 20,55 L 25,60 L 32,55" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 80,55 L 75,60 L 68,55" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      <h4 className="text-[10px] uppercase font-mono text-amber-400 font-bold tracking-widest mt-2">
                        SOVEREIGN CROSS
                      </h4>
                      <p className="text-[8px] text-slate-500 mt-1 max-w-[140px] leading-tight">
                        Standing by for Christ.png file alignment in /public/images/
                      </p>
                    </div>
                  )}
                  {/* Glass shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Right Column: Scriptural Canvas */}
              <div className="md:col-span-8 flex flex-col justify-center space-y-4 pt-4 md:pt-0 border-t border-slate-900 md:border-t-0 md:border-l md:border-slate-800/60 md:pl-6">
                <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                  COVENANT REVELATION CANVAS
                </span>
                
                {/* Scripture 1 */}
                <div className="space-y-1.5 p-3.5 bg-slate-950/90 rounded-lg border border-[#3b0764]/40 hover:border-purple-500/30 transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
                  <p className="text-sm sm:text-base font-bold text-glow-light-pulse tracking-wide text-purple-300 font-display">
                    &ldquo;And Jesus answered and said unto them, Take heed that no man deceive you.&rdquo;
                  </p>
                  <p className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider text-right">
                    — MATTHEW 24:4
                  </p>
                </div>

                {/* Scripture 2 */}
                <div className="space-y-1.5 p-3.5 bg-slate-950/90 rounded-lg border border-[#065f46]/40 hover:border-emerald-500/30 transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
                  <p className="text-sm sm:text-base font-bold text-glow-light-pulse tracking-wide text-emerald-300 font-display">
                    &ldquo;And ye shall know the truth, and the truth shall make you free.&rdquo;
                  </p>
                  <p className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider text-right">
                    — JOHN 8:32
                  </p>
                </div>
              </div>

            </div>

            {/* Permanent Bottom Anchor Disclaimer matching Institute branding */}
            <div className="bg-[#050b14] border border-purple-950/50 p-4 rounded-lg font-mono text-[10px] leading-relaxed text-center space-y-1 select-none relative">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
              <p className="font-bold text-purple-400 tracking-wider flex items-center justify-center gap-1.5">
                🔒 SECURITY NOTICE: DOCUMENT, AUDIO, &amp; VIDEO VIEW ONLY. DOWNLOADS ARE FORCE-DISABLED.
              </p>
              <p className="text-slate-400 font-sans">Document Content Copyright © All Rights Reserved.</p>
              <p className="text-[#00ffcc] font-semibold uppercase tracking-wider text-[9px] font-mono">
                I.O.D.P.S.S Institute Dimensional Pneumatology Spiritual Sciences
              </p>
            </div>

          </div>
        )}

        {/* ==================== SYSTEM FAQ / PROTOCOLS ACCORDION ==================== */}
        <div id="system-protocols-faq" className="mt-12 bg-slate-900/30 rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/60">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-widest text-[#00ffcc] text-glow-light-pulse">
              SYSTEM PROTOCOLS &amp; FREQUENTLY ASKED QUESTIONS
            </h3>
          </div>
          
          <div className="space-y-3.5">
            {[
              {
                q: "What is the Sovereign Closed-Sphere Cell Architecture?",
                a: "It is a creation-based conceptual design model showing complete flat landplane isolation from deep cosmic radiation, sustained within a pressurized firmament containment dome running a closed-loop hydraulic recycling cascade."
              },
              {
                q: "What do the values GA: 1, 16, 26 | G4: 15, 29 | V: 38 represent?",
                a: "These represent calculated linguistic frequency metrics and Gematria constants tied directly to the foundational spoken phrase 'יְהִי אוֹר' (Let There Be Light), serving as the geo-acoustic baseline for the entire structural matrix."
              },
              {
                q: "How do the 3-6-9 Vortex Mathematics regulate the environment?",
                a: "The mathematical vectors 3, 6, and 9 govern the precise orbital tracks and velocity curves of the celestial clock mechanics (Sun and Moon vectors) operating within the upper dome atmosphere to maintain systemic balance."
              },
              {
                q: "Why is the internal atmosphere specified as 78% Sealed?",
                a: "This denotes the optimized pressure balance threshold required for full-stack full-cycle atmospheric replenishment within the closed firmament vault, blocking out 100% of simulated external cosmic noise."
              }
            ].map((item, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div 
                  key={index} 
                  className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? "bg-[#0a1122]/90 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                      : "bg-[#070d19]/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-[#0c1529]/60"
                  }`}
                >
                  <button
                    onClick={() => {
                      const nextVal = isOpen ? null : index;
                      setExpandedFaq(nextVal);
                      playTone(nextVal !== null ? 333 : 288, `FAQ toggle ${index + 1}`);
                    }}
                    className="w-full py-4 px-4 sm:px-5 flex items-center justify-between gap-3 text-left font-mono font-semibold transition-colors cursor-pointer"
                  >
                    <span className={`text-xs sm:text-sm tracking-wide ${isOpen ? "text-cyan-400" : "text-slate-300"}`}>
                      {item.q}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-90 text-cyan-400" : "text-slate-500"}`} />
                  </button>
                  
                  {/* Expandable answer panel */}
                  <div 
                    className={`transition-all duration-500 ease-in-out ${
                      isOpen ? "max-h-[300px] border-t border-slate-800/60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <div className="p-4 sm:p-5 text-sm text-slate-400 leading-relaxed font-sans bg-slate-950/40">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
