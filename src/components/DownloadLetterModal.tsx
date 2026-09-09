import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Sparkles, Heart, Check, Loader2, Palette, Type, AlertCircle } from 'lucide-react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { romanticAudio } from '../utils/audio';
import { PaperStyleId, FontStyleId } from '../types';

export interface PaperTheme {
  id: PaperStyleId;
  name: string;
  subtitle: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  headingClass: string;
  accentClass: string;
  ornament: string;
  sealColor: string;
  bgColorCode: string;
}

export const PAPER_THEMES: PaperTheme[] = [
  {
    id: 'parchment',
    name: 'Classic Parchment',
    subtitle: 'Antique gold & vintage crest',
    bgClass: 'bg-[#faf3e8]',
    borderClass: 'border-2 border-[#d4af37]/60 shadow-[0_10px_35px_rgba(180,83,9,0.12)]',
    textClass: 'text-[#451a03]',
    headingClass: 'text-[#78350f]',
    accentClass: 'text-[#b45309]',
    ornament: '⚜️',
    sealColor: 'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 border-amber-500',
    bgColorCode: '#faf3e8',
  },
  {
    id: 'floral',
    name: 'Floral Vellum',
    subtitle: 'Blush rose & delicate botanicals',
    bgClass: 'bg-[#fff1f2]',
    borderClass: 'border-2 border-rose-300/80 shadow-[0_10px_35px_rgba(244,63,94,0.14)]',
    textClass: 'text-[#4c0519]',
    headingClass: 'text-[#9f1239]',
    accentClass: 'text-[#e11d48]',
    ornament: '🌸',
    sealColor: 'bg-gradient-to-br from-rose-600 to-pink-700 text-rose-100 border-rose-300',
    bgColorCode: '#fff1f2',
  },
  {
    id: 'minimal',
    name: 'Modern Minimal',
    subtitle: 'Clean ivory linen & sleek serif',
    bgClass: 'bg-[#fafaf9]',
    borderClass: 'border-2 border-stone-300/80 shadow-[0_10px_35px_rgba(0,0,0,0.07)]',
    textClass: 'text-[#1c1917]',
    headingClass: 'text-[#292524]',
    accentClass: 'text-[#78716c]',
    ornament: '💌',
    sealColor: 'bg-gradient-to-br from-stone-800 to-stone-900 text-stone-100 border-stone-400',
    bgColorCode: '#fafaf9',
  },
  {
    id: 'midnight',
    name: 'Celestial Midnight',
    subtitle: 'Starlight navy & gold foil',
    bgClass: 'bg-[#0f172a]',
    borderClass: 'border-2 border-amber-400/50 shadow-[0_10px_35px_rgba(15,23,42,0.4)]',
    textClass: 'text-[#f1f5f9]',
    headingClass: 'text-[#fde047]',
    accentClass: 'text-[#fbbf24]',
    ornament: '✨',
    sealColor: 'bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-900 border-amber-300 font-bold',
    bgColorCode: '#0f172a',
  },
];

export interface FontChoice {
  id: FontStyleId;
  name: string;
  category: string;
  fontFamily: string;
  bodyStyle: string;
}

export const FONT_CHOICES: FontChoice[] = [
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    category: 'Romantic Cursive',
    fontFamily: "'Dancing Script', cursive",
    bodyStyle: "font-['Dancing_Script'] text-2xl sm:text-3xl leading-relaxed tracking-wide font-semibold",
  },
  {
    id: 'shadows-into-light',
    name: 'Shadows Into Light',
    category: 'Playful Note',
    fontFamily: "'Shadows Into Light', cursive",
    bodyStyle: "font-['Shadows_Into_Light'] text-xl sm:text-2xl leading-loose font-medium",
  },
  {
    id: 'caveat',
    name: 'Caveat',
    category: 'Warm Journal',
    fontFamily: "'Caveat', cursive",
    bodyStyle: "font-['Caveat'] text-2xl sm:text-3xl leading-relaxed font-semibold",
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'Editorial Serif',
    fontFamily: "'Playfair Display', serif",
    bodyStyle: "font-['Playfair_Display'] text-base sm:text-lg leading-relaxed",
  },
  {
    id: 'garamond',
    name: 'Cormorant Garamond',
    category: 'Poetic Garamond',
    fontFamily: "'Cormorant Garamond', serif",
    bodyStyle: "font-['Cormorant_Garamond'] text-lg sm:text-xl leading-relaxed",
  },
  {
    id: 'great-vibes',
    name: 'Great Vibes',
    category: 'Formal Calligraphy',
    fontFamily: "'Great Vibes', cursive",
    bodyStyle: "font-['Great_Vibes'] text-2xl sm:text-3xl leading-loose font-normal",
  },
];

