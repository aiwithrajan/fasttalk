'use client';

import React, { useState } from 'react';
import { Sparkles, CornerDownLeft } from 'lucide-react';

interface VoiceRefineBarProps {
  onRefine: (instruction: string) => void;
  disabled?: boolean;
}

export const VoiceRefineBar: React.FC<VoiceRefineBarProps> = ({ onRefine, disabled }) => {
  const [input, setInput] = useState('');

  const quickRefinements = [
    'Make the email more urgent with 15m ETA',
    'Add an explicit rollback plan to CLI script',
    'Summarize Slack update into executive bullets',
    'Add unit test requirements to Jira ticket'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onRefine(input.trim());
    setInput('');
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5 sm:p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-3 text-sm font-bold text-zinc-300">
        <Sparkles className="w-4 h-4 text-white" />
        <span>Non-Linear Voice Refinement (Iterate without retyping)</span>
      </div>

      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak or type an edit: e.g. 'Make the email more urgent with a 15-minute ETA'..."
          disabled={disabled}
          className="w-full bg-zinc-900/90 border border-white/10 rounded-2xl px-5 py-3.5 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors pr-28 disabled:opacity-50"
        />

        <div className="absolute right-2.5 flex items-center">
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-sm font-semibold transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:hover:bg-white"
          >
            <span>Apply</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Quick Refinement Pills with larger text */}
      <div className="flex items-center gap-2 mt-3.5 overflow-x-auto scrollbar-none">
        <span className="text-xs sm:text-sm text-zinc-500 font-medium shrink-0">Quick tweaks:</span>
        {quickRefinements.map((refine, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onRefine(refine)}
            disabled={disabled}
            className="shrink-0 text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 transition-all disabled:opacity-50"
          >
            {refine}
          </button>
        ))}
      </div>
    </div>
  );
};
