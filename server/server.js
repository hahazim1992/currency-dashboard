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

app.get('/historical-data', async (req, res) => {
  const { base, targets, date } = req.query;

  // Log the received query parameters for debugging
  console.log('Received query params:', { base, targets, date });

  if (!base || !targets || !date) {
    return res.status(400).json({ error: 'Missing required query params' });
  }

  try {
    // Map 'targets' to 'currencies' for the external API
    const response = await axios.get('https://api.freecurrencyapi.com/v1/historical', {
      params: {
        apikey: API_KEY_2,
        date, // Use the single date directly
        base_currency: base,
        currencies: targets, // Map 'targets' to 'currencies'
      },
    });

    const data = response.data.data?.[date];
    if (data) {
      const results = Object.keys(data).map((currency) => ({
        date,
        currency,
        rate: data[currency],
      }));
      res.json(results);
    } else {
      res.status(404).json({ error: 'No data found for the specified date' });
    }
  } catch (error) {
    console.error('Error fetching historical data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching historical data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
