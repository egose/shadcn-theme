import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleStateToolbarComponent } from './example-state-toolbar';
import { EXAMPLE_VIEW_STATES, ExampleViewState } from './example-view-state';

@Component({
  imports: [ExampleStateToolbarComponent],
  template: `
    <app-example-state-toolbar
      [(viewState)]="viewState"
      [(readOnly)]="readOnly"
      [(simulateFailure)]="simulateFailure"
    />
  `,
})
class ToolbarHost {
  readonly viewState = signal<ExampleViewState>('loaded');
  readonly readOnly = signal(false);
  readonly simulateFailure = signal(false);
}

describe('ExampleStateToolbarComponent', () => {
  let fixture: ComponentFixture<ToolbarHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }).compileComponents();
    fixture = TestBed.createComponent(ToolbarHost);
    fixture.detectChanges();
  });

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  it('is visibly identified as catalog tooling, outside product-surface semantics', () => {
    const toolbar = host().querySelector('[data-testid="example-state-toolbar"]');
    expect(toolbar).not.toBeNull();
    expect(toolbar?.getAttribute('aria-label')).toContain('Catalog');
    expect(host().querySelector('[data-testid="example-state-toolbar-badge"]')?.textContent).toContain(
      'Catalog tooling',
    );
    expect(toolbar?.textContent).toContain('not part of the product UI');
  });

  it('exposes every required preview state as a pressed-state button', () => {
    expect([...EXAMPLE_VIEW_STATES]).toEqual(['loading', 'empty', 'error', 'loaded']);
    for (const state of EXAMPLE_VIEW_STATES) {
      expect(host().querySelector(`[data-testid="example-state-${state}"]`)).not.toBeNull();
    }
    const loaded = host().querySelector('[data-testid="example-state-loaded"]');
    expect(loaded?.getAttribute('aria-pressed')).toBe('true');
    expect(host().querySelector('[data-testid="example-state-loading"]')?.getAttribute('aria-pressed')).toBe('false');
  });

  it('writes the selected state back to the owning page', () => {
    (host().querySelector('[data-testid="example-state-error"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.viewState()).toBe('error');
    expect(host().querySelector('[data-testid="example-state-error"]')?.getAttribute('aria-pressed')).toBe('true');
  });

  it('toggles read-only and simulated-failure controls', () => {
    const readOnly = host().querySelector('[data-testid="example-state-readonly"]') as HTMLInputElement;
    readOnly.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.readOnly()).toBeTrue();

    const failure = host().querySelector('[data-testid="example-state-simulate-failure"]') as HTMLInputElement;
    failure.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.simulateFailure()).toBeTrue();
  });

  it('reflects externally driven state changes', () => {
    fixture.componentInstance.viewState.set('loading');
    fixture.componentInstance.readOnly.set(true);
    fixture.detectChanges();
    expect(host().querySelector('[data-testid="example-state-loading"]')?.getAttribute('aria-pressed')).toBe('true');
    expect((host().querySelector('[data-testid="example-state-readonly"]') as HTMLInputElement).checked).toBeTrue();
  });
});
