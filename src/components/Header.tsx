import React from 'react';
import { Activity, BookOpen, GraduationCap, Cpu, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'live' | 'dictionary' | 'practice' | 'trainer';
  setActiveTab: (tab: 'live' | 'dictionary' | 'practice' | 'trainer') => void;
  onOpenTelemetry: () => void;
  fps: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenTelemetry,
  fps,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              SignSense <span className="text-cyan-400 font-semibold">ASL</span>
            </span>
          </div>
        </div>

        {/* Zone 2: 4 Clean single-line nav tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800/80 rounded-xl">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'live'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Live Recognition
          </button>

          <button
            onClick={() => setActiveTab('dictionary')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dictionary'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            ASL Dictionary
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'practice'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Interactive Practice
          </button>

          <button
            onClick={() => setActiveTab('trainer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'trainer'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Custom ML Trainer
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 border border-slate-800 px-2.5 py-1 rounded-md bg-slate-900/50">
            <span className="text-slate-500">SPEED</span>
            <span className="tabular-nums text-cyan-400 font-semibold">{fps || 0}</span>
            <span className="text-slate-500 text-[10px]">FPS</span>
          </div>

          <button
            onClick={onOpenTelemetry}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-100 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vision Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 px-2 py-1.5 bg-slate-950">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium ${
            activeTab === 'live' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4 mb-0.5" />
          Recognition
        </button>
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium ${
            activeTab === 'dictionary' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          Dictionary
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium ${
            activeTab === 'practice' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <GraduationCap className="w-4 h-4 mb-0.5" />
          Practice
        </button>
        <button
          onClick={() => setActiveTab('trainer')}
          className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium ${
            activeTab === 'trainer' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Cpu className="w-4 h-4 mb-0.5" />
          Custom ML
        </button>
      </div>
    </header>
  );
};
