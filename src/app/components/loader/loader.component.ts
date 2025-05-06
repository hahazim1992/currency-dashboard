import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-overlay" *ngIf="isLoading | async">
      <mat-spinner></mat-spinner>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  isLoading = this.loaderService.loading$;

  constructor(private loaderService: LoaderService) {}
}
