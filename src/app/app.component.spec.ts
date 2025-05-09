import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { LoaderComponent } from './components/loader/loader.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LoaderInterceptor } from './interceptor/loader.interceptor';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let renderer: Renderer2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, LoaderComponent],
      imports: [
        BrowserModule,
        HttpClientModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoaderInterceptor,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    renderer = fixture.componentRef.injector.get(Renderer2);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with light theme', () => {
    const body = document.body;
    expect(body.classList.contains('light-theme')).toBeTrue();
  });

  it('should toggle to dark theme when toggleTheme is called', () => {
    const body = document.body;
    spyOn(renderer, 'addClass').and.callThrough();
    spyOn(renderer, 'removeClass').and.callThrough();

    component.toggleTheme();

    expect(component.isDarkMode).toBeTrue();
    expect(renderer.removeClass).toHaveBeenCalledWith(body, 'light-theme');
    expect(renderer.addClass).toHaveBeenCalledWith(body, 'dark-theme');
    expect(body.classList.contains('dark-theme')).toBeTrue();
    expect(body.classList.contains('light-theme')).toBeFalse();
  });

  it('should toggle back to light theme when toggleTheme is called again', () => {
    const body = document.body;
    spyOn(renderer, 'addClass').and.callThrough();
    spyOn(renderer, 'removeClass').and.callThrough();

    component.toggleTheme();
    component.toggleTheme();

    expect(component.isDarkMode).toBeFalse();
    expect(renderer.removeClass).toHaveBeenCalledWith(body, 'dark-theme');
    expect(renderer.addClass).toHaveBeenCalledWith(body, 'light-theme');
    expect(body.classList.contains('light-theme')).toBeTrue();
    expect(body.classList.contains('dark-theme')).toBeFalse();
  });

  it('should render the toolbar with the correct title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toolbar = compiled.querySelector('mat-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar?.textContent).toContain('Currency Dashboard');
  });

  it('should display the correct icon based on the theme', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('mat-icon');

    expect(icon?.textContent?.trim()).toBe('dark_mode');

    component.toggleTheme();
    fixture.detectChanges();

    const updatedIcon = compiled.querySelector('mat-icon');
    expect(updatedIcon?.textContent?.trim()).toBe('light_mode');
  });
});
