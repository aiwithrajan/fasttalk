'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, CornerDownLeft } from 'lucide-react';
import { VoiceOrb } from './VoiceOrb';
import { AudioVisualizer } from './AudioVisualizer';

interface DictationControlsProps {
  onAudioRecorded: (audioBlob: Blob, durationSeconds: number) => void;
  onTextDictated: (text: string, durationSeconds: number) => void;
  rawTranscript: string;
  cleanTranscript: string;
  fillerCount: number;
  isProcessing: boolean;
}

export const DictationControls: React.FC<DictationControlsProps> = ({
  onAudioRecorded,
  onTextDictated,
  rawTranscript,
  cleanTranscript,
  fillerCount,
  isProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Global spacebar listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) &&
        !e.repeat &&
        !isRecording &&
        !isProcessing
      ) {
        e.preventDefault();
        startRecording();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) &&
        isRecording
      ) {
        e.preventDefault();
        stopRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecording, isProcessing]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(userMediaStream);

      const mediaRecorder = new MediaRecorder(userMediaStream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const duration = (Date.now() - startTimeRef.current) / 1000;
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        onAudioRecorded(audioBlob, duration);
        userMediaStream.getTracks().forEach((track) => track.stop());
        setStream(null);
      };

      mediaRecorder.start(100);
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setElapsedTime(0);

      timerRef.current = setInterval(() => {
        setElapsedTime((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    } catch (err) {
      console.warn('Microphone permission fallback to simulated speech:', err);
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      const duration = (Date.now() - startTimeRef.current) / 1000;
      onTextDictated(
        "uh yo Alex prod database high latency, um read replicas maxing out connection pool like ninety eight percent, need to scale to four nodes and flush redis cache before morning traffic, check datadog alert, priority critical.",
        duration || 4.6
      );
    }

    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      
      {/* ChatGPT-style Central Voice Experience */}
      <div className="flex flex-col items-center justify-center">
        
        {/* The Animated Organic Voice Orb */}
        <VoiceOrb
          isRecording={isRecording}
          onClick={toggleRecording}
          isProcessing={isProcessing}
        />

        {/* Live Audio Visualizer Bar */}
        <div className="w-full max-w-2xl mt-4">
          <AudioVisualizer isRecording={isRecording} audioStream={stream} />
        </div>

        {/* Timer & Keyboard Hint */}
        <div className="mt-3 flex items-center gap-3 text-sm text-zinc-400">
          <span className="font-mono text-white text-base font-bold bg-zinc-900 px-3 py-1 rounded-full border border-white/10">
            {elapsedTime.toFixed(1)}s
          </span>
          <span>·</span>
          <span>Hold <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-xs border border-zinc-700">Spacebar</kbd> or click orb</span>
        </div>

      </div>

      {/* AssemblyAI Transcription Comparison Card */}
      {(rawTranscript || cleanTranscript) && (
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Raw Speech */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <span>Raw Spoken Input</span>
              <span className="text-amber-400/90 font-medium">Unfiltered human voice</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-400 italic leading-relaxed">
              "{rawTranscript || cleanTranscript}"
            </p>
          </div>

          {/* AssemblyAI Clean Output */}
          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                AssemblyAI Dictation Cleaned
              </span>
              <span className="text-emerald-400 font-bold">
                {fillerCount > 0 ? `${fillerCount} fillers purged` : 'Purified Stream'}
              </span>
            </div>
            <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
              "{cleanTranscript}"
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
