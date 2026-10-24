import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ALL_ASL_SIGNS,
  ASL_ALPHABET,
  ASL_NUMBERS,
  ASL_CORE_SIGNS
} from '../data/aslDictionary';
import { GesturePrediction, SignDefinition } from '../types/signLanguage';
import { CheckCircle2, ChevronRight, Award, RotateCcw, Lightbulb } from 'lucide-react';

interface PracticeModeProps {
  currentPrediction: GesturePrediction;
  onSetTargetSign: (signLabel: string | null) => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  currentPrediction,
  onSetTargetSign,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'alphabet' | 'number' | 'phrase'>('alphabet');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [holdTimer, setHoldTimer] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Active pool of signs
  const signPool: SignDefinition[] =
    selectedCategory === 'alphabet'
      ? ASL_ALPHABET
      : selectedCategory === 'number'
      ? ASL_NUMBERS
      : ASL_CORE_SIGNS;

  const currentSign = signPool[currentIndex] || signPool[0];

  // Inform parent of current target sign so camera silhouette knows what to show
  useEffect(() => {
    if (currentSign) {
      onSetTargetSign(currentSign.label);
    }
    return () => {
      onSetTargetSign(null);
    };
  }, [currentSign, onSetTargetSign]);

  // Check if current user pose matches target sign
  useEffect(() => {
    if (!currentSign) return;

    const matches =
      currentPrediction.label.toUpperCase() === currentSign.label.toUpperCase() &&
      currentPrediction.confidence >= 0.70;

    if (matches) {
      const interval = setInterval(() => {
        setHoldTimer((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleSuccess();
            return 100;
          }
          return prev + 10;
        });
      }, 70);

      return () => clearInterval(interval);
    } else {
      setHoldTimer(0);
    }
  }, [currentPrediction, currentSign]);

  const handleSuccess = () => {
    setIsSuccess(true);
    setScore((prev) => prev + 10);
    setStreak((prev) => prev + 1);

    // Trigger confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#10B981', '#38BDF8', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSuccess(false);
      setHoldTimer(0);
      handleNextSign();
    }, 1200);
  };

  const handleNextSign = () => {
    setCurrentIndex((prev) => (prev + 1) % signPool.length);
  };

  const handlePrevSign = () => {
    setCurrentIndex((prev) => (prev - 1 + signPool.length) % signPool.length);
  };

  const handleResetStreak = () => {
    setScore(0);
    setStreak(0);
    setHoldTimer(0);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
      {/* Category Selection Tabs & Score Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setSelectedCategory('alphabet');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'alphabet'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ASL Alphabet (A-Z)
          </button>

          <button
            onClick={() => {
              setSelectedCategory('number');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'number'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ASL Numbers (0-9)
          </button>

          <button
            onClick={() => {
              setSelectedCategory('phrase');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'phrase'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Core Signs
          </button>
        </div>

        {/* Score & Streak counter (Tabular numerals) */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-500">SCORE:</span>
            <span className="tabular-nums font-bold text-white">{score}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-500">STREAK:</span>
            <span className="tabular-nums font-bold text-emerald-400">🔥 {streak}</span>
          </div>
          <button
            onClick={handleResetStreak}
            title="Reset Score"
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Sign Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left: Sign Prompt and Visual Hold Meter */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glow on success */}
          {isSuccess && (
            <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none transition-opacity duration-300" />
          )}

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>CARD {currentIndex + 1} OF {signPool.length}</span>
              <span>Difficulty: {currentSign.difficulty}</span>
            </div>

            <div className="text-center py-4">
              <span className="text-xs font-mono uppercase text-cyan-400 block mb-1">
                Form This Sign
              </span>
              <div className="text-7xl font-extrabold font-mono tracking-tight text-white">
                {currentSign.label}
              </div>
            </div>

            {/* Hold matching sign progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Pose Alignment</span>
                <span className="font-mono tabular-nums text-cyan-300">{holdTimer}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-75 ${
                    isSuccess ? 'bg-emerald-400' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${holdTimer}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 text-center mt-2">
                Hold your hand steadily in camera view for 1 second to score
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/80">
            <button
              onClick={handlePrevSign}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition-colors"
            >
              Previous
            </button>

            <span className="text-xs text-slate-500">
              Current: <strong className="text-slate-300">{currentPrediction.label}</strong>
            </span>

            <button
              onClick={handleNextSign}
              className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-medium rounded-lg border border-cyan-500/30 transition-colors"
            >
              <span>Skip / Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Step-by-Step Instructions & Finger Placement */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-2">How to Sign "{currentSign.label}"</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {currentSign.description}
            </p>

            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-mono uppercase text-slate-500 block">
                Finger Positioning:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentSign.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-mono text-[11px] mt-0.5">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {currentSign.mnemonic && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300 block mb-0.5">Mnemonic Memory Aid:</span>
                  <span>{currentSign.mnemonic}</span>
                </div>
              </div>
            )}
          </div>

          {currentSign.commonMistakes && currentSign.commonMistakes.length > 0 && (
            <div className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-800/80">
              <span className="font-semibold text-slate-400">Common Mistake:</span> {currentSign.commonMistakes[0]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
