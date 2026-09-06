import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DemoHeaderComponent } from './demo-header';
import { DemoMatrixComponent } from './demo-matrix';
import { DemoSectionComponent } from './demo-section';

@Component({
  standalone: true,
  imports: [DemoHeaderComponent, DemoSectionComponent, DemoMatrixComponent],
  template: `
    <app-demo-header title="Button" description="Buttons submit forms and trigger actions." />

    <app-demo-section title="Primary actions" kicker="Actions" description="Everyday button usage.">
      <button type="button" id="section-content">Visibility marker</button>
    </app-demo-section>

    <app-demo-section title="Dark surface" tone="dark">
      <p id="dark-content">Dark surface content</p>
    </app-demo-section>

    <app-demo-matrix title="Variant matrix" description="Exhaustive variant checks.">
      <span id="matrix-content">matrix rows</span>
    </app-demo-matrix>
  `,
})
class FramingHostComponent {}

describe('Shared demo framing', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FramingHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(FramingHostComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the demo title once as h2 with the behavior description', () => {
    const root = render();
    const headings = root.querySelectorAll('h2');
    expect(headings.length).toBe(1);
    expect(headings[0].textContent?.trim()).toBe('Button');
    expect(root.textContent).toContain('Buttons submit forms and trigger actions.');
  });

  it('renders section titles as h3 (one level below the h2 page title)', () => {
    const root = render();
    const sectionTitles = Array.from(root.querySelectorAll('h3')).map((el) => el.textContent?.trim());
    expect(sectionTitles).toContain('Primary actions');
    expect(sectionTitles).toContain('Dark surface');
    expect(sectionTitles).toContain('Variant matrix');
    expect(root.querySelectorAll('h4').length).toBe(0);
  });

  it('keeps projected package/demo markup visible inside sections and matrices', () => {
    const root = render();
    expect(root.querySelector('#section-content')?.textContent).toContain('Visibility marker');
    expect(root.querySelector('#dark-content')?.textContent).toContain('Dark surface content');
    expect(root.querySelector('#matrix-content')?.textContent).toContain('matrix rows');
  });

  it('gives the matrix a labelled grouping role', () => {
    const root = render();
    const matrix = root.querySelector('app-demo-matrix');
    expect(matrix?.getAttribute('role')).toBe('region');
    expect(matrix?.querySelector('h3')?.textContent?.trim()).toBe('Variant matrix');
  });
});
