import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private apiUrl = 'https://currency-dashboard-7kgm.onrender.com';

  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/exchange-rates`);
  }

  getExchangeRatesDummy(): Observable<any> {
    return this.http.get(`${this.apiUrl}/exchange-Dummy-Dummy`);
  }

  getHistoricalData(
    base: string,
    targets: string[],
    date: string
  ): Observable<any> {
    const targetStr = targets.join(',');
    const url = `${this.apiUrl}/historical-data?base=${base}&targets=${targetStr}&date=${date}`;
    return this.http.get(url);
  }
}
