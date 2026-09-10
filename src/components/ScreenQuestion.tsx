import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

interface ScreenQuestionProps {
  recipientName: string;
  questionTitle?: string;
  questionSubtitleInitial?: string;
  questionSubtitleDodge?: string;
  questionYesText?: string;
  questionNoTexts?: string[];
  onAnswerYes: () => void;
}

export const ScreenQuestion: React.FC<ScreenQuestionProps> = ({
  recipientName,
  questionTitle = 'Do you like me? ❤️',
  questionSubtitleInitial,
  questionSubtitleDodge = "You know in your heart there's only one right answer! 💕",
  questionYesText = 'YES, OF COURSE! 🥰',
  questionNoTexts = [
    'No 🙈',
    'Are you sure? 🥺',
    'Think again! 😜',
    'Too slow! 🏃‍♂️',
    'Nice try! ✨',
    'Oops, No was not found 💫',
    'Can’t touch this! 🎶',
    'Just press Yes! 🥰',
  ],
  onAnswerYes,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null);

  const playfulNoTexts = questionNoTexts;

  // Reposition the "No" button smoothly to a random position across the ENTIRE viewport screen
  const dodgeNoButton = () => {
    const padding = 24;
    const btnWidth = 160;
    const btnHeight = 54;

    const viewportW = typeof window !== 'undefined' ? window.innerWidth : 800;
    const viewportH = typeof window !== 'undefined' ? window.innerHeight : 700;

    const maxX = Math.max(padding, viewportW - btnWidth - padding);
    const maxY = Math.max(padding, viewportH - btnHeight - padding);

    // Pick random coordinates anywhere across the entire screen
    const nextX = Math.max(padding, Math.floor(Math.random() * (maxX - padding)));
    const nextY = Math.max(padding, Math.floor(Math.random() * (maxY - padding)));

    setNoPosition({ x: nextX, y: nextY });
    setDodgeCount((prev) => prev + 1);
    romanticAudio.playDodgeSqueak();
  };

  // Monitor cursor proximity across the entire window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!noBtnRef.current) return;
      const btnRect = noBtnRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
      // Threshold: if within 90 pixels of button center anywhere on screen, dodge away!
      if (dist < 90) {
        dodgeNoButton();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const currentNoText = playfulNoTexts[Math.min(dodgeCount, playfulNoTexts.length - 1)];

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-8 select-none">
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl min-h-[460px] sm:min-h-[500px] card-glass rounded-3xl p-6 sm:p-10 shadow-2xl border border-rose-100 flex flex-col items-center justify-center text-center"
      >
        {/* Animated cute emoji / illustration */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-rose-100/80 border-2 border-rose-200 flex items-center justify-center text-5xl sm:text-6xl shadow-inner animate-float-slow">
            {dodgeCount === 0 ? '🥺' : dodgeCount < 3 ? '🥹' : dodgeCount < 6 ? '🤭' : '🥰'}
          </div>
          <span className="absolute -top-1 -right-1 text-2xl animate-spin-slow">✨</span>
        </div>

        {/* Question Header - Single line title */}
        <h2 className="font-serif-display text-xl sm:text-3xl md:text-4xl font-bold text-stone-800 mb-3 tracking-tight whitespace-nowrap">
          {questionTitle}
        </h2>

        <p className="text-stone-600 font-medium text-sm sm:text-base max-w-md mb-6 leading-relaxed">
          {dodgeCount === 0
            ? (questionSubtitleInitial || `Please answer honestly, ${recipientName}... There are only two choices! 😉`)
            : questionSubtitleDodge}
        </p>

        {/* Buttons Playground Area */}
        <div className="relative w-full h-36 sm:h-40 flex items-center justify-center">
          {/* Static YES button */}
          <div className="z-10">
            <button
              id="question-yes-button"
              onClick={() => {
                romanticAudio.playButtonClick();
                onAnswerYes();
              }}
              style={{
                transform: `scale(${1 + Math.min(dodgeCount * 0.05, 0.35)})`,
              }}
              className="group relative flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full font-bold text-base sm:text-lg text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-300 hover:shadow-rose-400 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-white text-rose-100 animate-pulse" />
              <span>{questionYesText}</span>
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-200" />
            </button>
          </div>

          {/* Dodging NO button that can escape to ANYWHERE on the screen */}
          <button
            ref={noBtnRef}
            id="question-no-button"
            onMouseEnter={dodgeNoButton}
            onTouchStart={(e) => {
              e.preventDefault();
              dodgeNoButton();
            }}
            onClick={(e) => {
              e.preventDefault();
              dodgeNoButton();
            }}
            style={
              noPosition
                ? {
                    position: 'fixed',
                    left: `${noPosition.x}px`,
                    top: `${noPosition.y}px`,
                    zIndex: 9999,
                    transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }
                : {
                    position: 'relative',
                    marginLeft: '24px',
                  }
            }
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base text-stone-600 bg-white/95 border-2 border-rose-200 shadow-xl hover:shadow-2xl cursor-pointer whitespace-nowrap"
          >
            {currentNoText}
          </button>
        </div>
      </div>
    </div>
  );
};
