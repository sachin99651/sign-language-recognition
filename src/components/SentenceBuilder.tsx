import React, { useState } from 'react';
import { Volume2, VolumeX, Delete, Trash2, Copy, Check, Sparkles, CornerDownLeft } from 'lucide-react';
import { speechService } from '../services/speechSynthesis';

interface SentenceBuilderProps {
  sentence: string;
  setSentence: (text: string) => void;
  recentSigns: string[];
  onAnalyzeWithGemini?: () => void;
  isAiAnalyzing?: boolean;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  sentence,
  setSentence,
  recentSigns,
  onAnalyzeWithGemini,
  isAiAnalyzing,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!sentence.trim()) return;
    setIsSpeaking(true);
    speechService.speak(sentence, () => {
      setIsSpeaking(false);
    });
  };

  const handleStopSpeak = () => {
    speechService.stop();
    setIsSpeaking(false);
  };

  const handleCopy = async () => {
    if (!sentence.trim()) return;
    try {
      await navigator.clipboard.writeText(sentence);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const handleBackspace = () => {
    setSentence(sentence.slice(0, -1));
  };

  const handleAddSpace = () => {
    if (sentence.length > 0 && !sentence.endsWith(' ')) {
      setSentence(sentence + ' ');
    }
  };

  const handleClear = () => {
    setSentence('');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">ASL Sentence & Fingerspelling Buffer</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Speech Synthesis Ready</span>
            <span aria-hidden="true">·</span>
            <span>ASL Gloss Translation</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={isSpeaking ? handleStopSpeak : handleSpeak}
            disabled={!sentence.trim()}
            title="Read Aloud (Text to Speech)"
            className="p-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCopy}
            disabled={!sentence.trim()}
            title="Copy Text"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleBackspace}
            disabled={!sentence}
            title="Delete Last Character"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <Delete className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            disabled={!sentence}
            title="Clear All"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transcription Display Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[90px] flex flex-col justify-between">
        <div className="text-base font-mono text-slate-100 tracking-wide break-words select-all">
          {sentence ? (
            <span>{sentence}</span>
          ) : (
            <span className="text-slate-600 italic font-sans text-xs">
              Signed letters and phrases appear here in real-time...
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
          <span className="font-mono tabular-nums">{sentence.length} characters</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddSpace}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono border border-slate-700 transition-colors"
            >
              [Space]
            </button>
            {onAnalyzeWithGemini && (
              <button
                onClick={onAnalyzeWithGemini}
                disabled={isAiAnalyzing || !sentence.trim()}
                className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 rounded text-[11px] font-medium transition-colors disabled:opacity-40"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isAiAnalyzing ? 'Translating...' : 'AI Grammar Polish'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Signs Stream */}
      {recentSigns.length > 0 && (
        <div>
          <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1.5">
            Recent Sign Log
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {recentSigns.slice(-10).map((sign, idx) => (
              <button
                key={`${sign}-${idx}`}
                onClick={() => setSentence(sentence + (sentence.endsWith(' ') || sentence === '' ? '' : ' ') + sign)}
                title="Click to insert into sentence"
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                +{sign}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
