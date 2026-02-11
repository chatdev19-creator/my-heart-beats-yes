import { useCallback, useEffect, useRef, useState } from "react";
import valentineMusic from "@/assets/valentine-music.mp3";

export function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(valentineMusic);
      audio.loop = true;
      audio.volume = 0.5;
      audio.addEventListener("ended", () => setIsPlaying(false));
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const play = useCallback(() => {
    const audio = getAudio();
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [getAudio]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
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

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  return { isPlaying, play, stop, toggle };
}
