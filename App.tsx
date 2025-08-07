import React, { useEffect, useState } from 'react';
import Timer from './Timer';
import Menu from './Menu';

// Fallback UUID generator
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const App: React.FC = () => {
  const [coins, setCoins] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');

  // Generate userId and fetch coins
  useEffect(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = generateUUID(); // Use fallback instead of crypto.randomUUID()
      localStorage.setItem('userId', id);
    }
    setUserId(id);

    const fetchCoins = async () => {
      try {
        const res = await fetch(`http://smiski-alb-1737510671.us-east-1.elb.amazonaws.com/api/coins?userId=${id}`);
        const data = await res.json();
        setCoins(data.coins);
      } catch (err) {
        console.error('Failed to fetch coins:', err);
      }
    };

    fetchCoins();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Smiski Pomodoro</h1>
      <p><strong>Total Coins:</strong> {coins}</p>
      <Timer onCoinsEarned={setCoins} userId={userId} />
      <Menu />
    </div>
  );
};

export default App;
