import { Component, OnDestroy } from '@angular/core';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-historical-trends',
  templateUrl: './historical-trends.component.html',
  styleUrls: ['./historical-trends.component.scss'],
})
export class HistoricalTrendsComponent implements OnDestroy {
  baseCurrency = 'USD';
  targetCurrenciesStr = 'MYR,SGD';
  selectedDate: string; // Use a date instead of interval
  chart: any;

  constructor(private exchangeRateService: ExchangeRateService) {
    // Default to today's date
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

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
    const labels = data.map((d: any) => d.date);
    const datasets = [
      {
        label: `${this.baseCurrency} → ${this.targetCurrenciesStr}`,
        data: data.map((entry: any) => entry.rate),
        borderColor: this.getRandomColor(),
        fill: false,
        tension: 0.3,
      },
    ];

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('historicalChart', {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Rate' } },
        },
      },
    });
  }

  getRandomColor(): string {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  }
}