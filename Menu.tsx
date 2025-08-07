import React from 'react';

const Menu: React.FC = () => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Menu (Placeholder)</h3>
      <ul>
        <li>Item A - 50 coins</li>
        <li>Item B - 75 coins</li>
        <li>Item C - 100 coins</li>
      </ul>
      <button disabled>Purchase</button>
    </div>
  );
};

export default Menu;
