import React from 'react';
import { Target, Trophy, Zap, Calendar } from 'lucide-react';
import { PomodoroStats } from '../types/pomodoro';

interface StatsProps {
  stats: PomodoroStats;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  const statItems = [
    {
      icon: Target,
      label: "Today's Pomodoros",
      value: stats.todayPomodoros,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      icon: Trophy,
      label: 'Completed Cycles',
      value: stats.completedCycles,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: Zap,
      label: 'Current Streak',
      value: stats.currentStreak,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: Calendar,
      label: 'Total Sessions',
      value: stats.totalPomodoros,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="mt-12">
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6 text-center">
        Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} rounded-xl p-4 text-center transition-transform hover:scale-105`}
          >
            <div className={`inline-flex p-2 rounded-lg ${item.color} mb-2`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {item.value}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};