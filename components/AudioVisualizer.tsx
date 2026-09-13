'use client';

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  audioStream?: MediaStream | null;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording, audioStream }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isRecording && audioStream) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(audioStream);
        source.connect(analyser);
        sourceRef.current = source;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const render = () => {
          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const barWidth = (canvas.width / bufferLength) * 1.5;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 0.9 + 4;
            
            // Gradient bar
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
            gradient.addColorStop(0.5, 'rgba(129, 140, 248, 0.8)');
            gradient.addColorStop(1, 'rgba(6, 182, 212, 1)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth - 2, barHeight);

            x += barWidth;
          }

          animationFrameRef.current = requestAnimationFrame(render);
        };

        render();
      } catch (err) {
        console.warn('WebAudio setup fallback to simulated wave:', err);
        renderSimulatedWave(canvas, ctx);
      }
    } else if (isRecording) {
      // Recording without real audio stream (simulated / preset)
      renderSimulatedWave(canvas, ctx);
    } else {
      // Idle state
      renderIdleState(canvas, ctx);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isRecording, audioStream]);

  const renderSimulatedWave = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let step = 0;
    const bars = 28;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bars;
      step += 0.12;

      for (let i = 0; i < bars; i++) {
        const sinVal = Math.sin(step + i * 0.4);
        const barHeight = Math.abs(sinVal) * (canvas.height * 0.8) + 6;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.95)');

        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, (canvas.height - barHeight) / 2, barWidth - 2, barHeight);
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  const renderIdleState = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bars = 28;
    const barWidth = canvas.width / bars;

    for (let i = 0; i < bars; i++) {
      const barHeight = 4;
      ctx.fillStyle = 'rgba(63, 63, 70, 0.3)';
      ctx.fillRect(i * barWidth, (canvas.height - barHeight) / 2, barWidth - 2, barHeight);
    }
  };

  return (
    <div className="w-full h-14 flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-900/60 border border-white/10 px-4">
      <canvas
        ref={canvasRef}
        width={640}
        height={56}
        className="w-full h-full block"
      />
    </div>
  );
};
