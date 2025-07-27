export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showNotification = (title: string, body: string, icon?: string): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/vite.svg',
      badge: '/vite.svg',
    });
  }
};

export const getNotificationMessage = (phase: 'focus' | 'shortBreak' | 'longBreak'): { title: string; body: string } => {
  switch (phase) {
    case 'focus':
      return {
        title: 'Focus Time! 🍅',
        body: 'Time to concentrate and get things done!',
      };
    case 'shortBreak':
      return {
        title: 'Short Break 🌱',
        body: 'Take a few minutes to relax and recharge.',
      };
    case 'longBreak':
      return {
        title: 'Long Break 🎉',
        body: 'Great job! You\'ve completed a full cycle. Take a well-deserved break.',
      };
  }
};