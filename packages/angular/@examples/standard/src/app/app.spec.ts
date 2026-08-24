import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideExposesStateProvider } from '@spartan-ng/brain/core';
import { HlmPopoverContent } from '@egose/shadcn-theme-ng/popover';
import { App } from './app';

@Component({
  template: '<h1>Routed component gallery</h1>',
})
class RoutedTestPage {}

describe('App', () => {
  beforeEach(async () => {
    TestBed.overrideDirective(HlmPopoverContent, {
      add: { providers: [provideExposesStateProvider({ state: signal('closed') })] },
    });
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: '', redirectTo: 'gallery', pathMatch: 'full' },
          { path: 'gallery', component: RoutedTestPage },
        ]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the accessible shell and routed content', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/gallery');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('main')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
    expect(compiled.querySelector('h1')?.textContent).toContain('Routed component gallery');
  });
});
