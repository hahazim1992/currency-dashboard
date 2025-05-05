import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExchangeRatesComponent } from './exchange-rates.component';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { of, throwError } from 'rxjs';

describe('ExchangeRatesComponent', () => {
  let component: ExchangeRatesComponent;
  let fixture: ComponentFixture<ExchangeRatesComponent>;
  let mockExchangeRateService: jasmine.SpyObj<ExchangeRateService>;

  beforeEach(async () => {
    mockExchangeRateService = jasmine.createSpyObj('ExchangeRateService', ['getExchangeRates', 'getExchangeRatesDummy']);

    await TestBed.configureTestingModule({
      declarations: [ExchangeRatesComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ExchangeRateService, useValue: mockExchangeRateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExchangeRatesComponent);
    component = fixture.componentInstance;

    // Mock exchange rates
    mockExchangeRateService.getExchangeRates.and.returnValue(
      of({
        conversion_rates: {
          USD: 1,
          EUR: 0.85,
          AED: 3.67,
        },
      })
    );

    mockExchangeRateService.getExchangeRatesDummy.and.returnValue(throwError(() => new Error('Simulated API failure')));

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize with online status and fetch exchange rates', () => {
  //   expect(component.isOffline).toBeTrue();
  //   expect(component.exchangeRates.data).toEqual([
  //     { currency: 'USD', value: 999 },
  //     { currency: 'EUR', value: 0.85 },
  //     { currency: 'AED', value: 888 },
  //   ]);
  // });

  it('should filter the exchange rates based on search input', () => {
    component.exchangeRates.data = [
      { currency: 'USD', value: 1 },
      { currency: 'EUR', value: 0.85 },
      { currency: 'AED', value: 3.67 },
    ];

    component.applyFilter('usd');
    expect(component.exchangeRates.filteredData).toEqual([{ currency: 'USD', value: 1 }]);

    component.applyFilter('eur');
    expect(component.exchangeRates.filteredData).toEqual([{ currency: 'EUR', value: 0.85 }]);
  });

  it('should reset the filter', () => {
    component.exchangeRates.data = [
      { currency: 'USD', value: 1 },
      { currency: 'EUR', value: 0.85 },
      { currency: 'AED', value: 3.67 },
    ];

    component.applyFilter('usd');
    expect(component.exchangeRates.filteredData).toEqual([{ currency: 'USD', value: 1 }]);

    component.resetFilter();
    expect(component.exchangeRates.filteredData).toEqual(component.exchangeRates.data);
  });

  it('should toggle offline mode and load cached data', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify([
        { currency: 'USD', value: 999 },
        { currency: 'AED', value: 888 },
      ])
    );

    component.toggleOfflineMode();
    expect(component.isOffline).toBeTrue();
    expect(mockExchangeRateService.getExchangeRatesDummy).toHaveBeenCalled();
    expect(component.exchangeRates.data).toEqual([
      { currency: 'USD', value: 999 },
      { currency: 'AED', value: 888 },
    ]);
  });

  it('should switch back to online mode and fetch live data', () => {
    component.isOffline = true;

    component.toggleOfflineMode();
    expect(component.isOffline).toBeFalse();
    expect(mockExchangeRateService.getExchangeRates).toHaveBeenCalled();
    expect(component.exchangeRates.data).toEqual([
      { currency: 'USD', value: 1 },
      { currency: 'EUR', value: 0.85 },
      { currency: 'AED', value: 3.67 },
    ]);
  });

  it('should handle network change events', () => {
    spyOn(component, 'loadData');

    window.dispatchEvent(new Event('offline'));
    expect(component.isOffline).toBeFalse();
    expect(component.loadData).toHaveBeenCalled();

    window.dispatchEvent(new Event('online'));
    expect(component.isOffline).toBeFalse();
    expect(component.loadData).toHaveBeenCalledTimes(2);
  });
});