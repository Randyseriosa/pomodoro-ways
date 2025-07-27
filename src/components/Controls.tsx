import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  currentPhase: 'focus' | 'shortBreak' | 'longBreak';
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
  currentPhase,
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onReset}
        className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        title="Reset timer (R)"
        aria-label="Reset timer"
      >
        <RotateCcw className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>

      <button
        onClick={isRunning ? onPause : onStart}
        className="p-4 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
        title={isRunning ? 'Pause timer (Space)' : 'Start timer (Space)'}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6 ml-0.5" />
        )}
      </button>

      <button
        onClick={onSkip}
        className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        title={`Skip to ${currentPhase === 'focus' ? 'break' : 'focus'}`}
        aria-label={`Skip to ${currentPhase === 'focus' ? 'break' : 'focus'}`}
      >
        <SkipForward className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>
    </div>
  );
};