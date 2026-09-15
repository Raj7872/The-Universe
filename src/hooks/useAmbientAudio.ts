'use client';

import { useEffect, useRef } from 'react';
import { useUniverseStore } from '@/lib/store';

export function useAmbientAudio() {
  const audioEnabled  = useUniverseStore((s) => s.audioEnabled);
  const masterVolume  = useUniverseStore((s) => s.masterVolume);
  const scrollProgress = useUniverseStore((s) => s.scrollProgress);

  const ctxRef        = useRef<AudioContext | null>(null);
  const masterRef     = useRef<GainNode | null>(null);
  const builtRef      = useRef(false);

  // Build synth on first enable
  useEffect(() => {
    if (!audioEnabled || builtRef.current) return;
    builtRef.current = true;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    buildDrone(ctx, master);

    // Fade in gently
    master.gain.setTargetAtTime(masterVolume * 0.07, ctx.currentTime, 2.0);
  }, [audioEnabled, masterVolume]);

  // Toggle play/pause after built
  useEffect(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    if (audioEnabled) {
      ctx.resume().then(() => {
        master.gain.setTargetAtTime(masterVolume * 0.07, ctx.currentTime, 1.5);
      });
    } else {
      master.gain.setTargetAtTime(0, ctx.currentTime, 1.0);
      setTimeout(() => ctx.state === 'running' && ctx.suspend(), 1600);
    }
  }, [audioEnabled, masterVolume]);

  // Volume swell near finale
  useEffect(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master || !audioEnabled) return;
    const target = scrollProgress > 0.82 ? masterVolume * 0.11 : masterVolume * 0.07;
    master.gain.setTargetAtTime(target, ctx.currentTime, 2.5);
  }, [scrollProgress, audioEnabled, masterVolume]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);
}

function buildDrone(ctx: AudioContext, master: GainNode) {
  // Simple reverb via convolver
  const convolver = ctx.createConvolver();
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.35;
  const len = ctx.sampleRate * 2.8;
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
  }
  convolver.buffer = ir;
  convolver.connect(reverbGain);
  reverbGain.connect(master);

  const dry = ctx.createGain();
  dry.gain.value = 0.65;
  dry.connect(master);

  function osc(freq: number, type: OscillatorType, gain: number, detune = 0) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 700;
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    g.gain.value = gain;
    o.connect(f);
    f.connect(g);
    g.connect(dry);
    g.connect(convolver);
    o.start();
    return o;
  }

  // Rich drone: root + detune pair + fifth + octave
  osc(55,   'sine',     1.0);
  osc(55.3, 'sine',     0.45,  6);
  osc(82.5, 'sine',     0.38);
  osc(110,  'sine',     0.20);
  osc(110.5,'sine',     0.10,  9);
  osc(165,  'triangle', 0.07);

  // Breathing LFO
  const lfo = ctx.createOscillator();
  const lfoG = ctx.createGain();
  lfo.frequency.value = 0.065;
  lfoG.gain.value = 0.012;
  lfo.connect(lfoG);
  lfoG.connect(master.gain);
  lfo.start();
}
