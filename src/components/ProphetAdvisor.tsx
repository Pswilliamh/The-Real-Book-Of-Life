import { useState, useRef, useEffect } from "react";
import { MessageSquare, Shield, Sparkles, Send } from "lucide-react";

interface ProphetAdvisorProps {
  dayId: number;
  pressureScale: number;
  vortexSpin: boolean;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export default function ProphetAdvisor({ 
  dayId, 
  pressureScale, 
  vortexSpin,
  externalPrompt,
  onClearExternalPrompt
}: ProphetAdvisorProps) {
  const [messages, setMessages] = useState<
    { sender: "user" | "prophet"; text: string; id: number }[]
  >([
    {
      id: 1,
      sender: "prophet",
      text: "Peace be unto you. I am the Prophet Advisor of the Real Book of Life matrix. What sacred structural principles or hydro-vortex coordinates would you like to examine today?",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Suggested quick prompts
  const presets = [
    "Explain the 3-6-9 vortex analemma orbit clockwork.",
    "Why must the flat earth plane be isolated from the outer pressurized dome?",
    "How do subterranean hydro-aquifers fuel topsoil moisture without leaks?",
    "Explain the role of the four foundational columns in electromagnetic energy grounding."
  ];

  // Auto-scroll chat to latest messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle external prompts sent from the ledger directory
  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      handleSendPrompt(externalPrompt);
      if (onClearExternalPrompt) {
        onClearExternalPrompt();
      }
    }
  }, [externalPrompt]);

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    const userMsg = textToSend;
    setInputVal("");
    setLoading(true);

    const newMsgs = [...messages, { sender: "user" as const, text: userMsg, id: Date.now() }];
    setMessages(newMsgs);

    try {
      const response = await fetch("/api/prophet-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg,
          context: {
            currentDayOfCreation: dayId,
            domePressurePercent: pressureScale,
            centralVortexActive: vortexSpin,
            operatingSystemVersion: "V2.5 Full-Stack",
            firmamentFluidIntegrity: "Self-Sealed Closed-Loop Recycler Rating"
          },
        }),
      });

      const data = await response.json();
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "prophet",
            text: `Matrix Error: ${data.error}. Please confirm your local environment variables are running.`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "prophet", text: data.text },
        ]);
      }
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "prophet",
          text: "Vessel Timeout: Could not reach the server-side API. Check if your dev server has properly completed rebuilding.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="expert-ai-scribe-advisor" className="bg-slate-900/40 rounded-xl border border-cyan-500/20 p-5 shadow-lg backdrop-blur-md flex flex-col h-[500px]">
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3 mb-3">
        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        <div>
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono">
            KINGDOM EMBASSY CONSULTANT [GEMINI API]
          </h3>
          <p className="text-[11px] text-slate-400">Theological &amp; Scientific Covenant Analysis</p>
        </div>
      </div>

      {/* Preset quick buttons */}
      <div className="mb-3">
        <span className="text-[9px] font-mono uppercase text-slate-500 block mb-1">
          Select Peer-Review inquiry prompt:
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-12 overflow-y-auto pr-1">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(preset)}
              className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 rounded px-2 py-0.5 text-left truncate max-w-full cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Chat messages viewport */}
      <div className="flex-1 overflow-y-auto bg-slate-950/65 rounded-lg border border-slate-800 p-3.5 space-y-3 pr-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[85%] ${
              m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div
              className={`text-xs rounded-xl p-3 ${
                m.sender === "user"
                  ? "bg-cyan-950/90 text-cyan-200 border border-cyan-500/30"
                  : "bg-slate-900/90 text-slate-200 border border-slate-800"
              }`}
            >
              {/* Highlight scriptures with special left border if formatted */}
              {m.sender === "prophet" ? (
                <div className="space-y-1.5 whitespace-pre-wrap leading-relaxed markdown-body">
                  {m.text}
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              )}
            </div>
            <span className="text-[8px] text-slate-500 mt-1 font-mono">
              {m.sender === "user" ? "Researcher Post" : "Scribe Scroll Answer"}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 mr-auto max-w-[80%] bg-slate-900/60 rounded-xl p-3 border border-dashed border-amber-500/20">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            <span className="text-[10px] font-mono text-amber-500">
              Scribe searching Gematria coordinates and physical scriptures...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Manual query input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(inputVal);
        }}
        className="mt-3 flex gap-1.5"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Consult Scribe on 3-6-9 laws, Gematria or scriptures..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/70"
        />
        <button
          type="submit"
          disabled={loading || !inputVal.trim()}
          className="bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-600/50 py-2 px-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
