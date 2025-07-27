import React, { useEffect, useState } from 'react';

interface CelebrationProps {
  show: boolean;
}

const confettiColors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

const Confetti: React.FC<{ delay: number }> = ({ delay }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const startX = Math.random() * 100;
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    
    setStyle({
      left: `${startX}%`,
      backgroundColor: color,
      animationDelay: `${delay}ms`,
      animationDuration: `${2000 + Math.random() * 1000}ms`,
    });
  }, [delay]);

  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-bounce opacity-80"
      style={{
        ...style,
        animation: 'confetti-fall 3s ease-out forwards',
      }}
    />
  );
};

export const Celebration: React.FC<CelebrationProps> = ({ show }) => {
  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {Array.from({ length: 50 }, (_, i) => (
          <Confetti key={i} delay={i * 50} />
        ))}
      </div>

      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl animate-pulse">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Cycle Complete!
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Amazing work! You've completed a full Pomodoro cycle.
          </p>
        </div>
      </div>
    </>
  );
};