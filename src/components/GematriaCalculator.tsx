import { useState } from "react";
import { HEBREW_ALPHABET, HebrewLetter } from "../data";

interface GematriaCalculatorProps {
  onTriggerSound: (freq: number, label: string) => void;
}

export default function GematriaCalculator({ onTriggerSound }: GematriaCalculatorProps) {
  const [inputText, setInputText] = useState("יְהִי אוֹר");
  const [calculationResult, setCalculationResult] = useState<{
    text: string;
    standardSum: number;
    sofiaSum: number;
    reducedSum: number;
    isVortex: boolean;
    vortexCode: string;
    parsedLetters: { char: string; name: string; val: number; sofiaVal: number; freq: number }[];
  } | null>({
    text: "יְהִי אוֹר",
    standardSum: 232, // standard calculation
    sofiaSum: 16,
    reducedSum: 2,
    isVortex: false,
    vortexCode: "Positive Dissonance (Root 2)",
    parsedLetters: [
      { char: "י", name: "Yod", val: 10, sofiaVal: 1, freq: 963 },
      { char: "ה", name: "He", val: 5, sofiaVal: 5, freq: 417 },
      { char: "י", name: "Yod", val: 10, sofiaVal: 1, freq: 963 },
      { char: "א", name: "Aleph", val: 1, sofiaVal: 1, freq: 111 },
      { char: "ו", name: "Vav", val: 6, sofiaVal: 6, freq: 528 },
      { char: "ר", name: "Resh", val: 200, sofiaVal: 2, freq: 220 },
    ],
  });

  // Calculate Gematria sum
  const calculateGematria = (text: string) => {
    const lettersResult: any[] = [];
    let standardSum = 0;
    let sofiaSum = 0;

    // Clean Hebrew vowels and keep letters
    for (const char of text) {
      const match = HEBREW_ALPHABET.find((l) => l.char === char);
      if (match) {
        standardSum += match.value;
        sofiaSum += match.sofiaValue;
        lettersResult.push({
          char: match.char,
          name: match.name,
          val: match.value,
          sofiaVal: match.sofiaValue,
          freq: match.frequency,
        });
      }
    }

    // Direct reduction to a single digit number (Tesla root tracking)
    // Reduce standardSum
    let tempSum = standardSum;
    while (tempSum > 9) {
      tempSum = String(tempSum)
        .split("")
        .reduce((acc, digit) => acc + parseInt(digit || "0", 10), 0);
    }
    const reducedSum = tempSum;
    const isVortex = [3, 6, 9].includes(reducedSum);
    const vortexCode = isVortex
      ? `TESLA VORTEX ANCHOR [${reducedSum}] - HIGH RESONANCE!`
      : `Closed Dimension Root (${reducedSum})`;

    setCalculationResult({
      text,
      standardSum,
      sofiaSum,
      reducedSum,
      isVortex,
      vortexCode,
      parsedLetters: lettersResult,
    });
  };

  const handleKeyPress = (char: string) => {
    const matched = HEBREW_ALPHABET.find((l) => l.char === char);
    if (matched) {
      onTriggerSound(matched.frequency, `Letter: ${matched.name} (${matched.frequency}Hz)`);
      setInputText((prev) => prev + char);
    }
  };

  return (
    <div id="linguistic-frequency-panel" className="bg-slate-900/40 rounded-xl border border-cyan-500/20 p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest font-mono">
            LINGUISTIC FREQUENCY DECODER
          </h3>
          <p className="text-xs text-slate-400">Standard Gematria &amp; Tesla 3-6-9 Root Reductions</p>
        </div>
        <span className="text-[10px] bg-cyan-950 font-mono text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
          DAY 1 SYSTEM
        </span>
      </div>

      {/* Input row */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            calculateGematria(e.target.value);
          }}
          placeholder="Type or click keys below..."
          className="flex-1 bg-slate-950/80 border border-slate-700/60 rounded-lg p-2.5 text-center text-lg font-bold text-cyan-300 font-serif placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/80"
        />
        <button
          onClick={() => calculateGematria(inputText)}
          className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase cursor-pointer"
        >
          Decode
        </button>
        <button
          onClick={() => {
            setInputText("");
            setCalculationResult(null);
          }}
          className="bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800 px-3 py-2.5 rounded-lg text-xs font-mono cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Display computed scores */}
      {calculationResult ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
          <div className="text-center md:border-r border-slate-800/60 p-2">
            <span className="text-[10px] uppercase text-slate-500 font-mono">Standard Gematria</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {calculationResult.standardSum}
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">GA Standard Sum</span>
          </div>
          <div className="text-center md:border-r border-slate-800/60 p-2">
            <span className="text-[10px] uppercase text-slate-500 font-mono">Sofia Sum</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
              {calculationResult.sofiaSum}
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">High-Grade Value</span>
          </div>
          <div className="text-center p-2">
            <span className="text-[10px] uppercase text-slate-500 font-mono">Vortex Root (3-6-9)</span>
            <div
              className={`text-2xl font-bold font-mono mt-1 ${
                calculationResult.isVortex ? "text-emerald-400 animate-pulse" : "text-purple-400"
              }`}
            >
              {calculationResult.reducedSum}
            </div>
            <span className={`text-[9px] block mt-0.5 ${calculationResult.isVortex ? "text-emerald-500 font-bold" : "text-slate-500"}`}>
              {calculationResult.vortexCode}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 text-slate-500 text-xs italic bg-slate-950/30 rounded-lg border border-dashed border-slate-800 mb-5">
          Type Hebrew letters above or click individual letters on the virtual acoustic keyboard below to start calculating frequencies...
        </div>
      )}

      {/* Virtual Acoustic Keyboard */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono block mb-2">
          ACOUSTIC VORTEX KEYBOARD (Click letters to emit frequency waveforms)
        </span>
        <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
          {HEBREW_ALPHABET.map((item) => {
            const isKeySelected = inputText.includes(item.char);
            return (
              <button
                key={item.char}
                onClick={() => handleKeyPress(item.char)}
                title={`${item.name} - ${item.meaning}. Frequency: ${item.frequency}Hz`}
                className={`py-2 px-1 rounded border text-center transition-all cursor-pointer ${
                  isKeySelected
                    ? "bg-cyan-950/80 border-cyan-400 text-cyan-300"
                    : "bg-slate-950 hover:bg-slate-800/70 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="text-lg font-serif font-bold">{item.char}</div>
                <div className="text-[8px] font-mono opacity-80">{item.name}</div>
                <div className="text-[8px] font-mono text-amber-500 opacity-60">
                  {item.value}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
