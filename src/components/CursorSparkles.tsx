import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  char: string;
  color: string;
  size: number;
}

export const CursorSparkles: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let lastTime = 0;
    const chars = ['✨', '💖', '🌸', '💫', '🤍'];
    const colors = ['#f43f5e', '#ec4899', '#f59e0b', '#d946ef'];

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      const now = Date.now();
      // Throttle particle creation to every ~50ms so it's subtle, performant, and silky smooth
      if (now - lastTime < 50) return;
      lastTime = now;

      const newSparkle: Sparkle = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        char: chars[Math.floor(Math.random() * chars.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 8) + 12,
      };

      setSparkles((prev) => [...prev.slice(-15), newSparkle]);

      window.setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 700);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute select-none transition-all duration-700 ease-out"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            fontSize: `${s.size}px`,
            color: s.color,
            transform: 'translate(-50%, -50%)',
            animation: 'sparkleFade 0.7s forwards ease-out',
          }}
        >
          {s.char}
        </span>
      ))}
      <style>{`
        @keyframes sparkleFade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.6) translateY(0);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.1) translateY(-10px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.4) translateY(-24px);
          }
        }
      `}</style>
    </div>
  );
};
