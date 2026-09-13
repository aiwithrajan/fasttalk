'use client';

import React from 'react';
import { Zap, Clock, ShieldCheck, ArrowUpRight, Gauge, Cpu } from 'lucide-react';
import { TelemetryData } from '@/lib/types';

interface TelemetryGaugeProps {
  telemetry: TelemetryData | null;
  isLoading?: boolean;
}

export const TelemetryGauge: React.FC<TelemetryGaugeProps> = ({ telemetry, isLoading }) => {
  if (!telemetry) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-indigo-400" />
              WPM Speedometer
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-white/10">
              Ready
            </span>
          </div>

          <div className="py-10 text-center">
            <div className="text-7xl sm:text-8xl font-black tracking-tight text-zinc-800">
              000
            </div>
            <div className="text-sm text-zinc-500 mt-2 uppercase font-semibold tracking-wider">
              Effective Words Per Minute
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-sm text-zinc-500 text-center leading-relaxed">
          Speak a telegraphic thought burst or pick a preset scenario to calculate live productivity metrics.
        </div>
      </div>
    );
  }

  const {
    effectiveWpm,
    audioDurationSeconds,
    spokenWordCount,
    synthesizedWordCount,
    speedMultiplier,
    secondsSavedVsTyping,
    fillerWordsRemoved
  } = telemetry;

  const minutesSaved = Math.floor(secondsSavedVsTyping / 60);
  const remSeconds = secondsSavedVsTyping % 60;
  const timeSavedFormatted = minutesSaved > 0 ? `${minutesSaved}m ${remSeconds}s` : `${remSeconds}s`;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden shadow-2xl flex flex-col justify-between h-full">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            Productivity Telemetry
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {speedMultiplier}x Faster Than Keyboard
          </span>
        </div>

        {/* Hero Speed Display */}
        <div className="py-4 text-center">
          <div className="text-7xl sm:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {effectiveWpm}
          </div>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-400 mt-2 flex items-center justify-center gap-1">
            <span>Effective Words Per Minute</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Time Saved</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {timeSavedFormatted}
            </div>
            <div className="text-xs text-zinc-500">
              vs manual 40 WPM typing
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Voice Duration</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {audioDurationSeconds}s
            </div>
            <div className="text-xs text-zinc-500">
              {spokenWordCount} shorthand words
            </div>
          </div>
        </div>

        {/* AssemblyAI Value Add */}
        <div className="mt-4 p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="text-zinc-200 font-medium">AssemblyAI Filter</span>
          </div>
          <span className="font-bold text-cyan-300">
            {fillerWordsRemoved > 0 ? `${fillerWordsRemoved} fillers purged` : 'Zero filler clutter'}
          </span>
        </div>
      </div>

      {/* Speedometer Range Bar */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span>Speed Benchmark</span>
          <span className="text-white font-bold">{speedMultiplier}x speedup</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-700"
            style={{ width: `${Math.min(100, (effectiveWpm / 800) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-zinc-500 mt-2 font-medium">
          <span>Typing (40 WPM)</span>
          <span>Speech (150 WPM)</span>
          <span className="text-cyan-400 font-bold">FastTalk (500+ WPM)</span>
        </div>
      </div>

    </div>
  );
};
