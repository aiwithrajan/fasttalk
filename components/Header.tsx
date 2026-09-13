'use client';

import React from 'react';
import { Mic, Zap, Sparkles, Key, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  onScrollToVoice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenApiKeyModal, hasApiKey, onScrollToVoice }) => {
  return (
    <header className="border-b border-white/10 bg-black/90 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 lg:px-16 py-4 transition-all w-full">
      <div className="w-full flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold shadow-md">
            <Mic className="w-4 h-4 text-black fill-current" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-white">
              FastTalk
            </span>
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/15">
              500+ WPM
            </span>
          </div>
        </div>

        {/* Center: Minimalist OpenAI-style Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          <a href="#demo" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#telemetry" className="hover:text-white transition-colors">
            Speed Telemetry
          </a>
          <a
            href="https://dictation.assemblyai.com/transcribe"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>AssemblyAI Dictation</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href="https://discord.com/invite/P7sKN78EsE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Hackathon Discord
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenApiKeyModal}
            className={`text-sm px-4 py-2 rounded-full border transition-all ${
              hasApiKey
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-zinc-900 hover:bg-zinc-800 border-white/10 text-zinc-300'
            }`}
          >
            {hasApiKey ? 'Key Active' : 'API Key'}
          </button>

          <button
            onClick={onScrollToVoice}
            className="rounded-full bg-white hover:bg-zinc-200 text-black px-5 py-2 text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            Try FastTalk
          </button>
        </div>

      </div>
    </header>
  );
};
