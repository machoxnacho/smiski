import React, { useState, useEffect } from 'react';

type TimerMode = 'pomodoro' | 'break';

const Timer: React.FC<{ onCoinsEarned: (amount: number) => void }> = ({ onCoinsEarned }) => {
  const pomodoroDuration = 25 * 60; // 25 mins
  const breakDuration = 5 * 60;     // 5 mins

  const [seconds, setSeconds] = useState(pomodoroDuration);
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('pomodoro');

  // Effect to handle countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (active && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (active && seconds === 0) {
      // Timer ended
      if (mode === 'pomodoro') {
        // Reward coins
        earnCoins(5);
        // Start break
        setMode('break');
        setSeconds(breakDuration);
        setActive(false); // Require user to manually start break
      } else {
        // End of break → reset to Pomodoro
        setMode('pomodoro');
        setSeconds(pomodoroDuration);
        setActive(false);
      }
    }

    return () => clearInterval(interval);
  }, [active, seconds, mode]);

  const earnCoins = async (amount: number) => {
    try {
      const res = await fetch('/api/add-coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
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

      {!active && (
        <button onClick={startTimer}>Start</button>
      )}
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
