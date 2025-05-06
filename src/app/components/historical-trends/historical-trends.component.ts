import { MatSortModule } from '@angular/material/sort';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { Chart, registerables } from 'chart.js';
import { DatePipe } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-historical-trends',
  templateUrl: './historical-trends.component.html',
  styleUrls: ['./historical-trends.component.scss'],
  providers: [DatePipe], // Add DatePipe as a provider
})
export class HistoricalTrendsComponent implements OnInit, OnDestroy {
  selectedTargetCurrencies: string[] = ['MYR', 'USD', 'AUD'];
  selectedBaseCurrencies = 'USD';
  selectedDate!: string;
  chart: any;

  workingHistoricalCurrencies = [
    'ZAR',
    'TRY',
    'RON',
    'PLN',
    'PHP',
    'KRW',
    'ISK',
    'INR',
    'ILS',
    'IDR',
    'HUF',
    'HRK',
    'HKD',
    'GBP',
    'EUR',
    'DKK',
    'CZK',
    'CNY',
    'CHF',
    'CAD',
    'BRL',
    'BGN',
    'AUD',
    'MYR',
    'USD',
  ];

  workingBaseCurrencies = [
    'USD',
    'AUD',
    'BGN',
    'BRL',
    'CAD',
    'CHF',
    'CNY',
    'CZK',
    'DKK',
    'EUR',
    'GBP',
    'HKD',
    'HRK',
    'IDR',
    'INR',
    'JPY',
    'KRW',
    'MXN',
    'NOK',
    'SEK',
    'SGD',
    'THB',
    'TRY',
    'ZAR',
  ];

  constructor(
    private exchangeRateService: ExchangeRateService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // Set default to yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.selectedDate = this.datePipe.transform(yesterday, 'yyyy-MM-dd')!; // Format: YYYY-MM-DD
    this.loadHistoricalData();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  // because future currentDate and future dates throw errors in the historical public API
  disableFutureDates = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
    return date ? date < today : false;
  };

  loadHistoricalData(): void {
    const targets = this.selectedTargetCurrencies;

    if (!this.selectedDate) {
      alert('Please select a date.');
      return;
    }

    if (targets.length === 0) {
      alert('Please select at least one target currency.');
      return;
    }

    this.exchangeRateService
      .getHistoricalData(
        this.selectedBaseCurrencies,
        targets,
        this.selectedDate
      )
      .subscribe((data) => {
        this.renderChart(data);
      });
  }

  onDateChange(event: any): void {
    // Format the selected date as YYYY-MM-DD
    this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')!;
  }

  renderChart(data: any): void {
    const labels = data.map((d: any) => d.currency);
    const datasets = [
      {
        label: `Exchange Rate of ${this.selectedBaseCurrencies} on ${this.selectedDate}`,
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

    const canvas = document.getElementById(
      'historicalChart'
    ) as HTMLCanvasElement;
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

  resetTargetCurrencies(): void {
    this.selectedTargetCurrencies = [];
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  // selectAllTargetCurrencies(): void {
  //   this.selectedTargetCurrencies = [...this.workingHistoricalCurrencies];
  // }

  // TEMP: to test which BASE currencies are working
  // loadHistoricalData(): void {
  //   const delay = 500; // 0.5 seconds delay
  //   this.totalHistoricalCurrencies.forEach((baseCurrency, index) => {
  //     setTimeout(() => {
  //       const targets = this.selectedTargetCurrencies; // Use the selected currencies as targets
  //       console.log(`Fetching data for base currency: ${baseCurrency} with targets: ${targets}`);
  //       this.exchangeRateService.getHistoricalData(baseCurrency, targets, this.selectedDate).subscribe((data) => {
  //         console.log(`Data for base currency ${baseCurrency}:`, data);
  //         this.renderChart(data); // Optionally render the chart for each response
  //       });
  //     }, index * delay); // Delay each request by 0.5 seconds
  //   });
  // }

  // TEMP: to test which TARGET currencies are workin
  // loadHistoricalData(): void {
  //   const delay = 500; // 0.5 seconds delay
  //   this.totalHistoricalCurrencies.forEach((target, index) => {
  //     setTimeout(() => {
  //       const targets = [target]; // Replace targets with a single element array
  //       console.log(`Fetching data for target: ${target}`);
  //       this.exchangeRateService.getHistoricalData(this.baseCurrency, targets, this.selectedDate).subscribe((data) => {
  //         console.log(`Data for ${target}:`, data);
  //         this.renderChart(data); // Optionally render the chart for each response
  //       });
  //     }, index * delay); // Delay each request by 0.5 seconds
  //   });
  // }

  // list of currencies in latest but not all is working with historical API
  totalHistoricalCurrencies = [
    'USD',
    'AED',
    'AFN',
    'ALL',
    'AMD',
    'ANG',
    'AOA',
    'ARS',
    'AUD',
    'AWG',
    'AZN',
    'BAM',
    'BBD',
    'BDT',
    'BGN',
    'BHD',
    'BIF',
    'BMD',
    'BND',
    'BOB',
    'BRL',
    'BSD',
    'BTN',
    'BWP',
    'BYN',
    'BZD',
    'CAD',
    'CDF',
    'CHF',
    'CLP',
    'CNY',
    'COP',
    'CRC',
    'CUP',
    'CVE',
    'CZK',
    'DJF',
    'DKK',
    'DOP',
    'DZD',
    'EGP',
    'ERN',
    'ETB',
    'EUR',
    'FJD',
    'FKP',
    'FOK',
    'GBP',
    'GEL',
    'GGP',
    'GHS',
    'GIP',
    'GMD',
    'GNF',
    'GTQ',
    'GYD',
    'HKD',
    'HNL',
    'HRK',
    'HTG',
    'HUF',
    'IDR',
    'ILS',
    'IMP',
    'INR',
    'IQD',
    'IRR',
    'ISK',
    'JEP',
    'JMD',
    'JOD',
    'JPY',
    'KES',
    'KGS',
    'KHR',
    'KID',
    'KMF',
    'KRW',
    'KWD',
    'KYD',
    'KZT',
    'LAK',
    'LBP',
    'LKR',
    'LRD',
    'LSL',
    'LYD',
    'MAD',
    'MDL',
    'MGA',
    'MKD',
    'MMK',
    'MNT',
    'MOP',
    'MRU',
    'MUR',
    'MVR',
    'MWK',
    'MXN',
    'MYR',
    'MZN',
    'NAD',
    'NGN',
    'NIO',
    'NOK',
    'NPR',
    'NZD',
    'OMR',
    'PAB',
    'PEN',
    'PGK',
    'PHP',
    'PKR',
    'PLN',
    'PYG',
    'QAR',
    'RON',
    'RSD',
    'RUB',
    'RWF',
    'SAR',
    'SBD',
    'SCR',
    'SDG',
    'SEK',
    'SGD',
    'SHP',
    'SLE',
    'SLL',
    'SOS',
    'SRD',
    'SSP',
    'STN',
    'SYP',
    'SZL',
    'THB',
    'TJS',
    'TMT',
    'TND',
    'TOP',
    'TRY',
    'TTD',
    'TVD',
    'TWD',
    'TZS',
    'UAH',
    'UGX',
    'UYU',
    'UZS',
    'VES',
    'VND',
    'VUV',
    'WST',
    'XAF',
    'XCD',
    'XCG',
    'XDR',
    'XOF',
    'XPF',
    'YER',
    'ZAR',
    'ZMW',
    'ZWL',
  ];
}
