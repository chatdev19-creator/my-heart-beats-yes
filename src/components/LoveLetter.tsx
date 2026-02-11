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
            <p>You make the ordinary extraordinary. Your smile lights up even my darkest days, and your laugh is the melody I never want to stop hearing.  I love the little things about you The way your presence alone can make my bad days feel lighter.   The way you make me laugh when I don’t even feel like smiling.  And the way you listen, really listen, like my thoughts and dreams truly matter to you.  Those small things might seem simple, but to me, they mean everything.  Being with you has taught me what love really feels like—not just the exciting, happy moments, but the quiet, peaceful ones too.   The moments where we don’t even need to talk, just being together is enough.  The moments where I realize that no matter how hard the day is, coming back to you makes everything feel okay again.                                                                                                                  I don’t think I say this enough, but you mean more to me than words can ever fully explain.   You are my comfort when I’m tired, my calm when I’m stressed, and my happiness when I need it most.   When I think about you, my heart feels full in a way that’s hard to describe like it finally found the place it was always looking for.      ////////////////////////////////// On this Valentine’s Day, I just want to promise you something simple but true I choose you Today, tomorrow, and every day I choose your smile, your heart, your dreams, and even your flaws because they are all part of the person I love. I want to keep building memories with you, sharing laughs with you, and walking through life with you, side by side</p>
            <p> </p>
            <p className="font-display text-2xl sm:text-3xl text-primary text-center pt-4">
              Forever & Always Yours  ROBA❤️
            </p>
          </div>

          {/* Share button */}
          <div className="mt-8 flex justify-center">
            
          </div>
        </div>
      </div>
    </div>;
};
export default LoveLetter;