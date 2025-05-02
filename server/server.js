const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// TODO: Move the API key to an environment variable
const API_KEY = 'fc2e95532c33f61156ee5fbf';

app.get('/exchange-rates', async (req, res) => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exchange rates' });
  }
});

app.get('/historical-data', async (req, res) => {
  const { base, target, start_date, end_date } = req.query;

  if (!base || !target || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required query params' });
  }

  const start = new Date(start_date);
  const end = new Date(end_date);
  const dateArray = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d).toISOString().split('T')[0]);
  }

  try {
    const promises = dateArray.map(date => {
      return axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/history/${base}/${date}`)
        .then(response => ({
          date,
          rate: response.data.conversion_rates[target]
        }));
    });

    const results = await Promise.all(promises);
    res.json(results);

  } catch (error) {
    console.error('Error fetching historical data', error);
    res.status(500).json({ error: 'Error fetching historical data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
