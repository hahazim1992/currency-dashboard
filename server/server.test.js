const request = require('supertest');
const express = require('express');
const app = require('./server'); // Import your server

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
});