interface DownloadLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  senderSignature: string;
  letterTitle: string;
  letterGreeting?: string;
  paragraphs: string[];
  letterAnniversaryBlessingTitle?: string;
  letterAnniversaryBlessingSubtitle?: string;
  letterBirthdayBlessingTitle?: string;
  letterBirthdayBlessingSubtitle?: string;
  letterSignOffLabel?: string;
  currentPaperTheme: PaperStyleId;
  currentFontStyle: FontStyleId;
  onUpdateTheme: (paper: PaperStyleId, font: FontStyleId) => void;
}

export const DownloadLetterModal: React.FC<DownloadLetterModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  senderSignature,
  letterTitle,
  letterGreeting,
  paragraphs,
  letterAnniversaryBlessingTitle,
  letterAnniversaryBlessingSubtitle,
  letterBirthdayBlessingTitle,
  letterBirthdayBlessingSubtitle,
  letterSignOffLabel = 'Forever and always yours,',
  currentPaperTheme,
  currentFontStyle,
  onUpdateTheme,
}) => {
  const letterRef = useRef<HTMLDivElement>(null);
  const [selectedPaper, setSelectedPaper] = useState<PaperStyleId>(currentPaperTheme);
  const [selectedFont, setSelectedFont] = useState<FontStyleId>(currentFontStyle);
  const [includeWaxSeal, setIncludeWaxSeal] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedPaper(currentPaperTheme);
    setSelectedFont(currentFontStyle);
  }, [currentPaperTheme, currentFontStyle]);

  if (!isOpen) return null;

  const currentPaper = PAPER_THEMES.find((p) => p.id === selectedPaper) || PAPER_THEMES[0];
  const currentFont = FONT_CHOICES.find((f) => f.id === selectedFont) || FONT_CHOICES[0];

  const handleSelectPaper = (paperId: PaperStyleId) => {
    romanticAudio.playButtonClick();
    setSelectedPaper(paperId);
    onUpdateTheme(paperId, selectedFont);
  };

  const handleSelectFont = (fontId: FontStyleId) => {
    romanticAudio.playButtonClick();
    setSelectedFont(fontId);
    onUpdateTheme(selectedPaper, fontId);
  };

  // Download high-resolution PNG image
  const handleDownloadPNG = async () => {
    if (!letterRef.current || isGenerating) return;
    setIsGenerating(true);
    setDownloadError(null);
    romanticAudio.playButtonClick();

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }

      let dataUrl: string;
      try {
        dataUrl = await toPng(letterRef.current, {
          pixelRatio: 2.5,
          backgroundColor: currentPaper.bgColorCode,
          cacheBust: true,
          skipFonts: true,
          fontEmbedCSS: '',
          style: {
            transform: 'none',
            borderRadius: '16px',
            margin: '0 auto',
          },
        });
      } catch (pngErr) {
        console.warn('toPng skipped or encountered error, falling back to html2canvas:', pngErr);
        const canvas = await html2canvas(letterRef.current, {
          scale: 2.5,
          backgroundColor: currentPaper.bgColorCode,
          useCORS: true,
          logging: false,
        });
        dataUrl = canvas.toDataURL('image/png');
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `ForeverCard-Letter-${recipientName.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      romanticAudio.playConfettiPop();
      setDownloadSuccess('Keepsake letter saved successfully as an HD image!');
      setTimeout(() => setDownloadSuccess(null), 4500);
    } catch (err) {
      console.error('Failed to generate letter image:', err);
      setDownloadError('Could not generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative bg-white rounded-3xl p-4 sm:p-7 max-w-4xl w-full shadow-2xl border border-rose-100 flex flex-col my-auto max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg sm:text-xl font-bold text-stone-800">
                Letter Keepsake Studio 💌
              </h3>
              <p className="text-xs text-stone-500">
                Customize stationery and calligraphy, then download your letter as a beautiful keepsake image.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              romanticAudio.playButtonClick();
              onClose();
            }}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Controls (Paper & Font Pickers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 shrink-0 bg-stone-50/90 p-3 rounded-2xl border border-stone-200/70">
          {/* Paper Style Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>1. Stationery Paper Style</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {PAPER_THEMES.map((theme) => {
                const isSelected = selectedPaper === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleSelectPaper(theme.id)}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 shadow-xs ring-2 ring-rose-300'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <span className="text-base mb-0.5">{theme.ornament}</span>
                    <span className="text-[11px] font-bold text-stone-800 truncate w-full">
                      {theme.name}
                    </span>
                    <span className="text-[9px] text-stone-500 truncate w-full">
                      {theme.subtitle.split('&')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Style Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-rose-500" />
              <span>2. Typography &amp; Calligraphy</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {FONT_CHOICES.map((font) => {
                const isSelected = selectedFont === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => handleSelectFont(font.id)}
                    className={`flex flex-col items-center p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 shadow-xs ring-2 ring-rose-300'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <span
                      style={{ fontFamily: font.fontFamily }}
                      className="text-base font-semibold text-rose-600 mb-0.5"
                    >
                      Aa
                    </span>
                    <span className="text-[10px] font-bold text-stone-800 truncate w-full">
                      {font.name.split(' ')[0]}
                    </span>
                    <span className="text-[8px] text-stone-500 truncate w-full">
                      {font.category.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Options strip */}
        <div className="flex items-center justify-between mb-2.5 px-1 text-xs text-stone-600 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeWaxSeal}
              onChange={(e) => {
                romanticAudio.playButtonClick();
                setIncludeWaxSeal(e.target.checked);
              }}
              className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 border-stone-300"
            />
            <span className="font-semibold text-stone-700">Include Embossed Wax Seal Stamp</span>
          </label>
          <span className="text-[11px] text-stone-400 italic hidden sm:inline">
            Active theme updates on screen and exports in crystal-clear fidelity
          </span>
        </div>

        {/* Live Letter Preview Scroll Container */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-stone-100 rounded-2xl border border-stone-200/80 mb-3 shadow-inner">
          <div
            id="downloadable-letter-sheet"
            ref={letterRef}
            className={`relative mx-auto max-w-xl p-6 sm:p-10 rounded-2xl transition-all duration-300 ${currentPaper.bgClass} ${currentPaper.borderClass} ${currentPaper.textClass}`}
            style={{ fontFamily: currentFont.fontFamily }}
          >
            {/* Corner Decorative Borders */}
            <div className="absolute top-3 left-3 text-xs opacity-60 pointer-events-none select-none">
              ✦
            </div>
            <div className="absolute top-3 right-3 text-xs opacity-60 pointer-events-none select-none">
              ✦
            </div>
            <div className="absolute bottom-3 left-3 text-xs opacity-60 pointer-events-none select-none">
              ✦
            </div>
            <div className="absolute bottom-3 right-3 text-xs opacity-60 pointer-events-none select-none">
              ✦
            </div>

            {/* Letter Header */}
            <div className="text-center mb-6 pb-4 border-b border-stone-400/30">
              <div className="text-lg mb-1">{currentPaper.ornament}</div>
              <h2
                className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight ${currentPaper.headingClass}`}
              >
                {letterTitle}
              </h2>
              <p className={`text-xs sm:text-sm uppercase tracking-widest mt-1 opacity-75 ${currentPaper.accentClass}`}>
                ForeverCard Keepsake Edition
              </p>
            </div>

            {/* Recipient Salutation */}
            <div className="text-xl sm:text-2xl font-bold mb-4">
              {letterGreeting || `Dearest ${recipientName},`}
            </div>

            {/* Paragraphs */}
            <div className={`space-y-4 ${currentFont.bodyStyle}`}>
              {paragraphs.map((p, idx) => (
                <p key={idx} className="indent-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Special Anniversary Blessing Callout */}
            <div className="my-6 pt-5 pb-3 border-t border-stone-400/30 text-center">
              <p className={`text-xl sm:text-2xl font-bold whitespace-nowrap ${currentPaper.headingClass}`}>
                {letterAnniversaryBlessingTitle || letterBirthdayBlessingTitle || `Happy 1st Anniversary, ${recipientName}! 🥂✨`}
              </p>
              <p className="text-xs sm:text-sm mt-1 opacity-80 italic">
                {letterAnniversaryBlessingSubtitle || letterBirthdayBlessingSubtitle || "Here's to 365 days of loving you, and all the years yet to come."}
              </p>
            </div>

            {/* Signature & Seal Area */}
            <div className="flex items-end justify-between mt-6 pt-3">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-wider opacity-70">
                  {letterSignOffLabel}
                </p>
                <p className="font-script text-3xl sm:text-4xl mt-1 font-bold">
                  {senderSignature}
                </p>
              </div>

              {/* Optional Wax Seal */}
              {includeWaxSeal && (
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center border-2 shadow-lg ${currentPaper.sealColor} rotate-[-6deg] select-none`}
                >
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="text-[8px] uppercase tracking-widest font-bold mt-0.5">
                    Forever
                  </span>
                </div>
              )}
            </div>

            {/* Subtle Footer Timestamp */}
            <div className="text-center mt-8 pt-3 border-t border-stone-400/20 text-[10px] opacity-60">
              Cherished with ForeverCard &bull; Written with all my love
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 shrink-0 border-t border-stone-100">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            {downloadSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                {downloadSuccess}
              </span>
            ) : downloadError ? (
              <span className="text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                {downloadError}
              </span>
            ) : (
              <span>Renders a high-resolution PNG image ready to save or share</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              id="download-letter-png-button"
              onClick={handleDownloadPNG}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving HD Image...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>Download Letter as Image (PNG) 💌</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
