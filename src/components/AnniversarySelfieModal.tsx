import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Sparkles, Check, Upload, AlertCircle, Timer, SlidersHorizontal } from 'lucide-react';
import { PhotoItem } from '../types';
import { romanticAudio } from '../utils/audio';

export type PhotoFilterType = 'none' | 'vintage' | 'rose' | 'bw' | 'sepia';

export const PHOTO_FILTERS: { id: PhotoFilterType; label: string; icon: string; cssFilter: string }[] = [
  { id: 'none', label: 'Natural', icon: '✨', cssFilter: 'none' },
  { id: 'vintage', label: 'Vintage Warm', icon: '🎞️', cssFilter: 'sepia(0.38) contrast(1.1) saturate(1.15) brightness(1.02)' },
  { id: 'rose', label: 'Romantic Rose', icon: '🌸', cssFilter: 'contrast(1.05) brightness(1.05) saturate(1.25) hue-rotate(330deg)' },
  { id: 'bw', label: 'Classic B&W', icon: '🖤', cssFilter: 'grayscale(1) contrast(1.2) brightness(1.02)' },
  { id: 'sepia', label: 'Golden Sepia', icon: '📜', cssFilter: 'sepia(0.75) contrast(1.08) brightness(0.98)' },
];

interface AnniversarySelfieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSelfie: (newPhoto: PhotoItem) => void;
}

