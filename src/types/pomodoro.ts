export interface PomodoroSettings {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  darkMode: boolean;
}

export interface PomodoroStats {
  todayPomodoros: number;
  completedCycles: number;
  currentStreak: number;
  longestStreak: number;
  totalPomodoros: number;
  lastSessionDate: string;
}

export type TimerPhase = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroState {
  isRunning: boolean;
  timeLeft: number;
  currentPhase: TimerPhase;
  cyclePosition: number; // 0-3 for current position in 4-pomodoro cycle
  completedPomodoros: number;
}