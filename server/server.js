const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const API_KEY_1 = 'fc2e95532c33f61156ee5fbf'; // not used for historical
const API_KEY_2 = 'fca_live_uuG6lEeueWr1w0aaiNAMBsd7yQzaRQS3O9obN02L';

app.get('/exchange-rates', async (req, res) => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY_1}/latest/USD`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exchange rates' });
  }
});

app.get('/historical', async (req, res) => {
  const { base, target, date } = req.query;

  if (!base || !target || !date) {
    return res.status(400).json({ error: 'Missing required query params' });
  }

  try {
    const response = await axios.get('https://api.freecurrencyapi.com/v1/historical', {
      params: {
        apikey: API_KEY_2,
        date_from: date,
        date_to: date,
        base_currency: base,
        currencies: target,
      },
    });

    const rate = response.data.data?.[date]?.[target];
    if (rate) {
      res.json({ date, rate });
    } else {
      res.status(404).json({ error: 'Rate not found for the specified date' });
    }
  } catch (error) {
    console.error('Error fetching historical data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching historical data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
