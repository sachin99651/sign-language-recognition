import React from 'react';
import { HandLandmarks, VisionTelemetry, LANDMARK_NAMES } from '../types/signLanguage';
import { Activity, X } from 'lucide-react';

interface ModelTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  landmarks: HandLandmarks;
  telemetry: VisionTelemetry;
}

export const ModelTelemetryModal: React.FC<ModelTelemetryModalProps> = ({
  isOpen,
  onClose,
  landmarks,
  telemetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Computer Vision Landmark & Joint Telemetry
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>21-Point Skeletal Mesh</span>
                <span aria-hidden="true">·</span>
                <span>3D Coordinates</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry metrics strip */}
        <div className="grid grid-cols-4 gap-3 py-4 border-b border-slate-800 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">FRAME RATE</span>
            <span className="text-lg font-mono font-bold tabular-nums text-cyan-400">
              {telemetry.fps} <span className="text-xs text-slate-500">FPS</span>
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">INFERENCE TIME</span>
            <span className="text-lg font-mono font-bold tabular-nums text-slate-200">
              {telemetry.inferenceTimeMs} <span className="text-xs text-slate-500">ms</span>
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">HAND CONFIDENCE</span>
            <span className="text-lg font-mono font-bold tabular-nums text-emerald-400">
              {Math.round(telemetry.handScore * 100)}%
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">PALM VECTOR</span>
            <span className="text-sm font-semibold text-slate-200 mt-1 block">
              {telemetry.palmFacing}
            </span>
          </div>
        </div>

        {/* Joint Angles Strip */}
        <div className="py-3 border-b border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-500 block mb-2">
            Joint Flexion Angles (Degrees)
          </span>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
              <span className="text-[10px] text-slate-400 block">Thumb MCP</span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {telemetry.jointAngles.thumbMcp}°
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
              <span className="text-[10px] text-slate-400 block">Index PIP</span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {telemetry.jointAngles.indexPip}°
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
              <span className="text-[10px] text-slate-400 block">Middle PIP</span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {telemetry.jointAngles.middlePip}°
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
              <span className="text-[10px] text-slate-400 block">Ring PIP</span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {telemetry.jointAngles.ringPip}°
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
              <span className="text-[10px] text-slate-400 block">Pinky PIP</span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {telemetry.jointAngles.pinkyPip}°
              </span>
            </div>
          </div>
        </div>

        {/* 21 Landmarks Coordinate Table */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">Idx</th>
                <th className="py-2 px-3">Landmark Name</th>
                <th className="py-2 px-3">X Coordinate</th>
                <th className="py-2 px-3">Y Coordinate</th>
                <th className="py-2 px-3">Z Depth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {landmarks.length > 0 ? (
                landmarks.map((lm, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-1.5 px-3 text-cyan-400 font-bold">{idx}</td>
                    <td className="py-1.5 px-3 text-slate-300">{LANDMARK_NAMES[idx] || `Node ${idx}`}</td>
                    <td className="py-1.5 px-3 tabular-nums text-slate-400">{lm.x.toFixed(4)}</td>
                    <td className="py-1.5 px-3 tabular-nums text-slate-400">{lm.y.toFixed(4)}</td>
                    <td className="py-1.5 px-3 tabular-nums text-slate-400">{(lm.z || 0).toFixed(4)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No active hand landmarks detected currently.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
