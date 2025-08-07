import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(1500);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (active && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [active, seconds]);

  return (
    <div>
      <h2>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</h2>
      <button onClick={() => setActive(!active)}>
        {active ? 'Pause' : 'Start'}
      </button>
    </div>
  );
};

export default Timer;
