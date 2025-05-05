import { Component } from '@angular/core';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent {
  amount: number = 1;
  fromCurrency: string = 'USD';
  toCurrency: string = 'EUR';
  convertedAmount: number | null = null;
  exchangeRates: any = {};

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit() {
    this.exchangeRateService.getExchangeRates().subscribe((data) => {
      this.exchangeRates = data.conversion_rates;
    });
  }

  convert() {
    if (this.exchangeRates[this.fromCurrency] && this.exchangeRates[this.toCurrency]) {
      const rate = this.exchangeRates[this.toCurrency] / this.exchangeRates[this.fromCurrency];
      this.convertedAmount = this.amount * rate;
    }
  }

  swapCurrencies(): void {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
  }
}
