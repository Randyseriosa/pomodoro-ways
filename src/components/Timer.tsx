import React from 'react';
import { TimerPhase } from '../types/pomodoro';

interface TimerProps {
  timeLeft: number;
  currentPhase: TimerPhase;
  isRunning: boolean;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const getPhaseLabel = (phase: TimerPhase): string => {
  switch (phase) {
    case 'focus':
      return 'Focus Time';
    case 'shortBreak':
      return 'Short Break';
    case 'longBreak':
      return 'Long Break';
  }
};

const getPhaseEmoji = (phase: TimerPhase): string => {
  switch (phase) {
    case 'focus':
      return '📖';
    case 'shortBreak':
      return '🌱';
    case 'longBreak':
      return '🎉';
  }
};

export const Timer: React.FC<TimerProps> = ({ timeLeft, currentPhase, isRunning }) => {
  return (
    <div className="text-center">
      <div className="mb-4">
        <span className="text-2xl mb-2 block">{getPhaseEmoji(currentPhase)}</span>
        <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300">
          {getPhaseLabel(currentPhase)}
        </h2>
      </div>
      
      <div className="relative mb-6">
        <div className="text-6xl md:text-7xl font-light text-slate-900 dark:text-slate-100 font-mono tracking-wider">
          {formatTime(timeLeft)}
        </div>
        {isRunning && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      <div className="text-sm text-slate-500 dark:text-slate-400">
        {isRunning ? 'Timer is running' : 'Timer is paused'}
      </div>
    </div>
  );
};