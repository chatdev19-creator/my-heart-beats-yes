import { useState, useRef, useCallback } from "react";
import { Heart } from "lucide-react";
import ConfettiCanvas from "@/components/ConfettiCanvas";
import LoveLetter from "@/components/LoveLetter";
import FloatingHearts from "@/components/FloatingHearts";
import { useMusicPlayer } from "@/components/MusicPlayer";
import valentineBg from "@/assets/valentine-bg.jpg";

// === DEBUG: Set to true to disable NO button movement for testing ===
const DEBUG_DISABLE_DODGE = false;

const Index = () => {
  const [celebrating, setCelebrating] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);

  // NO button dodge state
  const [noTransform, setNoTransform] = useState({ x: 0, y: 0 });
  const [noDodging, setNoDodging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const { isPlaying, play: playMusic, toggle: toggleMusic } = useMusicPlayer();

  /**
   * NO BUTTON DODGE: On hover/touch, compute a new random position
   * within safe area using translate3d for GPU-accelerated animation.
   */
  const dodgeNo = useCallback(() => {
    if (DEBUG_DISABLE_DODGE || buttonsDisabled) return;

    const container = containerRef.current;
    const btn = noBtnRef.current;
    if (!container || !btn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const margin = 16;

    const maxX = containerRect.width - btnRect.width - margin * 2;
    const maxY = containerRect.height - btnRect.height - margin * 2;

    const targetX = Math.random() * maxX - maxX / 2;
    const targetY = Math.random() * maxY - maxY / 2;

    const clampedX = Math.max(-containerRect.width / 3, Math.min(containerRect.width / 3, targetX));
    const clampedY = Math.max(-containerRect.height / 4, Math.min(containerRect.height / 4, targetY));

    setNoDodging(true);
    setNoTransform({ x: clampedX, y: clampedY });
    setTimeout(() => setNoDodging(false), 300);
  }, [buttonsDisabled]);

  const handleYes = useCallback(() => {
    if (buttonsDisabled) return;
    setButtonsDisabled(true);
    setCelebrating(true);
    setScreenFlash(true);
    setTimeout(() => setScreenFlash(false), 600);

    // Auto-play synthesized melody
    playMusic();
  }, [buttonsDisabled, playMusic]);

  const handleCelebrationComplete = useCallback(() => {
    setCelebrating(false);
    setShowLetter(true);
  }, []);

  const handleCloseLetter = useCallback(() => {
    setShowLetter(false);
    setButtonsDisabled(false);
    setNoTransform({ x: 0, y: 0 });
  }, []);

  return (
    <main className="relative min-h-screen valentine-gradient-soft overflow-hidden font-body">
      <FloatingHearts />
      <ConfettiCanvas active={celebrating} duration={5000} onComplete={handleCelebrationComplete} />

      {/* Screen flash on celebration */}
      {screenFlash && (
        <div
          className="fixed inset-0 z-[60] pointer-events-none bg-valentine-rose"
          style={{ animation: "screen-flash 0.6s ease-out forwards" }}
          aria-hidden="true"
        />
      )}

      {/* Background image overlay */}
      <div
        className="fixed inset-0 z-0 opacity-10 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${valentineBg})` }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div
        ref={containerRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12"
      >
        {/* Heart icon */}
        <div className="animate-heartbeat mb-4">
          <Heart
            size={56}
            className="text-primary drop-shadow-lg"
            fill="currentColor"
          />
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-7xl text-center valentine-text-gradient leading-tight mb-3">
          Will You Be My Valentine?
        </h1>
        <p className="text-muted-foreground text-center text-lg sm:text-xl max-w-md mb-12 font-light">
          I've been meaning to ask you this for a while… 💕
        </p>

        {/* Futuristic Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full max-w-sm">
          {/* YES button — futuristic neon */}
          <button
            onClick={handleYes}
            disabled={buttonsDisabled}
            className={`
              w-full sm:w-auto flex-1 px-10 py-5 rounded-2xl text-xl font-bold
              btn-futuristic-yes text-primary-foreground
              transition-all duration-300
              disabled:opacity-60 disabled:cursor-not-allowed
              ${!buttonsDisabled ? "animate-valentine-pulse hover:scale-110 active:scale-95" : ""}
            `}
            style={{ animation: !buttonsDisabled ? "valentine-pulse 2s ease-in-out infinite, neon-flicker 3s linear infinite" : "none" }}
            aria-label="Yes, I'll be your Valentine!"
          >
            YES! 💖
          </button>

          {/* NO button — futuristic glass, dodges on interaction */}
          <button
            ref={noBtnRef}
            disabled={buttonsDisabled}
            onPointerEnter={dodgeNo}
            onMouseEnter={dodgeNo}
            onTouchStart={dodgeNo}
            onFocus={dodgeNo}
            className={`
              w-full sm:w-auto flex-1 px-10 py-5 rounded-2xl text-xl font-bold
              btn-futuristic-no text-muted-foreground
              transition-all duration-300 ease-out
              disabled:opacity-60 disabled:cursor-not-allowed
              ${noDodging ? "scale-90 rotate-[-5deg]" : "hover:scale-105"}
            `}
            style={{
              transform: `translate3d(${noTransform.x}px, ${noTransform.y}px, 0) ${noDodging ? "scale(0.9) rotate(-5deg)" : ""}`,
            }}
            aria-label="No (but you can't click this!)"
          >
            No 😢
          </button>
        </div>

        {/* Playful hint */}
        <p className="mt-8 text-sm text-muted-foreground/60 italic animate-float">
          Psst… the right answer is obvious 😏
        </p>
      </div>

      {/* Love letter modal */}
      <LoveLetter
        visible={showLetter}
        onClose={handleCloseLetter}
        isPlaying={isPlaying}
        onToggleMusic={toggleMusic}
      />
    </main>
  );
};

export default Index;
