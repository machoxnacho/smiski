import React, { useEffect, useState, useRef } from 'react';

interface TimerProps {
  onCoinsEarned: () => void;
  userId: string;
}

const Timer: React.FC<TimerProps> = () => {
  const [secondsLeft, setSecondsLeft] = useState(25); // 25s work
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    setSecondsLeft(mode === 'work' ? 25 : 5);
    setIsRunning(false);
  };

  const switchMode = () => {
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setSecondsLeft(newMode === 'work' ? 25 : 5);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      switchMode(); // Auto-switch between work and break
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  return (
    <div>
      <h2>{mode === 'work' ? 'Work Timer' : 'Break Timer'}</h2>
      <h1>{`${Math.floor(secondsLeft / 60)
        .toString()
        .padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`}</h1>
      <button onClick={() => setIsRunning(true)} disabled={isRunning}>Start</button>
      <button onClick={() => setIsRunning(false)} disabled={!isRunning}>Pause</button>
      <button onClick={resetTimer}>Stop</button>
    </div>
  );
};

export default Timer;
