import React from 'react';
import Header from './components/Header/Header';
import Portfolio from './components/Portfolio/Portfolio';
import WalletManager from './components/WalletManager/WalletManager';
import './App.css';

function App() {
  return (
    <div>
      <Header />
      <Portfolio />
      <WalletManager />
    </div>
  );
}

export default App;
