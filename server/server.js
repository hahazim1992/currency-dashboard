const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const API_KEY = 'fc2e95532c33f61156ee5fbf';

app.get('/exchange-rates', async (req, res) => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exchange rates' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
