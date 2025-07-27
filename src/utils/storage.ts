import { PomodoroSettings, PomodoroStats } from '../types/pomodoro';

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusTime: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
  soundEnabled: true,
  notificationsEnabled: false,
  autoStartBreaks: true,
  autoStartPomodoros: true,
  darkMode: false,
};

const DEFAULT_STATS: PomodoroStats = {
  todayPomodoros: 0,
  completedCycles: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalPomodoros: 0,
  lastSessionDate: new Date().toDateString(),
};

export const getSettings = (): PomodoroSettings => {
  try {
    const stored = localStorage.getItem('pomodoro-settings');
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: PomodoroSettings): void => {
  localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
};

export const getStats = (): PomodoroStats => {
  try {
    const stored = localStorage.getItem('pomodoro-stats');
    const stats = stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : DEFAULT_STATS;
    
    // Reset daily stats if it's a new day
    const today = new Date().toDateString();
    if (stats.lastSessionDate !== today) {
      stats.todayPomodoros = 0;
      stats.lastSessionDate = today;
    }
    
    return stats;
  } catch {
    return DEFAULT_STATS;
  }
};

export const saveStats = (stats: PomodoroStats): void => {
  localStorage.setItem('pomodoro-stats', JSON.stringify(stats));
};

export const updateStats = (completedPhase: 'focus' | 'shortBreak' | 'longBreak'): PomodoroStats => {
  if (completedPhase !== 'focus') {
    return getStats(); // Only update stats for completed focus sessions
  }

  const stats = getStats();
  const today = new Date().toDateString();
  
  // Update pomodoro counts
  stats.todayPomodoros += 1;
  stats.totalPomodoros += 1;
  
  // Update cycle count if we completed a set of 4
  if (stats.todayPomodoros % 4 === 0) {
    stats.completedCycles += 1;
  }
  
  // Update streaks
  if (stats.lastSessionDate === today) {
    stats.currentStreak += 1;
  } else {
    stats.currentStreak = 1;
  }
  
  stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
  stats.lastSessionDate = today;
  
  saveStats(stats);
  return stats;
};