import React, { useEffect } from 'react';
import { IconStar } from '@tabler/icons-react';

interface PointsNotificationProps {
  points: number;
  message?: string;
  onClose?: () => void;
  duration?: number; // milliseconds
  position?: 'top' | 'bottom' | 'center';
}

const PointsNotification: React.FC<PointsNotificationProps> = ({
  points,
  message = `You earned ${points} points!`,
  onClose,
  duration = 3000,
  position = 'top',
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`points-notification ${position}`}>
      <div className="notification-content">
        <IconStar size={24} className="notification-icon" />
        <div className="notification-text">
          <p className="notification-message">{message}</p>
          <p className="notification-points">+{points} points</p>
        </div>
      </div>
    </div>
  );
};

export default PointsNotification;
