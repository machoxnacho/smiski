import React, { useState } from 'react';
import Timer from './Timer';
import Menu from './Menu';

const App: React.FC = () => {
  const [userId] = useState<string>('dummy-user');

  return (
    <div className="app">
      <header className="header">
        <div className="title">Smiski Pomodoro</div>
      </header>

      <p className="sub">Study, acquire clovers, and grow your smiski collection (˶˃ ᵕ ˂˶)</p>

      <Timer onCoinsEarned={() => {}} userId={userId} />
      <Menu />
    </div>
  );
};

export default App;
