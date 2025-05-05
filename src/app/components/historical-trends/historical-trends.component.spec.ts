import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { HistoricalTrendsComponent } from './historical-trends.component';
import { DatePipe } from '@angular/common';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { of } from 'rxjs';

describe('HistoricalTrendsComponent', () => {
  let component: HistoricalTrendsComponent;
  let fixture: ComponentFixture<HistoricalTrendsComponent>;
  let mockExchangeRateService: jasmine.SpyObj<ExchangeRateService>;

  beforeEach(() => {
    mockExchangeRateService = jasmine.createSpyObj('ExchangeRateService', ['getHistoricalData']);

    TestBed.configureTestingModule({
      declarations: [HistoricalTrendsComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatButtonModule,
        MatOptionModule,
        MatIconModule,
      ],
      providers: [
        DatePipe,
        { provide: ExchangeRateService, useValue: mockExchangeRateService }, // Provide the mock service
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getHistoricalData and renderChart with data', () => {
    const mockData = [
      { currency: 'USD', rate: 1 },
      { currency: 'EUR', rate: 0.9 },
      { currency: 'AUD', rate: 1.5 },
    ];
    mockExchangeRateService.getHistoricalData.and.returnValue(of(mockData)); // Mock the service call
    spyOn(component, 'renderChart');

    component.loadHistoricalData();

    expect(mockExchangeRateService.getHistoricalData).toHaveBeenCalledWith(
      component.baseCurrency,
      component.selectedCurrencies,
      component.selectedDate
    );
    expect(component.renderChart).toHaveBeenCalledWith(mockData);
  });
});