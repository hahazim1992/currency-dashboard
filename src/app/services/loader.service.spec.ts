import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs/operators';

import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true when show() is called', (done) => {
    service.loading$.subscribe((isLoading) => {
      if (isLoading) {
        expect(isLoading).toBeTrue();
        done();
      }
    });
    service.show();
  });

  it('should emit false when hide() is called', (done) => {
    service.loading$.pipe(first()).subscribe((isLoading) => {
      expect(isLoading).toBeFalse();
      done();
    });
    service.hide();
  });

  it('should have initial loading$ value as false', (done) => {
    service.loading$.subscribe((isLoading) => {
      expect(isLoading).toBeFalse();
      done();
    });
  });
});
