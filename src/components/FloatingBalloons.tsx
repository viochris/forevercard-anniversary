import React, { useMemo } from 'react';

interface Balloon {
  id: number;
  left: number;
  size: number;
  color: string;
  highlight: string;
  delay: number;
  duration: number;
  swayAmount: number;
}

export const FloatingBalloons: React.FC = () => {
  const balloons = useMemo<Balloon[]>(() => {
    const colors = [
      { base: '#fb7185', light: '#fda4af' }, // Rose pink
      { base: '#f43f5e', light: '#fbcfe8' }, // Romantic rose
      { base: '#c084fc', light: '#e9d5ff' }, // Soft lavender
      { base: '#f59e0b', light: '#fef08a' }, // Warm gold
      { base: '#f472b6', light: '#fce7f3' }, // Pastel pink
      { base: '#fb923c', light: '#fed7aa' }, // Peach
    ];

    const list: Balloon[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const col = colors[i % colors.length];
      list.push({
        id: i,
        left: 4 + (i * 92) / count + (Math.random() * 4 - 2), // Distributed nicely across width
        size: Math.floor(Math.random() * 16) + 48, // 48px to 64px width
        color: col.base,
        highlight: col.light,
        delay: Math.random() * 4,
        duration: Math.random() * 4 + 8, // 8s to 12s float duration
        swayAmount: Math.random() * 25 + 15,
      });
    }
    return list;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.left}%`,
            bottom: '-120px',
            animation: `floatUpward ${b.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
            animationDelay: `${b.delay}s`,
            opacity: 0.88,
          }}
        >
          {/* Balloon Body with 3D spherical lighting */}
          <div
            style={{
              width: `${b.size}px`,
              height: `${b.size * 1.25}px`,
              borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
              background: `radial-gradient(circle at 35% 28%, ${b.highlight} 0%, ${b.color} 65%, rgba(0,0,0,0.15) 100%)`,
              boxShadow: `inset -2px -4px 8px rgba(0,0,0,0.15), 0 8px 20px -4px rgba(244, 63, 94, 0.3)`,
            }}
            className="relative flex flex-col items-center select-none transform hover:scale-105 transition-transform"
          >
            {/* Balloon knot at bottom */}
            <div
              style={{
                width: `${Math.max(6, b.size * 0.14)}px`,
                height: `${Math.max(5, b.size * 0.12)}px`,
                backgroundColor: b.color,
                bottom: `-${Math.max(4, b.size * 0.1)}px`,
              }}
              className="absolute rounded-xs shadow-xs"
            />

            {/* Wavy hanging string */}
            <svg
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 overflow-visible pointer-events-none"
              width="14"
              height="65"
              viewBox="0 0 14 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 0 C 12 15, 2 30, 8 45 C 12 55, 6 62, 7 65"
                stroke="rgba(168, 85, 247, 0.45)"
                strokeWidth="1.2"
                strokeDasharray="2 1"
                fill="none"
              />
            </svg>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes floatUpward {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(calc(-100vh - 200px)) translateX(20px) rotate(8deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
