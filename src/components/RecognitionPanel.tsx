import React from 'react';
import { GesturePrediction, VisionTelemetry } from '../types/signLanguage';
import { Check, ShieldAlert, Compass, Eye } from 'lucide-react';

interface RecognitionPanelProps {
  prediction: GesturePrediction;
  telemetry: VisionTelemetry;
  onCommitSign: (label: string) => void;
  holdProgress: number; // 0 to 100% for auto-commit hold indicator
}

export const RecognitionPanel: React.FC<RecognitionPanelProps> = ({
  prediction,
  telemetry,
  onCommitSign,
  holdProgress,
}) => {
  const isRecognized = prediction.label !== 'None';
  const confidencePercent = Math.round(prediction.confidence * 100);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (conf >= 70) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  const fingerLabels = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 shadow-xl">
      {/* Header section with clean unboxed metadata */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">ASL Real-Time Classifier</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Spatial Normalization Active</span>
            <span aria-hidden="true">·</span>
            <span>3D Invariant</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono uppercase text-slate-500 block">Status</span>
          <span className={`text-xs font-semibold ${isRecognized ? 'text-emerald-400' : 'text-slate-400'}`}>
            {isRecognized ? '● Tracking Sign' : '○ Awaiting Pose'}
          </span>
        </div>
      </div>

      {/* Main Recognized Sign Display */}
      <div className="relative bg-slate-950 border border-slate-800/90 rounded-xl p-5 flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none" />

        {/* Hold progress bar (auto-commit indicator) */}
        {isRecognized && holdProgress > 0 && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-cyan-400 transition-all duration-75"
            style={{ width: `${holdProgress}%` }}
          />
        )}

        {isRecognized ? (
          <div className="flex flex-col items-center gap-2 z-10 text-center">
            <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400">
              {prediction.category === 'alphabet'
                ? 'ASL Manual Alphabet'
                : prediction.category === 'number'
                ? 'ASL Numeric Handshape'
                : 'ASL Essential Sign'}
            </span>

            <div className="text-6xl font-extrabold font-mono tracking-tight text-white my-1">
              {prediction.label}
            </div>

            {/* Confidence & Accuracy Pill-free clean metadata */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Confidence</span>
              <span className="font-mono font-bold tabular-nums text-cyan-300">
                {confidencePercent}%
              </span>
              <span aria-hidden="true">·</span>
              <span>Orientation: {telemetry.palmFacing}</span>
            </div>

            <button
              onClick={() => onCommitSign(prediction.label)}
              className="mt-3 px-4 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Add to Sentence (Space)</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-slate-500 py-4">
            <Eye className="w-8 h-8 stroke-[1.5] text-slate-600 mb-2" />
            <span className="text-xs">Hold your hand upright within camera view</span>
            <span className="text-[11px] text-slate-600 mt-1">
              Supports ASL A-Z, 0-9, and Core Vocabulary
            </span>
          </div>
        )}
      </div>

      {/* Anatomical Finger Flexion Matrix */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">Anatomical Finger State</span>
          <span className="text-[11px] font-mono text-slate-500">EXTENSION RATIO</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {fingerLabels.map((name, idx) => {
            const extRatio = telemetry.fingerExtensions[idx] || 0;
            const isExtended = extRatio > 1.35;
            const isHalf = extRatio >= 1.15 && extRatio <= 1.35;

            return (
              <div
                key={name}
                className="bg-slate-950 border border-slate-800/80 rounded-lg p-2 flex flex-col items-center text-center"
              >
                <span className="text-[10px] font-medium text-slate-400">{name}</span>
                <span
                  className={`text-[11px] font-mono font-bold mt-1 ${
                    isExtended
                      ? 'text-cyan-400'
                      : isHalf
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }`}
                >
                  {isExtended ? 'EXT' : isHalf ? 'HALF' : 'CURL'}
                </span>
                <span className="text-[9px] font-mono text-slate-600 tabular-nums mt-0.5">
                  {extRatio.toFixed(1)}x
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Joint Angle Telemetry Strip */}
      <div className="pt-3 border-t border-slate-800/70 grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
          <span className="text-[10px] uppercase font-mono text-slate-500 block">PALM VECTOR</span>
          <span className="font-semibold text-slate-200 mt-0.5 block">
            Facing {telemetry.palmFacing}
          </span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
          <span className="text-[10px] uppercase font-mono text-slate-500 block">INFERENCE LATENCY</span>
          <span className="font-mono tabular-nums text-slate-200 mt-0.5 block">
            {telemetry.inferenceTimeMs} ms
          </span>
        </div>
      </div>
    </div>
  );
};
