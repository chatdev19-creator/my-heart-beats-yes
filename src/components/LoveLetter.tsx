import { Heart, X, Share2, Music, Pause } from "lucide-react";
interface LoveLetterProps {
  visible: boolean;
  onClose: () => void;
  isPlaying: boolean;
  onToggleMusic: () => void;
}
const LoveLetter = ({
  visible,
  onClose,
  isPlaying,
  onToggleMusic
}: LoveLetterProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Will you be my Valentine? 💕",
          text: "Someone special just said YES! 💖",
          url: window.location.href
        });
      } catch {
        // User cancelled
      }
    }
  };
  if (!visible) return null;
  return <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
      <div className="animate-letter-reveal w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card valentine-card-shadow">
        {/* Header controls */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card/95 backdrop-blur-sm border-b border-border rounded-t-2xl">
          <button onClick={onToggleMusic} className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label={isPlaying ? "Pause music" : "Play music"}>
            {isPlaying ? <Pause size={16} /> : <Music size={16} />}
            <span className="text-sm font-medium">{isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button onClick={onClose} className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors" aria-label="Close letter">
            <X size={18} />
          </button>
        </div>

        {/* Letter content */}
        <div className="p-6 sm:p-8">
          {/* Decorative header */}
          <div className="text-center mb-6">
            <Heart className="mx-auto text-primary animate-heartbeat" size={40} fill="currentColor" />
            <p className="text-sm text-muted-foreground mt-2 font-medium tracking-wide uppercase">
              February 14, 2026
            </p>
            <h2 className="font-display text-4xl sm:text-5xl valentine-text-gradient mt-3">
              My Dearest Valentine
            </h2>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-primary text-lg">💕</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Message body */}
          <div className="space-y-4 text-foreground leading-relaxed text-base sm:text-lg">
            <p>
              From the moment I met you, my world changed in the most beautiful way.
              Every day with you feels like a gift I never knew I needed.
            </p>
            <p>
              You make the ordinary extraordinary. Your smile lights up even my darkest days,
              and your laugh is the melody I never want to stop hearing.
            </p>
            <p>Thank you for being my person — my best friend, my partner, my everything. I choose you today, tomorrow, and every day after that.</p>
            <p className="font-display text-2xl sm:text-3xl text-primary text-center pt-4">
              Forever & Always Yours ❤️
            </p>
          </div>

          {/* Share button */}
          <div className="mt-8 flex justify-center">
            <button onClick={handleShare} className="flex items-center gap-2 px-6 py-3 rounded-full valentine-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity valentine-glow" aria-label="Share this Valentine">
              <Share2 size={18} />
              Share the Love
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default LoveLetter;