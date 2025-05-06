import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeRatesComponent } from './components/exchange-rates/exchange-rates.component';
import { HistoricalTrendsComponent } from './components/historical-trends/historical-trends.component';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';

const routes: Routes = [
  { path: 'exchange-rates', component: ExchangeRatesComponent },
  { path: 'historical-trends', component: HistoricalTrendsComponent },
  { path: 'currency-converter', component: CurrencyConverterComponent },
  { path: '', redirectTo: '/exchange-rates', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
