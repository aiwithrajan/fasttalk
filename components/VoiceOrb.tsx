'use client';

import React from 'react';
import { Mic, Square, Sparkles } from 'lucide-react';

interface VoiceOrbProps {
  isRecording: boolean;
  onClick: () => void;
  isProcessing?: boolean;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isRecording,
  onClick,
  isProcessing
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-4 select-none">
      {/* Orb Container with Click Trigger */}
      <div
        onClick={isProcessing ? undefined : onClick}
        className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full cursor-pointer flex items-center justify-center transition-transform duration-500 group ${
          isProcessing ? 'opacity-80 cursor-wait' : 'hover:scale-105 active:scale-95'
        }`}
      >
        {/* Deep ambient glow layer */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
            isRecording
              ? 'bg-gradient-to-tr from-cyan-500/50 via-blue-600/60 to-purple-600/70 scale-125 animate-pulse'
              : isProcessing
              ? 'bg-gradient-to-tr from-indigo-500/40 via-purple-500/40 to-cyan-400/40 scale-110 animate-spin'
              : 'bg-gradient-to-tr from-indigo-500/25 via-sky-500/20 to-purple-500/25 scale-100 group-hover:scale-110'
          }`}
        />

        {/* Secondary ripple wave when recording */}
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full border border-sky-400/40 animate-ping" />
            <div className="absolute -inset-4 rounded-full border border-purple-500/20 animate-pulse" />
          </>
        )}

        {/* The ChatGPT Organic Voice Orb */}
        <div
          className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full shadow-2xl transition-all duration-700 overflow-hidden flex items-center justify-center ${
            isRecording
              ? 'scale-105 shadow-cyan-500/40'
              : 'shadow-indigo-500/20'
          }`}
          style={{
            background: isRecording
              ? 'radial-gradient(circle at 35% 35%, #ffffff 0%, #a5b4fc 25%, #6366f1 50%, #3b82f6 75%, #1e1b4b 100%)'
              : isProcessing
              ? 'radial-gradient(circle at 40% 40%, #ffffff 0%, #cbd5e1 30%, #818cf8 60%, #312e81 100%)'
              : 'radial-gradient(circle at 40% 35%, #ffffff 0%, #c7d2fe 30%, #818cf8 65%, #3730a3 100%)',
          }}
        >
          {/* Internal soft iridescent shimmer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/40 mix-blend-overlay" />

          {/* Floating dynamic icon */}
          <div className="relative z-10 flex flex-col items-center justify-center text-white drop-shadow-md">
            {isRecording ? (
              <Square className="w-8 h-8 fill-white text-white drop-shadow" />
            ) : (
              <Mic className="w-9 h-9 text-white drop-shadow" />
            )}
          </div>
        </div>
      </div>

      {/* Status Label */}
      <div className="mt-4 text-center">
        <div className="text-base sm:text-lg font-medium text-white flex items-center justify-center gap-2">
          {isRecording ? (
            <span className="flex items-center gap-2 text-sky-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              Listening... Speak fast & telegraphic
            </span>
          ) : isProcessing ? (
            <span className="text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
              Purifying speech with AssemblyAI...
            </span>
          ) : (
            <span className="text-zinc-300">Tap orb or hold Spacebar to talk</span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          {isRecording
            ? 'Release Spacebar or click orb when finished'
            : 'AssemblyAI removes "ums" & "ahs" in 18 languages'}
        </p>
      </div>
    </div>
  );
};
