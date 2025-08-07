import React, { useState, useEffect } from 'react';

type TimerMode = 'pomodoro' | 'break';

interface Props {
  onCoinsEarned: (newTotal: number) => void;
  userId: string;
}

const Timer: React.FC<Props> = ({ onCoinsEarned, userId }) => {
  const pomodoroDuration = 25;
  const breakDuration = 5;

  const [seconds, setSeconds] = useState(pomodoroDuration);
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('pomodoro');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const handleEnd = async () => {
      if (mode === 'pomodoro') {
        await earnCoins(5);
        setMode('break');
        setSeconds(breakDuration);
        setActive(false);
      } else {
        setMode('pomodoro');
        setSeconds(pomodoroDuration);
        setActive(false);
      }
    };

    if (active && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (active && seconds === 0) {
      handleEnd();
    }

    return () => clearInterval(interval);
  }, [active, seconds, mode]);

  const earnCoins = async (amount: number) => {
    try {
      const res = await fetch('/api/add-coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, userId })
      });
      const data = await res.json();
      onCoinsEarned(data.coins);
    } catch (err) {
      console.error('Failed to add coins:', err);
    }
  };

  const startTimer = () => setActive(true);
  const pauseTimer = () => setActive(false);
  const stopTimer = () => {
    setActive(false);
    setSeconds(mode === 'pomodoro' ? pomodoroDuration : breakDuration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div>
      <h2>{mode === 'pomodoro' ? 'Pomodoro Time' : 'Break Time'}</h2>
      <h3>{formatTime(seconds)}</h3>
      {!active && <button onClick={startTimer}>Start</button>}
      {active && (
        <>
          <button onClick={pauseTimer}>Pause</button>
          <button onClick={stopTimer}>Stop</button>
        </>
      )}
    </div>
  );
};

export default Timer;
