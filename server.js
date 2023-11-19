const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

// Enable All CORS Requests for development
app.use(cors());

app.get('/api/wallet', async (req, res) => {
  try {
    const walletAddress = req.query.address;
    const response = await axios.get(`${ETHERSCAN_API_URL}`, {
      params: {
        module: 'account',
        action: 'balance',
        address: walletAddress,
        tag: 'latest',
        apiKey: process.env.ETHERSCAN_API_KEY
      }
    });

    const balanceInEther = response.data.result / 1e18; // Convert Wei to Ether
    res.json({ address: walletAddress, balance: balanceInEther.toString() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const walletAddress = req.query.address;
    const response = await axios.get(`${ETHERSCAN_API_URL}`, {
      params: {
        module: 'account',
        action: 'txlist',
        address: walletAddress,
        startblock: 0,
        endblock: 99999999,
        sort: 'asc',
        apiKey: process.env.ETHERSCAN_API_KEY
      }
    });

    res.json(response.data.result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
