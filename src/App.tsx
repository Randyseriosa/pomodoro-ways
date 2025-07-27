import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { Controls } from './components/Controls';
import { Progress } from './components/Progress';
import { Stats } from './components/Stats';
import { Settings } from './components/Settings';
import { Celebration } from './components/Celebration';
import { usePomodoro } from './hooks/usePomodoro';
import { getSettings, saveSettings } from './utils/storage';
import { PomodoroSettings } from './types/pomodoro';
import { SettingsIcon } from 'lucide-react';

function App() {
  const [settings, setSettings] = useState<PomodoroSettings>(getSettings());
  const [showSettings, setShowSettings] = useState(false);
  const { state, stats, showCelebration, startTimer, pauseTimer, resetTimer, skipToNext } = usePomodoro(settings);

  // Apply dark mode to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      
      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          state.isRunning ? pauseTimer() : startTimer();
          break;
        case 'r':
          event.preventDefault();
          resetTimer();
          break;
        case 's':
          event.preventDefault();
          skipToNext();
          break;
        case 'escape':
          if (showSettings) {
            setShowSettings(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.isRunning, startTimer, pauseTimer, resetTimer, skipToNext, showSettings]);

  const handleSettingsChange = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Update document title with timer
  useEffect(() => {
    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const phaseEmoji = state.currentPhase === 'focus' ? '🍅' : state.currentPhase === 'shortBreak' ? '🌱' : '🎉';
    document.title = `${phaseEmoji} ${formatTime(state.timeLeft)} - Pomodoro Timer`;
  }, [state.timeLeft, state.currentPhase]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      settings.darkMode 
        ? 'bg-slate-900' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl font-light text-slate-900 dark:text-slate-100 mb-2">
            Pomodoro Timer
          </h1>
          <p className="text-slate-700 dark:text-slate-400">
            Focus • Break • Repeat
          </p>
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-8 right-8 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
            title="Settings"
            aria-label="Open settings"
          >
            <SettingsIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </header>

        {/* Main Timer Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/20 p-8 md:p-12 mb-8">
          <Timer
            timeLeft={state.timeLeft}
            currentPhase={state.currentPhase}
            isRunning={state.isRunning}
          />

          <div className="mt-8">
            <Controls
              isRunning={state.isRunning}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onSkip={skipToNext}
              currentPhase={state.currentPhase}
            />
          </div>

          <Progress
            cyclePosition={state.cyclePosition}
            currentPhase={state.currentPhase}
          />
        </div>

        {/* Stats */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 p-8">
          <Stats stats={stats} />
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded mr-2">Space</span>
            Start/Pause
            <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded mx-2">R</span>
            Reset
            <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded mx-2">S</span>
            Skip
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      {/* Celebration Animation */}
      <Celebration show={showCelebration} />
    </div>
  );
}

export default App;