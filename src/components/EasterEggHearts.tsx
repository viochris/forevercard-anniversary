import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticAudio } from '../utils/audio';

interface FloatingHeart {
  id: number;
  left: number;
  top: number;
  emoji: string;
  size: number;
  vx: number;
  vy: number;
}

export const EasterEggHearts: React.FC = () => {
  const [clickCount, setClickCount] = useState<number>(0);
  const [showSecretBanner, setShowSecretBanner] = useState<boolean>(false);
  const [activeBurst, setActiveBurst] = useState<FloatingHeart[]>([]);

  const handleHeartClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 3) {
      // Trigger easter egg sound effect
      romanticAudio.playEasterEggChime();

      // Trigger multi-point confetti
      confetti({
        particleCount: 70,
        spread: 100,
        origin: { x: 0.15, y: 0.2 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#fbcfe8'],
      });

      confetti({
        particleCount: 60,
        spread: 120,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#fbbf24', '#f43f5e', '#a855f7'],
      });

      // Spawn full-screen floating hearts shower
      const emojis = ['💖', '💕', '💗', '💓', '✨', '🌸', '🌹', '🥰', '💌'];
      const hearts: FloatingHeart[] = [];
      for (let i = 0; i < 40; i++) {
        hearts.push({
          id: Math.random(),
          left: Math.random() * 90 + 5,
          top: Math.random() * 80 + 10,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          size: Math.floor(Math.random() * 20) + 24,
          vx: (Math.random() - 0.5) * 60,
          vy: -Math.random() * 80 - 40,
        });
      }
      setActiveBurst(hearts);
      setShowSecretBanner(true);

      // Reset count after 4 seconds
      setTimeout(() => {
        setActiveBurst([]);
      }, 3500);

      setTimeout(() => {
        setShowSecretBanner(false);
        setClickCount(0);
      }, 5000);
    }
  };

  return (
    <>
      {/* Corner easter egg trigger */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2">
        <button
          id="easter-egg-heart-button"
          onClick={handleHeartClick}
          title="A secret little corner... tap me!"
          aria-label="Secret heart button"
          className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-rose-200/90 shadow-sm backdrop-blur-md hover:bg-rose-50 hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              clickCount === 0
                ? 'text-rose-400 group-hover:text-rose-600 group-hover:fill-rose-100'
                : clickCount === 1
                ? 'text-rose-500 fill-rose-300 animate-pulse'
                : 'text-rose-600 fill-rose-500 scale-125 animate-bounce'
            }`}
          />
          {clickCount > 0 && clickCount < 3 && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              {clickCount}
            </span>
          )}
        </button>

        {clickCount === 1 && (
          <span className="hidden sm:inline-block text-xs font-medium text-rose-500/90 bg-white/90 px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs border border-rose-100 animate-fade-in">
            psst... tap again ✨
          </span>
        )}
        {clickCount === 2 && (
          <span className="hidden sm:inline-block text-xs font-semibold text-rose-600 bg-white/90 px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs border border-rose-200 animate-bounce">
            One more tap! 💖
          </span>
        )}
      </div>

      {/* Secret Love Note Banner when unlocked */}
      {showSecretBanner && (
        <div className="fixed inset-x-0 top-16 z-50 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white/95 border-2 border-rose-300 shadow-2xl rounded-2xl px-6 py-4 max-w-md text-center backdrop-blur-lg pointer-events-auto">
            <div className="flex items-center justify-center gap-2 text-rose-600 font-serif-display text-lg font-bold">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300" />
              <span>Secret Love Note Unlocked!</span>
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300" />
            </div>
            <p className="mt-1 text-sm text-stone-700 font-medium leading-relaxed">
              Every single beat of my heart quietly whispers how grateful I am to have you in my life. You are pure magic! 💌✨
            </p>
          </div>
        </div>
      )}

      {/* Bursting floating hearts */}
      {activeBurst.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {activeBurst.map((h) => (
            <span
              key={h.id}
              className="absolute select-none animate-float-burst"
              style={{
                left: `${h.left}%`,
                top: `${h.top}%`,
                fontSize: `${h.size}px`,
                animation: 'burstDrift 3.5s ease-out forwards',
              }}
            >
              {h.emoji}
            </span>
          ))}
          <style>{`
            @keyframes burstDrift {
              0% {
                opacity: 1;
                transform: translate(0, 0) scale(0.3) rotate(0deg);
              }
              25% {
                opacity: 1;
                transform: translate(calc(var(--vx, 15px)), -50px) scale(1.3) rotate(15deg);
              }
              100% {
                opacity: 0;
                transform: translate(calc(var(--vx, -25px)), -220px) scale(0.8) rotate(45deg);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
};
