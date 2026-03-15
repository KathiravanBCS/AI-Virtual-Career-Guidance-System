import React, { createContext, useCallback, useState } from 'react';

export interface PointsNotification {
  id: string;
  points: number;
  message: string;
  timestamp: number;
}

interface NotificationContextType {
  notifications: PointsNotification[];
  showNotification: (points: number, message?: string) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<PointsNotification[]>([]);

  const showNotification = useCallback((points: number, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newNotification: PointsNotification = {
      id,
      points,
      message: message || `You earned ${points} points!`,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
