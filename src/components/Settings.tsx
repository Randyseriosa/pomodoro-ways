import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Bell, Volume2, Moon, Sun } from 'lucide-react';
import { PomodoroSettings } from '../types/pomodoro';
import { requestNotificationPermission } from '../utils/notifications';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const permission = await requestNotificationPermission();
      if (!permission) {
        alert('Notifications were denied. Please enable them in your browser settings.');
        return;
      }
    }
    setLocalSettings(prev => ({ ...prev, notificationsEnabled: enabled }));
  };

  const formatTime = (seconds: number) => Math.floor(seconds / 60);
  const parseTime = (minutes: number) => minutes * 60;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Timer Durations */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Timer Durations
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Focus Time (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formatTime(localSettings.focusTime)}
                  onChange={(e) =>
                    setLocalSettings(prev => ({
                      ...prev,
                      focusTime: parseTime(parseInt(e.target.value) || 25),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formatTime(localSettings.shortBreak)}
                  onChange={(e) =>
                    setLocalSettings(prev => ({
                      ...prev,
                      shortBreak: parseTime(parseInt(e.target.value) || 5),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Long Break (15-30 minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  max="30"
                  value={formatTime(localSettings.longBreak)}
                  onChange={(e) =>
                    setLocalSettings(prev => ({
                      ...prev,
                      longBreak: parseTime(Math.max(15, Math.min(30, parseInt(e.target.value) || 15))),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notifications & Sounds */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Notifications & Sounds
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Sound Alerts
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) =>
                    setLocalSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Browser Notifications
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.notificationsEnabled}
                  onChange={(e) => handleNotificationToggle(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Auto-start Options */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Auto-start Options
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Auto-start breaks
                </span>
                <input
                  type="checkbox"
                  checked={localSettings.autoStartBreaks}
                  onChange={(e) =>
                    setLocalSettings(prev => ({ ...prev, autoStartBreaks: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Auto-start pomodoros
                </span>
                <input
                  type="checkbox"
                  checked={localSettings.autoStartPomodoros}
                  onChange={(e) =>
                    setLocalSettings(prev => ({ ...prev, autoStartPomodoros: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Theme */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Appearance
            </h3>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {localSettings.darkMode ? (
                  <Moon className="w-4 h-4 text-slate-500" />
                ) : (
                  <Sun className="w-4 h-4 text-slate-500" />
                )}
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Dark Mode
                </span>
              </div>
              <input
                type="checkbox"
                checked={localSettings.darkMode}
                onChange={(e) =>
                  setLocalSettings(prev => ({ ...prev, darkMode: e.target.checked }))
                }
                className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-4 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};