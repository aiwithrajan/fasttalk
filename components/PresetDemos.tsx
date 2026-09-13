'use client';

import React from 'react';
import { DEMO_PRESETS } from '@/lib/presets';
import { DemoPreset } from '@/lib/types';
import { Play, Sparkles, Clock, Globe } from 'lucide-react';

interface PresetDemosProps {
  onSelectPreset: (preset: DemoPreset) => void;
  selectedId?: string;
  disabled?: boolean;
}

export const PresetDemos: React.FC<PresetDemosProps> = ({
  onSelectPreset,
  selectedId,
  disabled
}) => {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Judge Showcase Scenarios (1-Click Test Runs)
        </span>
        <span className="text-xs text-zinc-500">
          Instant evaluation without microphone
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {DEMO_PRESETS.map((preset) => {
          const isSelected = selectedId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              disabled={disabled}
              className={`text-left p-4 sm:p-5 rounded-2xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-zinc-900 border-white/40 shadow-xl ring-1 ring-white/20'
                  : 'bg-zinc-950/80 hover:bg-zinc-900/90 border-white/10 hover:border-white/20'
              } disabled:opacity-50`}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span className="font-bold text-sm sm:text-base text-white group-hover:text-zinc-200 transition-colors">
                  {preset.name}
                </span>
                <span className="flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-white/5">
                  <Clock className="w-3 h-3" />
                  {preset.audioDuration}s
                </span>
              </div>

              <div className="text-xs text-indigo-400 font-semibold mb-2">
                {preset.tag}
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                "{preset.spokenShorthand}"
              </p>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-300 group-hover:text-white font-medium">
                <span className="flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-current text-white" />
                  Run voice burst
                </span>
                {preset.language.includes('hi') && (
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Globe className="w-3 h-3" />
                    18-Lang
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
