const request = require('supertest');
const app = require('./server');
const axios = require('axios');

describe('Server API Endpoints', () => {
  it('should fetch exchange rates', async () => {
    const response = await request(app).get('/exchange-rates');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('conversion_rates');
  });

  it('should fetch historical data with valid query params', async () => {
    const response = await request(app)
      .get('/historical-data')
      .query({ base: 'USD', targets: 'EUR,GBP', date: '2025-05-01' });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('currency');
    expect(response.body[0]).toHaveProperty('rate');
  });

  it('should return 400 for missing query params in /historical-data', async () => {
    const response = await request(app).get('/historical-data');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required query params');
  });

  it('should handle errors from external APIs gracefully', async () => {
    const response = await request(app)
      .get('/historical-data')
      .query({ base: 'INVALID', targets: 'EUR', date: '2025-05-01' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error fetching historical data');
  });

  it('should handle errors when fetching exchange rates', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('API error'));

    const response = await request(app).get('/exchange-rates');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error fetching exchange rates');

    axios.get.mockRestore();
  });

  it('should return 404 if no data is found for the specified date', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: {},
      },
    });
  
    const response = await request(app)
      .get('/historical-data')
      .query({ base: 'USD', targets: 'EUR,GBP', date: '1900-01-01' });
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'No data found for the specified date');
  
    axios.get.mockRestore();
  });

  it('should return 500 if an error occurs while fetching historical data', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('API error'));
  
    const response = await request(app)
      .get('/historical-data')
      .query({ base: 'USD', targets: 'EUR,GBP', date: '2025-05-01' });
  
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error fetching historical data');
  
    axios.get.mockRestore();
  });
});