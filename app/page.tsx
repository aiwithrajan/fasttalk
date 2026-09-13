'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { DictationControls } from '@/components/DictationControls';
import { TelemetryGauge } from '@/components/TelemetryGauge';
import { TargetArtifactGrid } from '@/components/TargetArtifactGrid';
import { VoiceRefineBar } from '@/components/VoiceRefineBar';
import { PresetDemos } from '@/components/PresetDemos';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { TargetArtifacts, TelemetryData, Tone, Verbosity, DemoPreset } from '@/lib/types';
import { DEMO_PRESETS } from '@/lib/presets';
import { Zap, Sparkles, ArrowRight, Github, Trophy, Mic, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const [rawTranscript, setRawTranscript] = useState<string>('');
  const [cleanTranscript, setCleanTranscript] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<number>(4.6);
  const [fillerCount, setFillerCount] = useState<number>(0);

  const [artifacts, setArtifacts] = useState<TargetArtifacts | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  const [tone, setTone] = useState<Tone>('engineering');
  const [verbosity, setVerbosity] = useState<Verbosity>('standard');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const voiceSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('fasttalk_assemblyai_key');
    if (stored) setApiKey(stored);

    handleSelectPreset(DEMO_PRESETS[0]);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('fasttalk_assemblyai_key', key);
  };

  const handleScrollToVoice = () => {
    voiceSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAudioRecorded = async (audioBlob: Blob, durationSeconds: number) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'mic.webm');
      formData.append('duration', durationSeconds.toString());

      const headers: Record<string, string> = {};
      if (apiKey) headers['x-assemblyai-key'] = apiKey;

      const dictateRes = await fetch('/api/dictate', {
        method: 'POST',
        headers,
        body: formData
      });

      const dictateData = await dictateRes.json();
      setRawTranscript(dictateData.rawTranscript);
      setCleanTranscript(dictateData.cleanTranscript);
      setAudioDuration(dictateData.audioDurationSeconds);
      setFillerCount(dictateData.fillerCount);

      await runSynthesis(dictateData.cleanTranscript, dictateData.rawTranscript, dictateData.audioDurationSeconds, dictateData.fillerCount, tone, verbosity);
    } catch (err) {
      console.error('Audio processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextDictated = async (text: string, durationSeconds: number) => {
    setIsProcessing(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-assemblyai-key'] = apiKey;

      const dictateRes = await fetch('/api/dictate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text, duration: durationSeconds })
      });

      const dictateData = await dictateRes.json();
      setRawTranscript(dictateData.rawTranscript);
      setCleanTranscript(dictateData.cleanTranscript);
      setAudioDuration(dictateData.audioDurationSeconds);
      setFillerCount(dictateData.fillerCount);

      await runSynthesis(dictateData.cleanTranscript, dictateData.rawTranscript, dictateData.audioDurationSeconds, dictateData.fillerCount, tone, verbosity);
    } catch (err) {
      console.error('Text dictation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectPreset = async (preset: DemoPreset) => {
    setSelectedPresetId(preset.id);
    setIsProcessing(true);
    try {
      const dictateRes = await fetch('/api/dictate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: preset.spokenShorthand, duration: preset.audioDuration })
      });

      const dictateData = await dictateRes.json();
      setRawTranscript(dictateData.rawTranscript);
      setCleanTranscript(dictateData.cleanTranscript);
      setAudioDuration(dictateData.audioDurationSeconds);
      setFillerCount(dictateData.fillerCount);

      await runSynthesis(dictateData.cleanTranscript, dictateData.rawTranscript, dictateData.audioDurationSeconds, dictateData.fillerCount, tone, verbosity);
    } catch (err) {
      console.error('Preset loading failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const runSynthesis = async (
    clean: string,
    raw: string,
    duration: number,
    fillers: number,
    t: Tone,
    v: Verbosity,
    refineInstruction?: string
  ) => {
    try {
      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cleanTranscript: clean,
          rawTranscript: raw,
          audioDuration: duration,
          fillerCount: fillers,
          tone: t,
          verbosity: v,
          refinementInstruction: refineInstruction,
          previousArtifacts: artifacts || undefined
        })
      });

      const data = await res.json();
      if (data.artifacts) {
        setArtifacts(data.artifacts);
      }
      if (data.telemetry) {
        setTelemetry(data.telemetry);
      }
    } catch (err) {
      console.error('Synthesis error:', err);
    }
  };

  const handleToneChange = (newTone: Tone) => {
    setTone(newTone);
    if (cleanTranscript) {
      runSynthesis(cleanTranscript, rawTranscript, audioDuration, fillerCount, newTone, verbosity);
    }
  };

  const handleVerbosityChange = (newVerbosity: Verbosity) => {
    setVerbosity(newVerbosity);
    if (cleanTranscript) {
      runSynthesis(cleanTranscript, rawTranscript, audioDuration, fillerCount, tone, newVerbosity);
    }
  };

  const handleRefine = (instruction: string) => {
    if (cleanTranscript) {
      setIsProcessing(true);
      runSynthesis(cleanTranscript, rawTranscript, audioDuration, fillerCount, tone, verbosity, instruction).finally(() => {
        setIsProcessing(false);
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
      
      {/* Header with ChatGPT navbar layout */}
      <Header
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={!!apiKey}
        onScrollToVoice={handleScrollToVoice}
      />

      <main className="flex-1 w-full px-6 sm:px-12 lg:px-16 xl:px-20 py-8 sm:py-12 space-y-12">
        
        {/* Hero Section styled like OpenAI ChatGPT Voice showcase */}
        <section className="text-center max-w-5xl mx-auto space-y-5 pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-semibold text-zinc-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>AssemblyAI Voice Hackathon Week 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            How to start a voice conversation
          </h1>

          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Keyboards cap at 80 WPM. Normal speech is 150 WPM. Human thought moves at 500 WPM. FastTalk unlocks <span className="text-white font-semibold">500+ WPM typing speeds</span> by turning 4-second telegraphic bursts into 5 ready-to-ship production artifacts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleScrollToVoice}
              className="rounded-full bg-white text-black hover:bg-zinc-200 px-7 py-3 text-base font-bold transition-all shadow-xl shadow-white/10 active:scale-95 flex items-center gap-2"
            >
              <Mic className="w-5 h-5 text-black fill-current" />
              <span>Start Speaking</span>
            </button>
            <a
              href="https://dictation.assemblyai.com/transcribe"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 px-6 py-3 text-base font-semibold transition-all flex items-center gap-2"
            >
              <span>AssemblyAI Dictation Beta</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </a>
          </div>
        </section>

        {/* 1-Click Judge Showcase Presets */}
        <section id="demo" className="pt-4">
          <PresetDemos
            onSelectPreset={handleSelectPreset}
            selectedId={selectedPresetId}
            disabled={isProcessing}
          />
        </section>

        {/* Central Voice Experience Console (Voice Orb + Speech Purifier) */}
        <section ref={voiceSectionRef} className="pt-2">
          <DictationControls
            onAudioRecorded={handleAudioRecorded}
            onTextDictated={handleTextDictated}
            rawTranscript={rawTranscript}
            cleanTranscript={cleanTranscript}
            fillerCount={fillerCount}
            isProcessing={isProcessing}
          />
        </section>

        {/* Centerpiece: Telemetry Speedometer + 5 Target Artifacts */}
        <section id="telemetry" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          
          {/* Left Column: WPM Speedometer */}
          <div className="lg:col-span-4 flex flex-col">
            <TelemetryGauge
              telemetry={telemetry}
              isLoading={isProcessing}
            />
          </div>

          {/* Right Column: 5 Multi-Target Artifacts */}
          <div className="lg:col-span-8 flex flex-col">
            <TargetArtifactGrid
              artifacts={artifacts}
              tone={tone}
              onToneChange={handleToneChange}
              verbosity={verbosity}
              onVerbosityChange={handleVerbosityChange}
              isLoading={isProcessing}
            />
          </div>

        </section>

        {/* Non-Linear Voice Refinement Loop */}
        <section className="pt-2">
          <VoiceRefineBar
            onRefine={handleRefine}
            disabled={!artifacts || isProcessing}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-8 px-6 sm:px-12 lg:px-16 xl:px-20 text-center text-sm text-zinc-500 mt-16 w-full">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-bold text-white">FastTalk</span>
            <span>·</span>
            <span>AssemblyAI Voice Hackathon Week 2026</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <a
              href="https://dictation.assemblyai.com/transcribe"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Dictation API
            </a>
            <a
              href="https://discord.com/invite/P7sKN78EsE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Discord Community
            </a>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={apiKey}
      />

    </div>
  );
}
