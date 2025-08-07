import React, { useEffect, useState } from 'react';
import Timer from './Timer';
import Menu from './Menu';

const App: React.FC = () => {
  const [coins, setCoins] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch('/api/coins');
        const data = await res.json();
        setCoins(data.coins);
      } catch (err) {
        console.error('Failed to fetch coins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Smiski Pomodoro</h1>
      {loading ? <p>Loading coins...</p> : <p><strong>Total Coins:</strong> {coins}</p>}
      <Timer onCoinsEarned={(newTotal) => setCoins(newTotal)} />
      <Menu />
    </div>
  );
};

export default App;
