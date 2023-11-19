import React, { useState, useEffect } from 'react';

function TransactionList({ walletAddress }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/transactions?address=${walletAddress}`)
      .then(response => response.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      });
  }, [walletAddress]);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className="transaction-list">
      <h3>Transactions for {walletAddress}</h3>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            Hash: {tx.hash}, Block: {tx.blockNumber}, Value: {parseFloat(tx.value) / 1e18} ETH
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionList;
