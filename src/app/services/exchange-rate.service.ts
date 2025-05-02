import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/exchange-rates`);
  }

  // getHistoricalData(base: string, target: string[], date: string): Observable<any> {
  //   console.log(`date`, date);
  //   const apiKey = 'fca_live_uuG6lEeueWr1w0aaiNAMBsd7yQzaRQS3O9obN02L';
  //   const currencies = target.join(',');
  //   const url = `https://api.freecurrencyapi.com/v1/historical?apikey=${apiKey}&date=${2024-12-31}&base_currency=${base}&currencies=${currencies}`;
  //   return this.http.get(url);
  // }

  getHistoricalData(base: string, target: string, date: string): Observable<any> {
    const url = `http://localhost:3000/historical-data?base=${base}&target=${target}&date=${date}`;
    console.log('Request URL:', url); // Debugging
    return this.http.get(url);
  }
}
