import React from 'react';

interface ProgressProps {
  cyclePosition: number;
  currentPhase: 'focus' | 'shortBreak' | 'longBreak';
}

export const Progress: React.FC<ProgressProps> = ({ cyclePosition, currentPhase }) => {
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">Cycle Progress:</span>
      {[0, 1, 2, 3].map((position) => (
        <div
          key={position}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            position < cyclePosition
              ? 'bg-indigo-500 shadow-sm'
              : position === cyclePosition && currentPhase === 'focus'
              ? 'bg-indigo-400 ring-2 ring-indigo-200 animate-pulse'
              : 'bg-slate-200 dark:bg-slate-600'
          }`}
          title={`Pomodoro ${position + 1} ${
            position < cyclePosition
              ? '(completed)'
              : position === cyclePosition
              ? '(current)'
              : '(pending)'
          }`}
        />
      ))}
    </div>
  );
};