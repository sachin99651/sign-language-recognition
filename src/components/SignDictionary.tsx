import React, { useState } from 'react';
import { ALL_ASL_SIGNS, ASL_CATEGORIES } from '../data/aslDictionary';
import { SignDefinition } from '../types/signLanguage';
import { Search, BookOpen, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface SignDictionaryProps {
  onSelectSignForPractice: (sign: SignDefinition) => void;
}

export const SignDictionary: React.FC<SignDictionaryProps> = ({
  onSelectSignForPractice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSignModal, setActiveSignModal] = useState<SignDefinition | null>(null);

  // Filter signs
  const filteredSigns = ALL_ASL_SIGNS.filter((sign) => {
    const matchesCategory =
      selectedCategory === 'all' || sign.category === selectedCategory;
    const matchesSearch =
      sign.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
      {/* Header and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100">American Sign Language (ASL) Dictionary</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Manual Alphabet A-Z</span>
            <span aria-hidden="true">·</span>
            <span>Numbers 0-9</span>
            <span aria-hidden="true">·</span>
            <span>Essential Signs</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search ASL signs or instructions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {ASL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sign Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredSigns.map((sign) => (
          <div
            key={sign.id}
            onClick={() => setActiveSignModal(sign)}
            className="bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl p-4 flex flex-col items-center justify-between cursor-pointer transition-all hover:scale-[1.02] text-center group"
          >
            <div className="w-full flex items-center justify-between text-[10px] text-slate-500 mb-2">
              <span className="uppercase font-mono">{sign.category}</span>
              <span className="text-slate-600 font-mono">{sign.difficulty[0]}</span>
            </div>

            <div className="text-3xl font-extrabold font-mono text-white group-hover:text-cyan-400 transition-colors my-2">
              {sign.label}
            </div>

            <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
              {sign.instructions[0]}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectSignForPractice(sign);
              }}
              className="mt-3 w-full py-1 bg-slate-900 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 rounded text-[11px] font-medium transition-colors"
            >
              Practice
            </button>
          </div>
        ))}
      </div>

      {filteredSigns.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-xs">
          No ASL signs match "{searchQuery}". Try searching for letters, numbers, or sign names like "HELLO" or "WATER".
        </div>
      )}

      {/* Detail Modal */}
      {activeSignModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveSignModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-mono p-1"
            >
              [ESC / ✕]
            </button>

            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase mb-1">
              <span>ASL {activeSignModal.category}</span>
              <span aria-hidden="true">·</span>
              <span>{activeSignModal.difficulty}</span>
            </div>

            <div className="text-5xl font-extrabold font-mono text-white mb-3">
              {activeSignModal.label}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeSignModal.description}
            </p>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-4">
              <span className="text-[11px] font-mono text-slate-500 uppercase block mb-2">
                Execution Steps:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeSignModal.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-mono text-xs">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activeSignModal.mnemonic && (
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-xs text-cyan-200 mb-5">
                <strong className="block text-cyan-400 mb-0.5">Memory Mnemonic:</strong>
                {activeSignModal.mnemonic}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveSignModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectSignForPractice(activeSignModal);
                  setActiveSignModal(null);
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors"
              >
                Practice in Live Camera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
