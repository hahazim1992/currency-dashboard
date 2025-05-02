import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-historical-trends',
  templateUrl: './historical-trends.component.html',
  styleUrls: ['./historical-trends.component.scss'],
})
export class HistoricalTrendsComponent implements OnInit {
  historicalData: any = [];
  chart: any;

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.exchangeRateService.getHistoricalData().subscribe((data) => {
      this.historicalData = data;
      this.renderChart();
    });
  }

  renderChart(): void {
    const dates = this.historicalData.map((entry: any) => entry.date);
    const rates = this.historicalData.map((entry: any) => entry.rate);

    this.chart = new Chart('historicalChart', {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Exchange Rate',
            data: rates,
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
          },
        ],
      },
    });
  }
}
