import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';

@Component({
  template: '<h1>Routed component gallery</h1>',
})
class RoutedTestPage {}

describe('App', () => {
  beforeEach(async () => {
    // No synthetic overlay providers here: the shell (including the header
    // search popover) must construct from its real imports. ANGEX-08 fixed a
    // missing popover-portal composition that crashed shell creation.
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

  it('renders exactly one main landmark with header and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/gallery');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('main').length).toBe(1);
    expect(compiled.querySelector('header')).not.toBeNull();
    expect(compiled.querySelector('footer')).not.toBeNull();
  });

  it('names the icon-only shell triggers and tracks mobile menu expansion', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/gallery');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const sidebarTrigger = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="eg-layout-simple-sidebar"]',
    );
    const mobileTrigger = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="eg-layout-simple-mobile-menu"]',
    );
    expect(sidebarTrigger?.getAttribute('aria-label')).withContext('sidebar trigger').toBeTruthy();
    expect(mobileTrigger?.getAttribute('aria-label')).withContext('mobile trigger').toBeTruthy();
    expect(sidebarTrigger!.getAttribute('aria-label')).not.toBe(mobileTrigger!.getAttribute('aria-label'));
    expect(sidebarTrigger?.getAttribute('aria-expanded')).toBe('false');
    expect(mobileTrigger?.getAttribute('aria-expanded')).toBe('false');
  });
});