export const AnniversarySelfieModal: React.FC<AnniversarySelfieModalProps> = ({
  isOpen,
  onClose,
  onAddSelfie,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('1 Year Anniversary selfie with my favorite person! 📸💖');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilterType>('vintage');

  // Start camera when modal opens
  const startCamera = async (mode: 'user' | 'environment') => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access is restricted or not available. You can upload a photo instead!');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setCountdown(null);
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Handle taking picture with canvas
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front facing camera, mirror the image horizontally for natural selfie view
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    romanticAudio.playConfettiPop();
    stopCamera();
  };

  // 3-second countdown snap
  const handleStartCountdown = () => {
    if (isCapturing || countdown !== null) return;
    setIsCapturing(true);
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        romanticAudio.playQuizOptionSound();
      } else {
        clearInterval(interval);
        setCountdown(null);
        setIsCapturing(false);
        capturePhoto();
      }
    }, 900);
  };

  // Fallback photo upload via input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleConfirmAdd = () => {
    if (!capturedImage) return;

    const newPhoto: PhotoItem = {
      id: Date.now(),
      imageUrl: capturedImage,
      caption: caption.trim() || 'A radiant anniversary selfie! 📸💖',
      date: 'Today',
      location: 'Celebrated Together',
      milestoneId: 4,
      rotation: Math.random() * 3 - 1.5,
      filter: selectedFilter,
    };

    romanticAudio.playButtonClick();
    onAddSelfie(newPhoto);
    romanticAudio.playEasterEggChime();
    onClose();
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose-100 flex flex-col items-center animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg sm:text-xl font-bold text-stone-800">
                Anniversary Selfie 📸
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Add today&apos;s memory to our gallery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder or Captured Preview */}
        {!capturedImage ? (
          <div className="w-full flex flex-col items-center">
            <div className="relative aspect-4/3 w-full max-w-md rounded-2xl overflow-hidden bg-stone-900 shadow-inner flex items-center justify-center border-4 border-rose-100">
              {/* Live Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
              />

              {/* Decorative Viewfinder Overlay */}
              <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-2xl flex flex-col justify-between p-3">
                <div className="flex justify-between items-center text-white/80 text-xs font-semibold">
                  <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    REC
                  </span>
                  <span className="bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    ForeverCard Cam
                  </span>
                </div>

                {/* Center focus bracket */}
                <div className="self-center w-24 h-24 border border-white/40 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300 opacity-60 animate-pulse" />
                </div>

                <div className="text-center text-white/90 text-[11px] font-medium bg-black/40 py-1 px-3 rounded-full backdrop-blur-xs mx-auto">
                  Say cheese! Celebrating 1 year together ✨
                </div>
              </div>

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-20">
                  <span className="font-serif-display text-7xl sm:text-8xl font-bold text-white drop-shadow-lg animate-ping">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Camera Error Message with upload fallback */}
              {cameraError && (
                <div className="absolute inset-0 bg-stone-900/90 text-white p-6 flex flex-col items-center justify-center text-center z-30">
                  <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
                  <p className="text-xs sm:text-sm text-stone-300 mb-4">{cameraError}</p>
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md transition-all">
                    <Upload className="w-4 h-4" />
                    <span>Upload a Photo Instead</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Control Buttons */}
            <div className="mt-5 flex items-center justify-center gap-4 w-full">
              {/* Switch camera button */}
              <button
                type="button"
                onClick={toggleCamera}
                title="Switch Camera"
                className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Instant Snap Button */}
              <button
                type="button"
                id="anniversary-selfie-snap-button"
                onClick={capturePhoto}
                disabled={isCapturing || !!cameraError}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-200 hover:shadow-rose-400 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-5 h-5" />
                <span>Snap Selfie</span>
              </button>

              {/* 3-Second Timer Snap Button */}
              <button
                type="button"
                onClick={handleStartCountdown}
                disabled={isCapturing || !!cameraError}
                title="3-Second Timer"
                className="p-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
              >
                <Timer className="w-5 h-5" />
              </button>
            </div>

            {/* Or upload from library */}
            <div className="mt-3">
              <label className="text-xs font-semibold text-stone-500 hover:text-rose-600 cursor-pointer flex items-center gap-1.5 underline">
                <Upload className="w-3.5 h-3.5" />
                <span>Or select from photo library</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          /* Captured Photo Review & Caption Editing */
          <div className="w-full flex flex-col items-center">
            {/* Polaroid Preview */}
            <div className="bg-white p-3 pb-5 rounded-lg shadow-xl border border-stone-200 max-w-sm w-full mb-3">
              <div className="aspect-4/3 w-full rounded overflow-hidden mb-3 bg-stone-100">
                <img
                  src={capturedImage}
                  alt="Anniversary Selfie"
                  style={{
                    filter: PHOTO_FILTERS.find((f) => f.id === selectedFilter)?.cssFilter || 'none',
                  }}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>
              <p className="font-script text-xl sm:text-2xl text-stone-800 text-center leading-snug">
                {caption || 'A radiant anniversary selfie! 📸💖'}
              </p>
              <div className="text-[10px] text-stone-400 text-center uppercase tracking-wider font-semibold mt-1">
                Added Just Now &bull; Today &amp; Forever
              </div>
            </div>

            {/* Filter Toggle Selector */}
            <div className="w-full max-w-sm mb-3.5">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
                  Aesthetic Photo Filter
                </span>
                <span className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {PHOTO_FILTERS.find((f) => f.id === selectedFilter)?.label}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1 p-1 bg-stone-100/90 rounded-2xl border border-stone-200">
                {PHOTO_FILTERS.map((f) => {
                  const isActive = selectedFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        romanticAudio.playButtonClick();
                        setSelectedFilter(f.id);
                      }}
                      className={`flex flex-col items-center py-1.5 px-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-rose-600 shadow-sm border border-rose-300 scale-102 font-bold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                      }`}
                    >
                      <span className="text-sm leading-none mb-1">{f.icon}</span>
                      <span className="truncate max-w-[48px]">{f.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Edit Caption Input */}
            <div className="w-full max-w-sm mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                Custom Polaroid Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a sweet caption for this moment..."
                className="w-full px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm text-stone-800"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full max-w-sm">
              <button
                type="button"
                onClick={() => {
                  romanticAudio.playButtonClick();
                  handleRetake();
                }}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-semibold transition-colors cursor-pointer"
              >
                Retake
              </button>
              <button
                type="button"
                id="anniversary-selfie-confirm-button"
                onClick={handleConfirmAdd}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Pin to Gallery 💕</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
