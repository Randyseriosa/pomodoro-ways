import { useState, useEffect, useCallback, useRef } from 'react';
import { PomodoroState, TimerPhase, PomodoroSettings, PomodoroStats } from '../types/pomodoro';
import { getSettings, updateStats, getStats } from '../utils/storage';
import { showNotification, getNotificationMessage } from '../utils/notifications';
import { soundManager } from '../utils/sounds';

export const usePomodoro = (settings: PomodoroSettings) => {
  const [state, setState] = useState<PomodoroState>({
    isRunning: false,
    timeLeft: settings.focusTime,
    currentPhase: 'focus',
    cyclePosition: 0,
    completedPomodoros: 0,
  });

  const [stats, setStats] = useState<PomodoroStats>(getStats());
  const [showCelebration, setShowCelebration] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getPhaseTime = useCallback((phase: TimerPhase): number => {
    switch (phase) {
      case 'focus':
        return settings.focusTime;
      case 'shortBreak':
        return settings.shortBreak;
      case 'longBreak':
        return settings.longBreak;
    }
  }, [settings]);

  const getNextPhase = useCallback((currentPhase: TimerPhase, cyclePosition: number): TimerPhase => {
    if (currentPhase === 'focus') {
      // After 4th pomodoro (position 3), take long break
      return cyclePosition === 3 ? 'longBreak' : 'shortBreak';
    }
    return 'focus';
  }, []);

  const completePhase = useCallback(() => {
    setState(prevState => {
      const { currentPhase, cyclePosition } = prevState;
      let newCyclePosition = cyclePosition;
      let newCompletedPomodoros = prevState.completedPomodoros;

      // Update stats and cycle position if focus phase completed
      if (currentPhase === 'focus') {
        newCompletedPomodoros += 1;
        newCyclePosition = (cyclePosition + 1) % 4;
        
        // Update persistent stats
        const newStats = updateStats('focus');
        setStats(newStats);

        // Show celebration if cycle completed
        if (newCyclePosition === 0) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
          if (settings.soundEnabled) {
            soundManager.playSuccessSound();
          }
        }
      }

      const nextPhase = getNextPhase(currentPhase, cyclePosition);
      const nextTime = getPhaseTime(nextPhase);

      // Show notification
      if (settings.notificationsEnabled) {
        const notification = getNotificationMessage(nextPhase);
        showNotification(notification.title, notification.body);
      }

      // Play sound
      if (settings.soundEnabled) {
        soundManager.playNotificationSound(nextPhase === 'focus' ? 'focus' : 'break');
      }

      const shouldAutoStart = 
        (nextPhase === 'focus' && settings.autoStartPomodoros) ||
        (nextPhase !== 'focus' && settings.autoStartBreaks);

      return {
        isRunning: shouldAutoStart,
        timeLeft: nextTime,
        currentPhase: nextPhase,
        cyclePosition: newCyclePosition,
        completedPomodoros: newCompletedPomodoros,
      };
    });
  }, [settings, getNextPhase, getPhaseTime]);

  const tick = useCallback(() => {
    setState(prevState => {
      if (!prevState.isRunning) return prevState;

      if (prevState.timeLeft <= 1) {
        completePhase();
        return prevState;
      }

      return {
        ...prevState,
        timeLeft: prevState.timeLeft - 1,
      };
    });
  }, [completePhase]);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, tick]);

  const startTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: getPhaseTime(prev.currentPhase),
    }));
  }, [getPhaseTime]);

  const skipToNext = useCallback(() => {
    completePhase();
  }, [completePhase]);

  const resetCycle = useCallback(() => {
    setState({
      isRunning: false,
      timeLeft: settings.focusTime,
      currentPhase: 'focus',
      cyclePosition: 0,
      completedPomodoros: 0,
    });
  }, [settings.focusTime]);

  // Update timer when settings change
  useEffect(() => {
    if (!state.isRunning) {
      setState(prev => ({
        ...prev,
        timeLeft: getPhaseTime(prev.currentPhase),
      }));
    }
  }, [settings, getPhaseTime, state.isRunning]);

  return {
    state,
    stats,
    showCelebration,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToNext,
    resetCycle,
  };
};