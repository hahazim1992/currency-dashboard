import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalTrendsComponent } from './historical-trends.component';

describe('HistoricalTrendsComponent', () => {
  let component: HistoricalTrendsComponent;
  let fixture: ComponentFixture<HistoricalTrendsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalTrendsComponent]
    });
    fixture = TestBed.createComponent(HistoricalTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
