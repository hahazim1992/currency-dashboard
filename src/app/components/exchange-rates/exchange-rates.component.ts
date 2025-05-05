import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.scss'],
})
export class ExchangeRatesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['number', 'currency', 'rate', 'baseCurrency'];
  exchangeRates = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.exchangeRateService.getExchangeRates().subscribe((data) => {
      const rates = Object.entries(data.conversion_rates).map(([currency, value]) => ({
        currency,
        value: Number(value),
      }));
      this.exchangeRates.data = rates;
    });
  }

  ngAfterViewInit(): void {
    this.exchangeRates.sort = this.sort;

    this.exchangeRates.sortingDataAccessor = (item, property) => {
      console.log(`item`, item);
      console.log(`property`, property);
      if (property === 'rate') {
        return item.value;
      }
      return item[property];
    };
  }
}