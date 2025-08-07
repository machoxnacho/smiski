import React, { useEffect, useState } from 'react';
import Timer from './Timer';
import Menu from './Menu';

const App: React.FC = () => {
  const [coins, setCoins] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');

  // Generate userId and fetch coins
  useEffect(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = crypto.randomUUID(); // or use Date.now().toString()
      localStorage.setItem('userId', id);
    }
    setUserId(id);

    const fetchCoins = async () => {
      try {
        const res = await fetch(`/api/coins?userId=${id}`);
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
