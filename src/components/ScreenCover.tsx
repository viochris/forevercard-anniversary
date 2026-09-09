import React from 'react';
import { Mail, Sparkles, Heart } from 'lucide-react';
import { CardData } from '../types';
import { AnniversaryCounter } from './AnniversaryCounter';

interface ScreenCoverProps {
  cardData: CardData;
  onOpen: () => void;
}

export const ScreenCover: React.FC<ScreenCoverProps> = ({ cardData, onOpen }) => {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-12">
      {/* Decorative center romantic card / envelope */}
      <div className="relative z-10 max-w-xl w-full mx-auto">
        {/* Soft aura glow behind the envelope */}
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-300/40 via-rose-200/40 to-purple-300/40 rounded-3xl blur-2xl opacity-70 animate-pulse-glow pointer-events-none" />

        <div className="relative card-glass rounded-3xl p-6 sm:p-10 shadow-xl border border-rose-100/80">
          {/* Subtle floating wax seal / heart motif */}
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-300/50 border-4 border-white animate-float-slow">
            <div className="relative flex items-center justify-center">
              <Mail className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
              <Heart className="w-5 h-5 text-rose-200 fill-rose-100 absolute -top-1 -right-2 animate-pulse" />
            </div>
          </div>

          {/* Main Title - strictly on 1 straight line */}
          <h1 className="font-serif-display text-2xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight text-gradient-rose mb-3 whitespace-nowrap">
            {cardData.coverTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-stone-600 font-medium max-w-md mx-auto mb-6 leading-relaxed">
            {cardData.coverSubtitle}
          </p>

          {/* Recipient tag pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/70 text-rose-700 text-sm font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Celebrating 1 Year with {cardData.recipientName}</span>
          </div>

          {/* Elegant 1-Year Anniversary Counter & Badge */}
          <AnniversaryCounter
            recipientName={cardData.recipientName}
            daysTogether={cardData.daysTogether || 365}
            anniversaryDate={cardData.anniversaryDate}
          />

          {/* Open Button with pulse / glow effect */}
          <div>
            <button
              id="cover-open-button"
              onClick={onOpen}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-400/40 hover:shadow-rose-500/60 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

              <span className="tracking-wide">Relive Our Year Together</span>
              <Heart className="w-5 h-5 text-rose-100 fill-white group-hover:scale-125 transition-transform" />
            </button>
          </div>

          {/* Bottom gentle reminder */}
          <p className="mt-6 text-xs text-rose-400 font-medium">
            Turn up your volume for the best experience 🎶
          </p>
        </div>
      </div>
    </div>
  );
};

