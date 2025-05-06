import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HistoricalTrendsComponent } from './historical-trends.component';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { Chart } from 'chart.js';

describe('HistoricalTrendsComponent', () => {
  let component: HistoricalTrendsComponent;
  let fixture: ComponentFixture<HistoricalTrendsComponent>;
  let mockExchangeRateService: jasmine.SpyObj<ExchangeRateService>;

  beforeEach(async () => {
    mockExchangeRateService = jasmine.createSpyObj('ExchangeRateService', [
      'getHistoricalData',
    ]);

    await TestBed.configureTestingModule({
      declarations: [HistoricalTrendsComponent],
      imports: [
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
        BrowserAnimationsModule,
      ],
      providers: [
        DatePipe,
        { provide: ExchangeRateService, useValue: mockExchangeRateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalTrendsComponent);
    component = fixture.componentInstance;

    // Mock the getHistoricalData method
    mockExchangeRateService.getHistoricalData.and.returnValue(
      of([
        { currency: 'EUR', rate: 0.85 },
        { currency: 'GBP', rate: 0.75 },
      ])
    );

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getHistoricalData and renderChart with data', () => {
    spyOn(component, 'renderChart');

    component.loadHistoricalData();

    expect(mockExchangeRateService.getHistoricalData).toHaveBeenCalledWith(
      component.selectedBaseCurrencies,
      component.selectedTargetCurrencies,
      component.selectedDate
    );
    expect(component.renderChart).toHaveBeenCalledWith([
      { currency: 'EUR', rate: 0.85 },
      { currency: 'GBP', rate: 0.75 },
    ]);
  });

  it('should set the selected date on date change', () => {
    const mockEvent = { value: new Date('2025-05-05') };
    component.onDateChange(mockEvent);
    expect(component.selectedDate).toBe('2025-05-05');
  });

  it('should reset target currencies and destroy the chart', () => {
    spyOn(component.chart, 'destroy').and.callThrough(); // Spy on chart.destroy

    component.selectedTargetCurrencies = ['USD', 'EUR', 'GBP'];
    component.resetTargetCurrencies();

    expect(component.selectedTargetCurrencies).toEqual([]);
    expect(component.chart).toBeNull();
  });

  it('should alert if no date is selected', () => {
    spyOn(window, 'alert');
    component.selectedDate = '';
    component.selectedTargetCurrencies = ['EUR', 'GBP'];

    component.loadHistoricalData();

    expect(window.alert).toHaveBeenCalledWith('Please select a date.');
  });

  it('should alert if no target currencies are selected', () => {
    spyOn(window, 'alert');
    component.selectedDate = '2025-05-05';
    component.selectedTargetCurrencies = [];

    component.loadHistoricalData();

    expect(window.alert).toHaveBeenCalledWith(
      'Please select at least one target currency.'
    );
  });

  it('should call getHistoricalData with correct parameters and renderChart', () => {
    spyOn(component, 'renderChart');
    component.selectedDate = '2025-05-05';
    component.selectedTargetCurrencies = ['EUR', 'GBP'];

    component.loadHistoricalData();

    expect(mockExchangeRateService.getHistoricalData).toHaveBeenCalledWith(
      component.selectedBaseCurrencies,
      component.selectedTargetCurrencies,
      component.selectedDate
    );
    expect(component.renderChart).toHaveBeenCalledWith([
      { currency: 'EUR', rate: 0.85 },
      { currency: 'GBP', rate: 0.75 },
    ]);
  });

  it('should render the chart with correct data', () => {
    const mockData = [
      { currency: 'EUR', rate: 0.85 },
      { currency: 'GBP', rate: 0.75 },
    ];
    const canvas = document.createElement('canvas');
    canvas.id = 'historicalChart';
    document.body.appendChild(canvas);

    spyOn(component, 'getRandomColor').and.returnValue('hsl(200, 70%, 60%)');
    component.renderChart(mockData);

    expect(component.chart).toBeTruthy();
    expect(component.chart.data.labels).toEqual(['EUR', 'GBP']);
    expect(component.chart.data.datasets[0].data).toEqual([0.85, 0.75]);
    expect(component.chart.data.datasets[0].label).toBe(
      `Exchange Rate of ${component.selectedBaseCurrencies} on ${component.selectedDate}`
    );

    document.body.removeChild(canvas);
  });
});
