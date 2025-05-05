import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyConverterComponent } from './currency-converter.component';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { of } from 'rxjs';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let mockExchangeRateService: jasmine.SpyObj<ExchangeRateService>;

  beforeEach(async () => {
    mockExchangeRateService = jasmine.createSpyObj('ExchangeRateService', ['getExchangeRates']);

    await TestBed.configureTestingModule({
      declarations: [CurrencyConverterComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ExchangeRateService, useValue: mockExchangeRateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;

    mockExchangeRateService.getExchangeRates.and.returnValue(
      of({
        conversion_rates: {
          USD: 1,
          EUR: 0.85,
          GBP: 0.75,
        },
      })
    );

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.converterForm.value).toEqual({
      amount: 1,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    });
  });

  it('should fetch exchange rates on initialization', () => {
    expect(mockExchangeRateService.getExchangeRates).toHaveBeenCalled();
    expect(component.exchangeRates).toEqual({
      USD: 1,
      EUR: 0.85,
      GBP: 0.75,
    });
  });

  it('should calculate the converted amount correctly', () => {
    component.converterForm.setValue({
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    });

    component.convert();

    expect(component.convertedAmount).toBe(85); // 100 * 0.85
  });

  it('should swap the currencies when swapCurrencies is called', () => {
    component.converterForm.setValue({
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    });

    component.swapCurrencies();

    expect(component.converterForm.value).toEqual({
      amount: 100,
      fromCurrency: 'EUR',
      toCurrency: 'USD',
    });
  });

  it('should reset the form and clear the converted amount', () => {
    component.converterForm.setValue({
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    });
    component.convertedAmount = 85;

    component.resetForm();

    expect(component.converterForm.value).toEqual({
      amount: null,
      fromCurrency: '',
      toCurrency: '',
    });
    expect(component.convertedAmount).toBeNull();
  });

  it('should disable the Convert button if the form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const convertButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    component.converterForm.setValue({
      amount: null,
      fromCurrency: '',
      toCurrency: '',
    });
    fixture.detectChanges();

    expect(convertButton.disabled).toBeTrue();
  });
});