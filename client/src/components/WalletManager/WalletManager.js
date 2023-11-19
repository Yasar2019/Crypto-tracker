import React, { useState, useEffect } from 'react';
import TransactionList from './TransactionList'; // Import the TransactionList component
import './WalletManager.css';

function WalletManager() {
  const [wallets, setWallets] = useState([]);
  const [newWallet, setNewWallet] = useState('');
  const [walletBalances, setWalletBalances] = useState({});
  const [selectedWallet, setSelectedWallet] = useState(null); // State to track the selected wallet for transaction history
  const [errorMessage, setErrorMessage] = useState('');

  const isValidAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const addWallet = () => {
    if (newWallet && isValidAddress(newWallet)) {
      setWallets([...wallets, newWallet]);
      setNewWallet('');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid Ethereum address format.');
    }
  };

  const removeWallet = (address) => {
    setWallets(wallets.filter(wallet => wallet !== address));
    const newBalances = {...walletBalances};
    delete newBalances[address];
    setWalletBalances(newBalances);
    if (selectedWallet === address) setSelectedWallet(null);
  };

  const fetchWalletBalance = (wallet) => {
    fetch(`http://localhost:3001/api/wallet?address=${wallet}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
          setErrorMessage('Error fetching balance for address: ' + wallet);
        } else {
          setWalletBalances(prevBalances => ({ ...prevBalances, [wallet]: data.balance }));
        }
      })
      .catch(error => {
        console.error('Error fetching wallet data:', error);
        setErrorMessage('Network error while fetching balance for address: ' + wallet);
      });
  };

  useEffect(() => {
    wallets.forEach(wallet => {
      fetchWalletBalance(wallet);
    });
  }, [wallets]);

  const viewTransactions = (wallet) => {
    setSelectedWallet(wallet);
  };

  return (
    <div className="wallet-manager">
      <h2>Manage Your Wallets</h2>
      <input 
        type="text"
        value={newWallet}
        onChange={(e) => setNewWallet(e.target.value)}
        placeholder="Enter wallet address"
      />
      <button onClick={addWallet}>Add Wallet</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div>
        {wallets.map((wallet, index) => (
          <div key={index} className="wallet-item">
            {wallet} - Balance: {walletBalances[wallet] !== undefined ? walletBalances[wallet] + ' ETH' : 'Loading...'}
            <button onClick={() => removeWallet(wallet)}>Remove</button>
            <button onClick={() => viewTransactions(wallet)}>View Transactions</button>
          </div>
        ))}
      </div>

      {selectedWallet && <TransactionList walletAddress={selectedWallet} />}
    </div>
  );
}

export default WalletManager;
