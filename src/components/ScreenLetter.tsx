import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, RotateCcw, PartyPopper, CheckCircle, Download, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticAudio } from '../utils/audio';
import { FloatingBalloons } from './FloatingBalloons';
import { DownloadLetterModal, PAPER_THEMES, FONT_CHOICES } from './DownloadLetterModal';
import { PaperStyleId, FontStyleId } from '../types';

interface ScreenLetterProps {
  recipientName: string;
  senderSignature: string;
  letterTitle: string;
  letterGreeting?: string;
  paragraphs: string[];
  letterAnniversaryBlessingTitle?: string;
  letterAnniversaryBlessingSubtitle?: string;
  letterSignOffLabel?: string;
  onReplay: () => void;
}

export const ScreenLetter: React.FC<ScreenLetterProps> = ({
  recipientName,
  senderSignature,
  letterTitle,
  letterGreeting,
  paragraphs,
  letterAnniversaryBlessingTitle,
  letterAnniversaryBlessingSubtitle,
  letterSignOffLabel = 'Forever and always yours,',
  onReplay,
}) => {
  const [revealedCount, setRevealedCount] = useState<number>(1);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  // UI Theme state that updates the live screen UI
  const [paperTheme, setPaperTheme] = useState<PaperStyleId>('parchment');
  const [fontStyle, setFontStyle] = useState<FontStyleId>('dancing-script');

  const currentPaper = PAPER_THEMES.find((p) => p.id === paperTheme) || PAPER_THEMES[0];
  const currentFont = FONT_CHOICES.find((f) => f.id === fontStyle) || FONT_CHOICES[0];

  const isFullyRevealed = revealedCount >= paragraphs.length;

  const triggerCelebration = () => {
    romanticAudio.playConfettiPop();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#fda4af', '#f472b6'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ec4899', '#d946ef', '#fb7185'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#fbbf24', '#f43f5e'],
      });
    }, 400);

    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#e11d48', '#fbcfe8', '#fef08a'],
      });
    }, 900);
  };

  useEffect(() => {
    if (isFullyRevealed && !hasCelebrated) {
      setHasCelebrated(true);
      triggerCelebration();
    }
  }, [isFullyRevealed, hasCelebrated]);

  const handleRevealNext = () => {
    romanticAudio.playButtonClick();
    if (revealedCount < paragraphs.length) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  const handleRevealAll = () => {
    romanticAudio.playButtonClick();
    setRevealedCount(paragraphs.length);
  };

  const activeBlessingTitle =
    letterAnniversaryBlessingTitle || `Happy 1st Anniversary, ${recipientName}!`;
  const activeBlessingSubtitle =
    letterAnniversaryBlessingSubtitle ||
    "Here's to 365 days of loving you, and all the years yet to come.";

  const handleCopyLetter = () => {
    romanticAudio.playButtonClick();
    const greeting = letterGreeting || `Dearest ${recipientName},`;
    const fullText = `${letterTitle}\n\n${greeting}\n\n${paragraphs.join('\n\n')}\n\n${activeBlessingTitle}\n${activeBlessingSubtitle}\n\n${senderSignature}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative min-h-[90vh] max-w-3xl mx-auto px-4 py-8">
      {/* Subtle upward-floating balloons when final paragraph is revealed */}
      {isFullyRevealed && <FloatingBalloons />}

      {/* Quick Theme Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
          <Palette className="w-4 h-4 text-rose-500" />
          <span className="hidden sm:inline">Stationery Theme</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1 rounded-2xl border border-stone-200/80 shadow-xs">
          {PAPER_THEMES.slice(0, 3).map((theme) => {
            const isSelected = paperTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  romanticAudio.playButtonClick();
                  setPaperTheme(theme.id);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{theme.ornament}</span>
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The Romantic Letter Sheet (Live-updating with selected theme & font) */}
      <div
        className={`relative rounded-3xl p-6 sm:p-12 shadow-2xl transition-all duration-500 ${currentPaper.bgClass} ${currentPaper.borderClass} ${currentPaper.textClass}`}
        style={{ fontFamily: currentFont.fontFamily }}
      >
        {/* Decorative Golden Corner Accents */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-current opacity-30 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-current opacity-30 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-current opacity-30 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-current opacity-30 rounded-br-lg pointer-events-none" />

        {/* Vintage Top Stamp / Heart Seal */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 border-white mb-3 ${currentPaper.sealColor}`}
          >
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <span className={`text-xs font-bold uppercase tracking-widest opacity-80 ${currentPaper.accentClass}`}>
            A Letter From The Heart
          </span>
          <h2
            className={`font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mt-1 text-center whitespace-nowrap ${currentPaper.headingClass}`}
          >
            {letterTitle}
          </h2>
          <div className="w-24 h-0.5 bg-current opacity-20 mt-3" />
        </div>

        {/* Salutation */}
        <div className={`mb-6 text-2xl sm:text-3xl font-bold italic whitespace-nowrap ${currentPaper.headingClass}`}>
          {letterGreeting || `Dearest ${recipientName},`}
        </div>

        {/* Paragraphs with gradual fade-in effect */}
        <div className={`space-y-5 leading-relaxed ${currentFont.bodyStyle}`}>
          {paragraphs.slice(0, revealedCount).map((p, idx) => (
            <p
              key={idx}
              className="animate-in fade-in slide-in-from-bottom-3 duration-700 font-normal leading-relaxed indent-4"
            >
              {p}
            </p>
          ))}
        </div>

        {/* Gradual Reveal Controls if not fully revealed yet */}
        {!isFullyRevealed && (
          <div className="mt-8 pt-6 border-t border-current/15 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="letter-reveal-next-button"
              onClick={handleRevealNext}
              className="px-6 py-2.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Read next thought...</span>
              <Sparkles className="w-4 h-4 text-amber-200" />
            </button>
            <button
              id="letter-reveal-all-button"
              onClick={handleRevealAll}
              className="text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-700 underline cursor-pointer py-1"
            >
              Reveal entire letter at once
            </button>
          </div>
        )}

        {/* Closing, Signature, and Confetti when fully revealed */}
        {isFullyRevealed && (
          <div className="mt-10 pt-8 border-t-2 border-current/15 animate-in fade-in duration-1000">
            <div className="text-center sm:text-left mb-6">
              <p
                className={`font-serif-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap ${currentPaper.headingClass}`}
              >
                <span>{activeBlessingTitle}</span>
                <span className="text-2xl animate-bounce">🥂✨</span>
              </p>
              <p className="text-xs sm:text-sm mt-1 opacity-75 italic">
                {activeBlessingSubtitle}
              </p>
              <div className="mt-6">
                <p className="text-xs sm:text-sm uppercase tracking-wider opacity-70">
                  {letterSignOffLabel}
                </p>
                <p className="font-script text-3xl sm:text-4xl mt-1 font-bold">
                  {senderSignature}
                </p>
              </div>
            </div>

            {/* Post-Celebration Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10 pt-6 border-t border-current/10">
              {/* Prominent Download Letter Keepsake Button */}
              <button
                id="letter-download-modal-button"
                onClick={() => {
                  romanticAudio.playButtonClick();
                  setIsDownloadModalOpen(true);
                }}
                className="group flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                <span>Customize &amp; Download Letter 💌</span>
              </button>

              <button
                id="letter-confetti-button"
                onClick={triggerCelebration}
                className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm sm:text-base text-rose-700 bg-rose-100 hover:bg-rose-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <PartyPopper className="w-4 h-4 text-rose-500" />
                <span>Shower More Confetti!</span>
              </button>

              <button
                id="letter-copy-button"
                onClick={handleCopyLetter}
                className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-xs sm:text-sm text-stone-700 bg-white/90 border border-stone-200 hover:bg-stone-50 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-bold">Copied to Clipboard!</span>
                  </>
                ) : (
                  <span>Copy Letter Text</span>
                )}
              </button>

              <button
                id="letter-replay-button"
                onClick={() => {
                  romanticAudio.playButtonClick();
                  onReplay();
                }}
                className="group flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-stone-500 group-hover:-rotate-90 transition-transform duration-300" />
                <span>Replay Experience</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Download Keepsake Letter Studio Modal */}
      <DownloadLetterModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        recipientName={recipientName}
        senderSignature={senderSignature}
        letterTitle={letterTitle}
        letterGreeting={letterGreeting}
        paragraphs={paragraphs}
        letterBirthdayBlessingTitle={activeBlessingTitle}
        letterBirthdayBlessingSubtitle={activeBlessingSubtitle}
        letterAnniversaryBlessingTitle={activeBlessingTitle}
        letterAnniversaryBlessingSubtitle={activeBlessingSubtitle}
        letterSignOffLabel={letterSignOffLabel}
        currentPaperTheme={paperTheme}
        currentFontStyle={fontStyle}
        onUpdateTheme={(paper, font) => {
          setPaperTheme(paper);
          setFontStyle(font);
        }}
      />
    </div>
  );
};
