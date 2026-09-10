import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, ChevronRight, X, Heart, Camera, SlidersHorizontal, CloudRain, Share2, Check, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PhotoItem, MilestoneItem } from '../types';
import { AnniversarySelfieModal, PHOTO_FILTERS, PhotoFilterType } from './AnniversarySelfieModal';
import { romanticAudio } from '../utils/audio';

interface FloatingHeartItem {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  drift: number;
}

interface ScreenGalleryProps {
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryContinueButtonText?: string;
  daysTogether?: number;
  photos: PhotoItem[];
  milestones: MilestoneItem[];
  onContinue: () => void;
  onAddPhoto: (newPhoto: PhotoItem) => void;
}

export const ScreenGallery: React.FC<ScreenGalleryProps> = ({
  galleryTitle = 'Our Journey This Past Year 📸',
  gallerySubtitle = 'From that first shy hello to 365 days by your side, every chapter has been pure magic.',
  galleryContinueButtonText = 'Continue to Our 1 Year Quiz 💖',
  daysTogether = 365,
  photos,
  milestones,
  onContinue,
  onAddPhoto,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<number | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeartItem[]>([]);

  // Trigger floating heart animation bursting from button click position
  const triggerFloatingHearts = (clientX?: number, clientY?: number) => {
    const heartColors = ['#f43f5e', '#fb7185', '#ec4899', '#f472b6', '#e11d48', '#fda4af'];
    const count = 16;
    const now = Date.now();
    const originX = clientX ?? window.innerWidth / 2;
    const originY = clientY ?? window.innerHeight / 2;

    const newHearts: FloatingHeartItem[] = [];
    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 160;
      const offsetY = (Math.random() - 0.5) * 40;
      newHearts.push({
        id: now + i,
        x: Math.max(20, Math.min(window.innerWidth - 40, originX + offsetX)),
        y: originY + offsetY,
        size: Math.floor(Math.random() * 16) + 20,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        rotation: Math.floor(Math.random() * 60) - 30,
        drift: Math.floor(Math.random() * 40) - 20,
      });
    }

    setFloatingHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 2100);
  };

  // Share card via Web Share API or Clipboard with floating hearts
  const handleShareCard = async (e: React.MouseEvent) => {
    romanticAudio.playButtonClick();
    triggerFloatingHearts(e.clientX, e.clientY);
    const url = window.location.href;

    const shareData = {
      title: 'Happy 1 Year Anniversary ❤️',
      text: 'Spesial 1 tahun perjalanan cinta kita berdua, buka kartu anniversary kita ya sayang 💕',
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setIsCopied(true);
        romanticAudio.playConfettiPop();
        setTimeout(() => setIsCopied(false), 2800);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: Copy to clipboard
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      romanticAudio.playConfettiPop();
      setTimeout(() => setIsCopied(false), 2800);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2800);
    }
  };

  // Direct WhatsApp Share
  const handleShareWhatsApp = (e: React.MouseEvent) => {
    romanticAudio.playButtonClick();
    triggerFloatingHearts(e.clientX, e.clientY);
    romanticAudio.playConfettiPop();
    const url = window.location.href;
    const text = `Spesial 1 tahun perjalanan cinta kita berdua, buka kartu anniversary kita ya sayang 💕\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Intense Confetti Rain animation when tapping any polaroid photo
  const triggerIntenseConfettiRain = () => {
    romanticAudio.playIntenseConfettiRainSound();
    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#fbbf24', '#c084fc', '#ffffff'];

    // Wave 1: Immediate dual bursts from top left and right
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 80,
      origin: { x: 0.05, y: 0.05 },
      colors,
      gravity: 1.15,
      scalar: 1.15,
      ticks: 260,
    });
    confetti({
      particleCount: 70,
      angle: 120,
      spread: 80,
      origin: { x: 0.95, y: 0.05 },
      colors,
      gravity: 1.15,
      scalar: 1.15,
      ticks: 260,
    });

    // Wave 2: Sky downpour from upper center
    setTimeout(() => {
      confetti({
        particleCount: 95,
        spread: 120,
        origin: { x: 0.5, y: -0.05 },
        colors,
        gravity: 0.95,
        scalar: 1.25,
        ticks: 280,
      });
    }, 160);

    // Wave 3: Cascading rainfall streams
    setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 80,
        spread: 75,
        origin: { x: 0.25, y: 0.0 },
        colors,
        gravity: 1.05,
      });
      confetti({
        particleCount: 55,
        angle: 100,
        spread: 75,
        origin: { x: 0.75, y: 0.0 },
        colors,
        gravity: 1.05,
      });
    }, 350);
  };

  const displayedPhotos = activeMilestoneId
    ? photos.filter((p) => p.milestoneId === activeMilestoneId)
    : photos;

  return (
    <div className="relative min-h-[90vh] max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>1 Year &bull; {daysTogether} Days of Our Story</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
        <h2 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-bold text-stone-800 tracking-tight mb-3 whitespace-nowrap">
          {galleryTitle}
        </h2>
        <p className="text-stone-600 max-w-lg mx-auto text-sm sm:text-base font-medium">
          {gallerySubtitle}
        </p>
      </div>

      {/* Memory Timeline Strip (Emotional Centerpiece) */}
      <div className="mb-10 card-glass rounded-3xl p-5 sm:p-7 shadow-lg border-2 border-rose-200/80 bg-gradient-to-b from-white/90 via-rose-50/30 to-white/90">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1 pb-3 border-b border-rose-100">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              Perjalanan 1 Tahun Kita &bull; {milestones.length} Momen Bersejarah
            </span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Tap any milestone to filter our memories, or view all photos below
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="gallery-share-card-button"
              onClick={handleShareCard}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              title="Salin Link Kartu Anniversary"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Tersalin! 💌</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Bagikan Kartu 💌</span>
                </>
              )}
            </button>
            <button
              id="gallery-take-selfie-top-button"
              onClick={() => setIsCameraModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Anniversary Photo 📸</span>
            </button>
            {activeMilestoneId && (
              <button
                onClick={() => setActiveMilestoneId(null)}
                className="text-xs font-semibold text-rose-500 hover:text-rose-700 underline cursor-pointer"
              >
                Show All ({photos.length})
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Timeline Bar */}
        <div className="relative pt-3 pb-2 overflow-x-auto no-scrollbar">
          <div className="min-w-[540px] relative flex justify-between items-center px-4">
            {/* Connecting Track Line */}
            <div className="absolute top-5 left-10 right-10 h-1 bg-gradient-to-r from-rose-300 via-pink-400 to-amber-300 rounded-full" />

            {milestones.map((milestone) => {
              const isActive = activeMilestoneId === milestone.id;
              return (
                <button
                  key={milestone.id}
                  onClick={() => setActiveMilestoneId(isActive ? null : milestone.id)}
                  className="relative z-10 flex flex-col items-center text-center cursor-pointer group focus:outline-none"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      isActive
                        ? 'bg-gradient-to-br from-rose-500 to-pink-600 border-white text-white shadow-lg shadow-rose-300 scale-115 ring-2 ring-rose-400'
                        : 'bg-white border-rose-300 text-rose-600 group-hover:border-rose-500 group-hover:scale-105 shadow-xs'
                    }`}
                  >
                    <span className="text-xs font-bold">{milestone.id}</span>
                  </div>

                  <span
                    className={`mt-2 text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                      isActive ? 'text-rose-600' : 'text-stone-700 group-hover:text-rose-500'
                    }`}
                  >
                    {milestone.title}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {milestone.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Milestone Callout */}
        {activeMilestoneId && (
          <div className="mt-4 pt-3 border-t border-rose-100 text-xs sm:text-sm text-stone-700 text-center font-medium bg-rose-50/50 rounded-xl p-2.5">
            ✨ <span className="font-semibold text-rose-600">{milestones.find((m) => m.id === activeMilestoneId)?.title},</span> {milestones.find((m) => m.id === activeMilestoneId)?.description}
          </div>
        )}
      </div>

      {/* Polaroid-style Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {displayedPhotos.map((photo) => {
          const rotationDegree = photo.rotation || 0;
          const photoFilterCss = PHOTO_FILTERS.find((f) => f.id === photo.filter)?.cssFilter || 'none';
          const activeFilterInfo = PHOTO_FILTERS.find((f) => f.id === photo.filter && f.id !== 'none');

          return (
            <div
              key={photo.id}
              onClick={() => {
                triggerIntenseConfettiRain();
                setSelectedPhoto(photo);
              }}
              style={{
                transform: `rotate(${rotationDegree}deg)`,
              }}
              className="group relative bg-white p-3.5 pb-5 rounded-lg shadow-md hover:shadow-2xl border border-stone-200/60 hover:scale-[1.03] hover:rotate-0 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Cute Washi Tape at the top of polaroid */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-rose-200/70 border border-white/60 shadow-xs rotate-[-2deg] rounded-xs backdrop-blur-xs pointer-events-none z-10" />

              {/* Photo Image Frame */}
              <div className="relative aspect-4/3 w-full overflow-hidden rounded bg-stone-100 mb-3.5">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  loading="lazy"
                  style={{ filter: photoFilterCss }}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[11px] text-white font-semibold flex items-center gap-1 drop-shadow-md">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Tap for Confetti Rain!
                  </span>
                </div>

                {/* Filter tag if custom filter is applied */}
                {activeFilterInfo && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                    <span>{activeFilterInfo.icon}</span>
                    <span>{activeFilterInfo.label.split(' ')[0]}</span>
                  </div>
                )}
              </div>

              {/* Polaroid Bottom Note Area */}
              <div className="flex-1 flex flex-col justify-between px-1">
                <p className="font-script text-xl sm:text-2xl text-stone-800 leading-snug tracking-wide mb-2">
                  {photo.caption}
                </p>

                <div className="flex items-center justify-between text-xs text-stone-400 font-medium pt-2 border-t border-stone-100">
                  {photo.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-rose-400" />
                      {photo.date}
                    </span>
                  )}
                  {photo.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {photo.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Anniversary Selfie Slot at the end of the gallery flow */}
        <div
          id="gallery-selfie-card"
          onClick={() => {
            romanticAudio.playButtonClick();
            setIsCameraModalOpen(true);
          }}
          className="group relative bg-white/80 hover:bg-white p-4 pb-6 rounded-lg border-2 border-dashed border-rose-300 hover:border-rose-500 shadow-xs hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center min-h-[320px]"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 group-hover:bg-rose-500 text-rose-500 group-hover:text-white flex items-center justify-center mb-3 transition-all duration-300 shadow-xs">
            <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-serif-display text-xl font-bold text-stone-800 group-hover:text-rose-600 transition-colors mb-1.5">
            Take Anniversary Selfie 📸
          </h4>
          <p className="text-xs text-stone-500 max-w-[210px] leading-relaxed mb-4">
            Smile for the camera and pin today&apos;s special 1-year anniversary moment right here!
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200 group-hover:bg-rose-500 group-hover:text-white transition-all">
            <Sparkles className="w-3.5 h-3.5" />
            Open Camera &amp; Snap
          </span>
        </div>
      </div>

      {/* Bottom Action Area: Share via WhatsApp, Share/Copy Card Link, & Continue */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3.5 pb-8">
        <button
          id="gallery-bottom-whatsapp-button"
          onClick={handleShareWhatsApp}
          className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span>Kirim via WhatsApp 💬</span>
        </button>

        <button
          id="gallery-bottom-share-card-button"
          onClick={handleShareCard}
          className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Link Kartu Tersalin! 💌</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              <span>Salin Link Kartu 💌</span>
            </>
          )}
        </button>

        <button
          id="gallery-continue-button"
          onClick={() => {
            romanticAudio.playButtonClick();
            onContinue();
          }}
          className="group inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full font-bold text-base sm:text-lg text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-300 hover:shadow-rose-400 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <span>{galleryContinueButtonText}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Expanded Polaroid Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-4 sm:p-6 pb-6 rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-100 text-stone-600 hover:bg-rose-100 hover:text-rose-600 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Clickable image that triggers Confetti Rain */}
            <div
              onClick={triggerIntenseConfettiRain}
              title="Tap photo to rain confetti!"
              className="relative aspect-4/3 w-full rounded-xl overflow-hidden mb-3 bg-stone-100 shadow-inner cursor-pointer group"
            >
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption}
                style={{
                  filter: PHOTO_FILTERS.find((f) => f.id === selectedPhoto.filter)?.cssFilter || 'none',
                }}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Tap for Confetti Rain</span>
              </div>
            </div>

            <p className="font-script text-2xl sm:text-3xl text-stone-800 mb-2 leading-relaxed">
              &ldquo;{selectedPhoto.caption}&rdquo;
            </p>

            {/* Aesthetic Filter Toggle Bar */}
            <div className="mt-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
                  Filter Style
                </span>
                <button
                  type="button"
                  onClick={triggerIntenseConfettiRain}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Confetti Rain!</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1 p-1 bg-stone-100 rounded-xl">
                {PHOTO_FILTERS.map((f) => {
                  const isCurrent = (selectedPhoto.filter || 'none') === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        romanticAudio.playButtonClick();
                        setSelectedPhoto((prev) => (prev ? { ...prev, filter: f.id } : null));
                      }}
                      className={`flex flex-col items-center py-1.5 px-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-white text-rose-600 shadow-xs border border-rose-200 font-bold scale-102'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                      }`}
                    >
                      <span className="text-sm leading-none mb-0.5">{f.icon}</span>
                      <span className="truncate max-w-[48px]">{f.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-3 mt-3 border-t border-stone-100">
              <div className="flex items-center gap-4">
                {selectedPhoto.date && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    {selectedPhoto.date}
                  </span>
                )}
                {selectedPhoto.location && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {selectedPhoto.location}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-400 font-medium">
                Forever Memories
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Anniversary Selfie Camera Modal */}
      <AnniversarySelfieModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onAddSelfie={onAddPhoto}
      />

      {/* Floating Hearts Animation Effect on Share */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute animate-float-heart pointer-events-none"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              ['--drift-x' as any]: `${heart.drift}px`,
            }}
          >
            <Heart
              style={{
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                color: heart.color,
                fill: heart.color,
                filter: 'drop-shadow(0 2px 10px rgba(244, 63, 94, 0.45))',
                transform: `rotate(${heart.rotation}deg)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
