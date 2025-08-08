import React, { useState } from 'react';
import Timer from './Timer';
import Menu from './Menu';

const App: React.FC = () => {
  // const [coins, setCoins] = useState<number>(0); // ⛔️ Remove or comment out
  const [userId] = useState<string>('dummy-user'); // still needed for Timer props

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Smiski Pomodoro</h1>
      {/* <p><strong>Total Coins:</strong> {coins}</p> */}
      <Timer onCoinsEarned={() => {}} userId={userId} />
      <Menu />
    </div>
  );
};

export default App;
