import { useCallback, useEffect, useRef, useState } from "react";
import valentineMusic from "@/assets/valentine-music.mp3";

export function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(valentineMusic);
    audio.loop = true;
    audio.volume = 0.5;
    audio.addEventListener("ended", () => setIsPlaying(false));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("ended", () => setIsPlaying(false));
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      play();
    }
  }, [isPlaying, play]);

  return { isPlaying, play, stop, toggle };
}
