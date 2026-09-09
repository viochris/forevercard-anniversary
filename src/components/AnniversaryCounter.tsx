import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Clock, Calendar } from 'lucide-react';

interface AnniversaryCounterProps {
  recipientName: string;
  daysTogether?: number; // default 365
  anniversaryDate?: string; // YYYY-MM-DD
  variant?: 'cover' | 'badge' | 'timeline';
}

export const AnniversaryCounter: React.FC<AnniversaryCounterProps> = ({
  recipientName,
  daysTogether = 365,
  anniversaryDate = 'September 28',
  variant = 'cover',
}) => {
  // Always maintain the exact 1-Year (365 days) anniversary count requested
  const calculatedDays = daysTogether;

  if (variant === 'badge' || variant === 'timeline') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 border border-rose-300/60 shadow-xs backdrop-blur-xs">
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
        <span className="font-serif-display font-bold text-xs sm:text-sm text-stone-800 tracking-wide">
          1 Year &bull; {calculatedDays} Days Together
        </span>
        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col items-center">
      {/* Golden celebratory ribbon badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border border-amber-300/80 text-rose-800 shadow-xs mb-3.5 animate-pulse-glow">
        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
        <span className="text-xs sm:text-sm font-bold tracking-tight">
          🥂 1 Year &bull; {calculatedDays} Days of Loving You
        </span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
      </div>

      {/* 4 Stat Breakdown Cards */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xs mx-auto w-full">
        {/* Days */}
        <div className="flex flex-col items-center bg-white/95 border border-rose-200/90 rounded-2xl px-2 py-2.5 shadow-xs backdrop-blur-xs">
          <span className="font-serif-display text-xl sm:text-2xl font-bold text-rose-600 leading-none">
            {calculatedDays}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mt-1">
            Days
          </span>
        </div>

        {/* Months */}
        <div className="flex flex-col items-center bg-white/95 border border-rose-200/90 rounded-2xl px-2 py-2.5 shadow-xs backdrop-blur-xs">
          <span className="font-serif-display text-xl sm:text-2xl font-bold text-stone-800 leading-none">
            12
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mt-1">
            Months
          </span>
        </div>

        {/* Weeks */}
        <div className="flex flex-col items-center bg-white/95 border border-rose-200/90 rounded-2xl px-2 py-2.5 shadow-xs backdrop-blur-xs">
          <span className="font-serif-display text-xl sm:text-2xl font-bold text-stone-800 leading-none">
            52
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mt-1">
            Weeks
          </span>
        </div>

        {/* Hours / Moments */}
        <div className="flex flex-col items-center bg-white/95 border border-rose-200/90 rounded-2xl px-2 py-2.5 shadow-xs backdrop-blur-xs">
          <span className="font-serif-display text-xl sm:text-2xl font-bold text-rose-500 leading-none">
            8,760
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mt-1">
            Hours
          </span>
        </div>
      </div>

      <p className="text-[11px] text-stone-400 font-medium mt-2 flex items-center gap-1">
        <Clock className="w-3 h-3 text-rose-400" />
        Every second cherished with {recipientName}
      </p>
    </div>
  );
};

// Re-export as CountdownTimer for backward compatibility
export const CountdownTimer = AnniversaryCounter;
