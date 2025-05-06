import { TestBed } from '@angular/core/testing';

import { LoaderInterceptor } from './loader.interceptor';
import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { of } from 'rxjs';

describe('LoaderInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [LoaderInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: LoaderInterceptor = TestBed.inject(LoaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

describe('LoaderInterceptor', () => {
  let interceptor: LoaderInterceptor;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let httpHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    loaderService = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    httpHandler = jasmine.createSpyObj('HttpHandler', ['handle']);

    interceptor = new LoaderInterceptor(loaderService);
  });

  it('should pass the request to the next handler', (done) => {
    const mockRequest = new HttpRequest('GET', '/test');
    const mockResponse = of(new HttpResponse({ body: {} }));

    httpHandler.handle.and.returnValue(mockResponse);

    interceptor.intercept(mockRequest, httpHandler).subscribe(() => {
      expect(httpHandler.handle).toHaveBeenCalledWith(mockRequest);
      done();
    });
  });
});
