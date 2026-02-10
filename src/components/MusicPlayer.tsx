import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Web Audio API synthesized romantic melody.
 * Generates a simple looping melody using oscillators — no external files needed.
 */

// Romantic melody notes (frequency in Hz, duration in seconds)
const MELODY: [number, number][] = [
  [523.25, 0.5], // C5
  [659.25, 0.5], // E5
  [783.99, 0.75], // G5
  [880.00, 0.5], // A5
  [783.99, 0.75], // G5
  [659.25, 0.5], // E5
  [698.46, 0.75], // F5
  [659.25, 0.5], // E5
  [523.25, 1.0], // C5
  [0, 0.25],     // rest
  [587.33, 0.5], // D5
  [659.25, 0.5], // E5
  [698.46, 0.75], // F5
  [783.99, 0.5], // G5
  [880.00, 0.75], // A5
  [783.99, 0.5], // G5
  [659.25, 1.0], // E5
  [0, 0.5],      // rest
];

export function useMusicPlayer() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const loopRef = useRef(false);
  const timeoutIds = useRef<number[]>([]);

  const stopAll = useCallback(() => {
    loopRef.current = false;
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    if (gainRef.current) {
      gainRef.current.gain.setValueAtTime(0, ctxRef.current?.currentTime ?? 0);
    }
    setIsPlaying(false);
  }, []);

  const playMelody = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    if (!gainRef.current) {
      gainRef.current = ctx.createGain();
      gainRef.current.gain.value = 0.15;
      gainRef.current.connect(ctx.destination);
    }
    gainRef.current.gain.setValueAtTime(0.15, ctx.currentTime);

    loopRef.current = true;
    setIsPlaying(true);

    const scheduleMelody = () => {
      if (!loopRef.current) return;
      let offset = 0;
      MELODY.forEach(([freq, dur]) => {
        const id = window.setTimeout(() => {
          if (!loopRef.current || !ctxRef.current || !gainRef.current) return;
          if (freq === 0) return; // rest
          const osc = ctxRef.current.createOscillator();
          const noteGain = ctxRef.current.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          noteGain.gain.setValueAtTime(0.15, ctxRef.current.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctxRef.current.currentTime + dur * 0.9);
          osc.connect(noteGain);
          noteGain.connect(gainRef.current!);
          osc.start();
          osc.stop(ctxRef.current.currentTime + dur);
        }, offset * 1000);
        timeoutIds.current.push(id);
        offset += dur;
      });

      // Loop
      const loopId = window.setTimeout(() => {
        if (loopRef.current) scheduleMelody();
      }, offset * 1000);
      timeoutIds.current.push(loopId);
    };

    scheduleMelody();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stopAll();
    } else {
      playMelody();
    }
  }, [isPlaying, stopAll, playMelody]);

  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  return { isPlaying, play: playMelody, stop: stopAll, toggle };
}
