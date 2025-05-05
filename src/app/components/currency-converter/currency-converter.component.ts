import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  converterForm!: FormGroup;
  convertedAmount: number | null = null;
  exchangeRates: any = {};

  constructor(
    private exchangeRateService: ExchangeRateService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.converterForm = this.fb.group({
      amount: [1, [Validators.required, Validators.min(0.01)]],
      fromCurrency: ['USD', Validators.required],
      toCurrency: ['EUR', Validators.required],
    });

    this.exchangeRateService.getExchangeRates().subscribe((data) => {
      this.exchangeRates = data.conversion_rates;
    });
  }

  convert() {
    const { amount, fromCurrency, toCurrency } = this.converterForm.value;

    if (this.exchangeRates[fromCurrency] && this.exchangeRates[toCurrency]) {
      const rate = this.exchangeRates[toCurrency] / this.exchangeRates[fromCurrency];
      this.convertedAmount = amount * rate;
    }
  }

  swapCurrencies(): void {
    const fromCurrency = this.converterForm.get('fromCurrency')?.value;
    const toCurrency = this.converterForm.get('toCurrency')?.value;

    this.converterForm.patchValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency,
    });
  }

  resetForm(): void {
    this.converterForm.reset({
      amount: null,
      fromCurrency: '',
      toCurrency: '',
    });
    this.convertedAmount = null; // Clear the converted amount
  }
}