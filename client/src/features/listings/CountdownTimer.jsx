import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer = ({ targetDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    if (difference <= 0) {
      return { expired: true, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      expired: false,
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining.expired && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
        <Clock className="w-3.5 h-3.5" />
        Expiré
      </span>
    );
  }

  // Couleurs selon l'urgence (< 1h : rouge/orange urgent, sinon vert/neutre)
  const isUrgent = timeLeft.hours < 1;
  const isWarning = timeLeft.hours < 3;

  const colorClass = isUrgent
    ? 'text-rose-700 bg-rose-50 border-rose-200'
    : isWarning
    ? 'text-amber-800 bg-amber-50 border-amber-200'
    : 'text-stone-700 bg-stone-50 border-stone-200';

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${colorClass}`}
    >
      <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'animate-spin' : ''}`} />
      <span>
        {timeLeft.hours > 0 && `${timeLeft.hours}h `}
        {String(timeLeft.minutes).padStart(2, '0')}m{' '}
        {timeLeft.hours === 0 && `${String(timeLeft.seconds).padStart(2, '0')}s`}
      </span>
    </span>
  );
};
