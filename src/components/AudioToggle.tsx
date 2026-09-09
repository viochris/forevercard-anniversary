import React, { useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

export const AudioToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(romanticAudio.getIsMuted());

  const handleToggle = () => {
    const nextMuted = romanticAudio.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      <button
        id="audio-toggle-button"
        onClick={handleToggle}
        aria-label={isMuted ? 'Play romantic music' : 'Mute music'}
        className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full border shadow-sm transition-all duration-300 backdrop-blur-md select-none text-xs sm:text-sm font-medium ${
          isMuted
            ? 'bg-white/80 border-rose-200 text-stone-600 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 hover:shadow-md'
            : 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-rose-200/50 shadow-md'
        }`}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="whitespace-nowrap font-medium">🔊 Play Our Song</span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-1 h-4 bg-white rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s]" />
              <span className="w-1 h-2.5 bg-white rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.4s]" />
            </div>
            <span className="whitespace-nowrap font-medium flex items-center gap-1">
              <Music className="w-3.5 h-3.5 inline animate-spin-slow" />
              Our Melody
            </span>
            <Volume2 className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </>
        )}
      </button>
    </div>
  );
};
