import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExchangeRateService],
    });

    service = TestBed.inject(ExchangeRateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch exchange rates', () => {
    const mockResponse = {
      conversion_rates: {
        USD: 1,
        EUR: 0.85,
        GBP: 0.75,
      },
    };

    service.getExchangeRates().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/exchange-rates`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Simulate a successful response
  });

  it('should call the dummy endpoint and handle failure', () => {
    service.getExchangeRatesDummy().subscribe(
      () => fail('Expected an error, not a successful response'),
      (error) => {
        expect(error.status).toBe(404);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/exchange-Dummy-Dummy`);
    expect(req.request.method).toBe('GET');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' }); // Simulate a 404 error
  });

  it('should fetch historical data', () => {
    const base = 'USD';
    const targets = ['EUR', 'GBP'];
    const date = '2025-05-05';
    const mockResponse = [
      { currency: 'EUR', rate: 0.85 },
      { currency: 'GBP', rate: 0.75 },
    ];

    service.getHistoricalData(base, targets, date).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const targetStr = targets.join(',');
    const req = httpMock.expectOne(`${apiUrl}/historical-data?base=${base}&targets=${targetStr}&date=${date}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Simulate a successful response
  });
});