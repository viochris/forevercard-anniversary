import React, { useMemo } from 'react';

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  type: 'heart' | 'petal' | 'bokeh';
  opacity: number;
}

export const BackgroundParticles: React.FC = () => {
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 14 + 10,
        duration: Math.random() * 12 + 10,
        delay: Math.random() * -15,
        type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'petal' : 'bokeh',
        opacity: Math.random() * 0.4 + 0.15,
      });
    }
    return list;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft warm gradient mesh */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-100/60 via-pink-50/70 to-purple-100/50" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute top-2/3 left-1/3 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animation: `floatPetal ${p.duration}s infinite linear`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.type === 'heart' && (
            <span
              style={{ fontSize: `${p.size}px` }}
              className="inline-block text-rose-400 drop-shadow-sm filter"
            >
              ♥
            </span>
          )}
          {p.type === 'petal' && (
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size * 1.5}px`,
                borderRadius: '50% 0 50% 50%',
              }}
              className="bg-gradient-to-b from-rose-300 to-pink-200 rotate-45 transform drop-shadow-sm"
            />
          )}
          {p.type === 'bokeh' && (
            <div
              style={{
                width: `${p.size * 1.8}px`,
                height: `${p.size * 1.8}px`,
              }}
              className="rounded-full bg-gradient-to-tr from-pink-300/40 to-amber-200/40 blur-[1px]"
            />
          )}
        </div>
      ))}

      <style>{`
        @keyframes floatPetal {
          0% {
            transform: translateY(105vh) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(50vh) translateX(25px) rotate(180deg);
          }
          100% {
            transform: translateY(-10vh) translateX(-15px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
