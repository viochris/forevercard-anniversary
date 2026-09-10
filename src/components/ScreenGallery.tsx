import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, ChevronRight, X, Heart, Camera, SlidersHorizontal, CloudRain, Share2, Check, MessageCircle, Download, Pencil } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PhotoItem, MilestoneItem } from '../types';
import { AnniversarySelfieModal, PHOTO_FILTERS, PhotoFilterType } from './AnniversarySelfieModal';
import { romanticAudio } from '../utils/audio';
import { downloadCollageImage } from '../utils/collageGenerator';

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
  onUpdateCaption?: (photoId: number, newCaption: string) => void;
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
  onUpdateCaption,
}) => {
  const [localPhotos, setLocalPhotos] = useState<PhotoItem[]>(photos);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
  const [editingCaptionText, setEditingCaptionText] = useState<string>('');
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [isModalEditingCaption, setIsModalEditingCaption] = useState<boolean>(false);
  const [modalCaptionInput, setModalCaptionInput] = useState<string>('');

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<number | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGeneratingCollage, setIsGeneratingCollage] = useState<boolean>(false);
  const [isCollageDownloaded, setIsCollageDownloaded] = useState<boolean>(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeartItem[]>([]);

  // Keep localPhotos in sync if parent photos update
  useEffect(() => {
    setLocalPhotos(photos);
  }, [photos]);

  const handleToggleEditMode = () => {
    romanticAudio.playButtonClick();
    const next = !isEditMode;
    setIsEditMode(next);
    if (!next) {
      setEditingPhotoId(null);
      setEditingCaptionText('');
    }
  };

  const handleStartEditCaption = (photo: PhotoItem) => {
    romanticAudio.playButtonClick();
    setEditingPhotoId(photo.id);
    setEditingCaptionText(photo.caption);
  };

  const handleCancelEditCaption = () => {
    romanticAudio.playButtonClick();
    setEditingPhotoId(null);
    setEditingCaptionText('');
  };

  const handleSaveCaption = (photoId: number) => {
    const trimmed = editingCaptionText.trim();
    if (!trimmed) return;

    romanticAudio.playConfettiPop();
    setLocalPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption: trimmed } : p))
    );
    onUpdateCaption?.(photoId, trimmed);

    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto((prev) => (prev ? { ...prev, caption: trimmed } : null));
    }

    setEditingPhotoId(null);
    setEditingCaptionText('');
    setSavedNotification('Caption kenangan berhasil disimpan! ✨');
    setTimeout(() => setSavedNotification(null), 2500);
  };

  const handleStartModalEditCaption = () => {
    if (!selectedPhoto) return;
    romanticAudio.playButtonClick();
    setModalCaptionInput(selectedPhoto.caption);
    setIsModalEditingCaption(true);
  };

  const handleCancelModalEditCaption = () => {
    romanticAudio.playButtonClick();
    setIsModalEditingCaption(false);
    setModalCaptionInput('');
  };

  const handleSaveModalCaption = () => {
    if (!selectedPhoto) return;
    const trimmed = modalCaptionInput.trim();
    if (!trimmed) return;

    romanticAudio.playConfettiPop();
    const photoId = selectedPhoto.id;
    setLocalPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption: trimmed } : p))
    );
    setSelectedPhoto((prev) => (prev ? { ...prev, caption: trimmed } : null));
    onUpdateCaption?.(photoId, trimmed);

    setIsModalEditingCaption(false);
    setModalCaptionInput('');
    setSavedNotification('Caption kenangan berhasil disimpan! ✨');
    setTimeout(() => setSavedNotification(null), 2500);
  };

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

  // Dedicated Web Share API handler with pre-filled romantic message
  const handleWebShare = async (e: React.MouseEvent) => {
    romanticAudio.playButtonClick();
    triggerFloatingHearts(e.clientX, e.clientY);
    const url = window.location.href;

    const shareData = {
      title: 'ForeverCard 1 Year Anniversary 💕',
      text: 'Spesial 1 tahun perjalanan cinta kita berdua, buka kartu anniversary kita ya sayang 💕',
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        romanticAudio.playConfettiPop();
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: Copy pre-filled romantic message and link to clipboard
    try {
      const fullText = `${shareData.text}\n${shareData.url}`;
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = fullText;
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

  // Direct copy link to clipboard
  const handleCopyLink = async (e: React.MouseEvent) => {
    romanticAudio.playButtonClick();
    triggerFloatingHearts(e.clientX, e.clientY);
    const url = window.location.href;

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

  // Generate and download romantic scrapbook collage of all photos
  const handleDownloadCollage = async (e: React.MouseEvent) => {
    romanticAudio.playButtonClick();
    triggerFloatingHearts(e.clientX, e.clientY);
    setIsGeneratingCollage(true);

    try {
      const success = await downloadCollageImage(localPhotos, daysTogether);
      if (success) {
        setIsCollageDownloaded(true);
        romanticAudio.playConfettiPop();
        triggerIntenseConfettiRain();
        setTimeout(() => setIsCollageDownloaded(false), 3800);
      }
    } catch (err) {
      console.error('Failed to generate collage', err);
    } finally {
      setIsGeneratingCollage(false);
    }
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
    ? localPhotos.filter((p) => p.milestoneId === activeMilestoneId)
    : localPhotos;

  return (
    <div className="relative min-h-[90vh] max-w-6xl mx-auto px-4 py-10">
      {/* Toast notification when caption is saved */}
      {savedNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Background gallery wrapper: smoothly blurs when adding or viewing a photo */}
      <div
        className={`transition-all duration-300 ${
          selectedPhoto !== null || isCameraModalOpen
            ? 'filter blur-[6px] opacity-60 scale-[0.995] pointer-events-none select-none'
            : ''
        }`}
      >
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
            {/* Toggle Edit Mode Button */}
            <button
              id="gallery-toggle-edit-mode-top-button"
              onClick={handleToggleEditMode}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isEditMode
                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                  : 'bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 shadow-xs hover:shadow-md'
              }`}
              title="Edit caption foto kenangan"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Selesai Edit ✨' : 'Mode Edit Caption ✏️'}</span>
            </button>

            <button
              id="gallery-share-card-button"
              onClick={handleWebShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              title="Bagikan Kartu Anniversary"
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
                Show All ({localPhotos.length})
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

      {/* Edit Mode Active Banner */}
      {isEditMode && (
        <div className="mb-6 card-glass p-3.5 px-4 rounded-2xl border-2 border-amber-200 bg-amber-50/85 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <span className="p-1.5 rounded-full bg-amber-200 text-amber-800 shrink-0">
              <Pencil className="w-4 h-4" />
            </span>
            <span className="font-semibold">
              Mode Edit Aktif! Klik caption atau ikon pensil pada kartu foto untuk memperbarui ceritanya langsung.
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleEditMode}
            className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-xs"
          >
            Selesai Edit ✨
          </button>
        </div>
      )}

      {/* Polaroid-style Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {displayedPhotos.map((photo) => {
          const rotationDegree = photo.rotation || 0;
          const photoFilterCss = PHOTO_FILTERS.find((f) => f.id === photo.filter)?.cssFilter || 'none';
          const activeFilterInfo = PHOTO_FILTERS.find((f) => f.id === photo.filter && f.id !== 'none');
          const isThisPhotoEditing = editingPhotoId === photo.id;

          return (
            <div
              key={photo.id}
              onClick={() => {
                if (isThisPhotoEditing) return;
                if (isEditMode) {
                  handleStartEditCaption(photo);
                  return;
                }
                triggerIntenseConfettiRain();
                setSelectedPhoto(photo);
              }}
              style={{
                transform: isThisPhotoEditing ? 'none' : `rotate(${rotationDegree}deg)`,
              }}
              className={`group relative bg-white p-3.5 pb-5 rounded-lg shadow-md hover:shadow-2xl border transition-all duration-300 flex flex-col ${
                isThisPhotoEditing
                  ? 'border-rose-400 ring-2 ring-rose-300 scale-[1.02] z-20 shadow-xl'
                  : isEditMode
                  ? 'border-amber-300 hover:border-rose-400 hover:scale-[1.02] cursor-pointer'
                  : 'border-stone-200/60 hover:scale-[1.03] hover:rotate-0 cursor-pointer'
              }`}
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
                {!isThisPhotoEditing && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[11px] text-white font-semibold flex items-center gap-1 drop-shadow-md">
                      {isEditMode ? (
                        <>
                          <Pencil className="w-3 h-3 text-amber-300" /> Klik untuk Edit Caption
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-300" /> Tap for Confetti Rain!
                        </>
                      )}
                    </span>
                  </div>
                )}

                {/* Filter tag if custom filter is applied */}
                {activeFilterInfo && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                    <span>{activeFilterInfo.icon}</span>
                    <span>{activeFilterInfo.label.split(' ')[0]}</span>
                  </div>
                )}

                {/* Edit Caption Quick Pencil on photo card */}
                {!isThisPhotoEditing && (
                  <button
                    id={`gallery-photo-edit-pencil-${photo.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEditCaption(photo);
                    }}
                    className={`absolute top-2 left-2 z-10 p-2 rounded-full bg-white/95 backdrop-blur-xs text-rose-700 shadow-md hover:bg-rose-500 hover:text-white transition-all cursor-pointer ${
                      isEditMode ? 'opacity-100 ring-2 ring-amber-300 scale-105' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    title="Edit caption foto ini"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Polaroid Bottom Note Area */}
              <div className="flex-1 flex flex-col justify-between px-1">
                {isThisPhotoEditing ? (
                  /* Inline Edit Caption Form right within polaroid card */
                  <div
                    className="w-full flex flex-col gap-2 py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                        <Pencil className="w-3 h-3" />
                        <span>Edit Caption Polaroid</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">Enter untuk simpan</span>
                    </div>
                    <textarea
                      id={`gallery-edit-caption-textarea-${photo.id}`}
                      value={editingCaptionText}
                      onChange={(e) => setEditingCaptionText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveCaption(photo.id);
                        } else if (e.key === 'Escape') {
                          handleCancelEditCaption();
                        }
                      }}
                      rows={2}
                      autoFocus
                      placeholder="Tulis caption kenangan di sini..."
                      className="w-full p-2.5 text-base sm:text-lg font-script text-stone-800 bg-rose-50/80 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white resize-none transition-all shadow-inner leading-relaxed"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        id={`gallery-cancel-caption-btn-${photo.id}`}
                        onClick={handleCancelEditCaption}
                        className="px-3 py-1 rounded-md text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        id={`gallery-save-caption-btn-${photo.id}`}
                        onClick={() => handleSaveCaption(photo.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-md text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-xs hover:shadow-md transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan 💾</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group/caption">
                    <p
                      onClick={(e) => {
                        if (isEditMode) {
                          e.stopPropagation();
                          handleStartEditCaption(photo);
                        }
                      }}
                      className={`font-script text-xl sm:text-2xl text-stone-800 leading-snug tracking-wide mb-2 transition-colors ${
                        isEditMode ? 'hover:text-rose-600 underline decoration-rose-300 decoration-wavy' : ''
                      }`}
                      title={isEditMode ? 'Klik untuk edit caption' : undefined}
                    >
                      {photo.caption}
                    </p>
                    {isEditMode && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold mb-1">
                        <Pencil className="w-2.5 h-2.5" /> Klik untuk edit teks
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-stone-400 font-medium pt-2 border-t border-stone-100 mt-auto">
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

      {/* Single Download Collage Button directly below photo grid (Replaces top banner with button from image) */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <button
          id="gallery-download-collage-button"
          onClick={handleDownloadCollage}
          disabled={isGeneratingCollage}
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60"
        >
          {isGeneratingCollage ? (
            <>
              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span>Merangkai Kolase... 🎨</span>
            </>
          ) : isCollageDownloaded ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Kolase Tersimpan! 💖</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-rose-500 group-hover:translate-y-0.5 transition-transform" />
              <span>Download Collage 🖼️</span>
            </>
          )}
        </button>
        <p className="text-xs text-stone-500 mt-2.5 font-medium">
          Simpan seluruh foto kenangan 1 tahun kita menjadi satu kolase polaroid langsung ke galeri HP kamu
        </p>
      </div>

      {/* Bottom Action Area: WhatsApp, Dedicated Web Share API Button, Copy Link, & Continue */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3.5 pb-8">
        <button
          id="gallery-bottom-whatsapp-button"
          onClick={handleShareWhatsApp}
          className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span>Kirim via WhatsApp 💬</span>
        </button>

        {/* Dedicated Web Share API Button with Pre-filled Romantic Message */}
        <button
          id="gallery-bottom-webshare-button"
          onClick={handleWebShare}
          className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          <span>Bagikan Kartu Romantis 💌</span>
        </button>

        <button
          id="gallery-bottom-copy-link-button"
          onClick={handleCopyLink}
          className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Link Tersalin! 💌</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-stone-500 group-hover:scale-110 transition-transform" />
              <span>Salin Link Kartu 📋</span>
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
      </div>

      {/* Expanded Polaroid Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
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

            {/* Caption Display / Inline Editor in Modal */}
            {isModalEditingCaption ? (
              <div className="mb-3 p-3 bg-rose-50/70 border border-rose-200 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Caption Kenangan</span>
                  </span>
                  <span className="text-[10px] text-stone-400">Enter untuk simpan</span>
                </div>
                <textarea
                  id="lightbox-modal-caption-textarea"
                  value={modalCaptionInput}
                  onChange={(e) => setModalCaptionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveModalCaption();
                    } else if (e.key === 'Escape') {
                      handleCancelModalEditCaption();
                    }
                  }}
                  rows={2}
                  autoFocus
                  className="w-full p-2.5 text-base sm:text-lg font-script text-stone-800 bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none shadow-xs"
                />
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleCancelModalEditCaption}
                    className="px-3 py-1 rounded-md text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModalCaption}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-md text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan 💾</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2 mb-2 group/modalcaption">
                <p className="font-script text-2xl sm:text-3xl text-stone-800 leading-relaxed flex-1">
                  &ldquo;{selectedPhoto.caption}&rdquo;
                </p>
                <button
                  id="lightbox-modal-edit-caption-button"
                  type="button"
                  onClick={handleStartModalEditCaption}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer shrink-0"
                  title="Edit caption foto ini"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}

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
