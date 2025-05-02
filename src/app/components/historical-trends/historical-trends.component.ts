import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-historical-trends',
  templateUrl: './historical-trends.component.html',
  styleUrls: ['./historical-trends.component.scss'],
})
export class HistoricalTrendsComponent implements OnInit, OnDestroy {
  historicalData: any[] = [];
  chart: any;

  baseCurrency = 'USD';
  targetCurrency = 'MYR';

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.loadHistoricalData();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadHistoricalData(): void {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30); // past 30 days

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    this.exchangeRateService
      .getHistoricalData(this.baseCurrency, this.targetCurrency, startStr, endStr)
      .subscribe((data) => {
        this.historicalData = data;
        this.renderChart();
      });
  }

  renderChart(): void {
    const dates = this.historicalData.map((entry) => entry.date);
    const rates = this.historicalData.map((entry) => entry.rate);

    if (this.chart) {
      this.chart.destroy(); // Prevent multiple overlapping charts
    }

    this.chart = new Chart('historicalChart', {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: `${this.baseCurrency} → ${this.targetCurrency}`,
            data: rates,
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: { display: true, text: 'Date' },
          },
          y: {
            display: true,
            title: { display: true, text: 'Rate' },
          },
        },
      },
    });
  }
}
