import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { Chart, registerables } from 'chart.js';
import { MatYearView } from '@angular/material/datepicker';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';

Chart.register(...registerables);

@Component({
  selector: 'app-historical-trends',
  templateUrl: './historical-trends.component.html',
  styleUrls: ['./historical-trends.component.scss'],
})
export class HistoricalTrendsComponent implements OnInit, OnDestroy {
  baseCurrency = 'USD';
  targetCurrenciesStr = 'MYR,SGD';
  selectedDate!: string; // Use a date instead of interval
  chart: any;

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    // Set default to yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    // Format: YYYY-MM-DD
    this.selectedDate = yesterday.toISOString().split('T')[0]; 
    this.loadHistoricalData()
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  disableFutureDates = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
    return date ? date < today : false;
  };

  loadHistoricalData(): void {
    const targets = this.targetCurrenciesStr.split(',').map((c) => c.trim()).slice(0, 3);
  
    if (!this.selectedDate) {
      alert('Please select a date.');
      return;
    }
  
    this.exchangeRateService.getHistoricalData(this.baseCurrency, targets, this.selectedDate).subscribe((data) => {
      this.renderChart(data);
    });
  }

  renderChart(data: any): void {
    const labels = data.map((d: any) => d.currency);
    const datasets = [
      {
        label: `Exchange Rate of ${this.baseCurrency} on ${this.selectedDate}`,
        data: data.map((entry: any) => entry.rate),
        borderColor: this.getRandomColor(),
        backgroundColor: this.getRandomColor(),
        fill: false,
        tension: 0.3,
      },
    ];
  
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = document.getElementById('historicalChart') as HTMLCanvasElement;
    this.chart = new Chart(canvas, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: { title: { display: true, text: 'Currency' } },
          y: { title: { display: true, text: 'Exchange Rate' } },
        },
      },
    });
  }

  getRandomColor(): string {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  }

  // list of currencies in latest
  totalHistoricalCurrencies = [
    'USD', 'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 
    'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 
    'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 
    'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 
    'INR', 'IQD', 'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KRW', 'KWD', 'KYD', 
    'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 
    'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 
    'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 
    'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 
    'TZS', 'UAH', 'UGX', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XCG', 'XDR', 'XOF', 'XPF', 'YER', 
    'ZAR', 'ZMW', 'ZWL'
  ];

  workingHistoricalCurrencies = [
    'ZAR', 'TRY', 'RON', 'PLN', 'PHP', 'KRW', 'ISK', 'INR', 'ILS', 'IDR', 
    'HUF', 'HRK', 'HKD', 'GBP', 'EUR', 'DKK', 'CZK', 'CNY', 'CHF', 'CAD', 
    'BRL', 'BGN', 'AUD', 'MYR', 'USD', 'AUD'
  ];
}