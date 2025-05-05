import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.scss'],
})
export class ExchangeRatesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['number', 'currency', 'rate', 'baseCurrency'];
  exchangeRates = new MatTableDataSource<any>([]);
  filterForm!: FormGroup;
  isOffline: boolean = !navigator.onLine;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private exchangeRateService: ExchangeRateService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
    });

    this.filterForm.get('search')?.valueChanges.subscribe((value) => {
      this.applyFilter(value);
    });

    // check whether you are online or offline
    window.addEventListener('online', () => this.handleNetworkChange());
    window.addEventListener('offline', () => this.handleNetworkChange());

    // Randomly trigger toggleOfflineMode
    if (Math.random() < 0.5) {
      console.log('Randomly triggering toggleOfflineMode.');
      this.toggleOfflineMode();
    }

    this.loadData();
  }

  ngAfterViewInit(): void {
    this.exchangeRates.sort = this.sort;
    this.exchangeRates.paginator = this.paginator;

    this.exchangeRates.sortingDataAccessor = (item, property) => {
      if (property === 'rate') {
        return item.value;
      }
      return item[property];
    };
  }

  applyFilter(filterValue: string): void {
    this.exchangeRates.filter = filterValue?.trim().toLowerCase();
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.exchangeRates.filter = '';
  }

  private loadData(): void {
    if (this.isOffline) {
      // Load cached data from localStorage
      const cachedData = localStorage.getItem('exchangeRates');
      if (cachedData) {
        this.exchangeRates.data = JSON.parse(cachedData);
      } else {
        console.warn('No cached data available.');
      }
    } else {
      // Fetch live data and cache it
      this.exchangeRateService.getExchangeRates().subscribe((data) => {
        const rates = Object.entries(data.conversion_rates).map(([currency, value]) => ({
          currency,
          value: Number(value),
        }));
        this.exchangeRates.data = rates;

        // modify cached data for simulation
        const cachedRates = rates.map((rate) => {
          if (rate.currency === 'USD') {
            return { ...rate, value: 999 };
          }
          if (rate.currency === 'AED') {
            return { ...rate, value: 888 };
          }
          return rate;
        });
        localStorage.setItem('exchangeRates', JSON.stringify(cachedRates));
      });
    }
  }

  private handleNetworkChange(): void {
    this.isOffline = !navigator.onLine;
    this.loadData();
  }

  toggleOfflineMode(): void {
    this.isOffline = !this.isOffline;
  
    if (this.isOffline) {
      console.warn('Simulating offline mode with a failed API call.');
      // Call the dummy service to simulate a failed API call
      this.exchangeRateService.getExchangeRatesDummy().subscribe(
        () => {
          console.log('This should not happen as the endpoint is fake.');
        },
        (error) => {
          console.error('API call failed as expected in offline mode:', error);
          this.loadData();
        }
      );
    } else {
      console.log('Switching to online mode. Fetching live data.');
      this.loadData();
    }
  }
}