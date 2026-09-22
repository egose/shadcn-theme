import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HlmButton, buttonVariants, type AppearanceType, type VariantType } from '@egose/shadcn-theme-ng/button';
import { hlm } from '@egose/shadcn-theme-ng/utils';

@Component({
  imports: [HlmButton],
  template: `
    <section>
      <button
        hlmButton
        [variant]="variant()"
        [appearance]="appearance()"
        [loading]="loading()"
        [class]="customClass()"
        [spinnerUserClass]="spinnerClass()"
        style="transition: none"
      >
        Save
      </button>
    </section>
  `,
})
class ThemeHost {
  readonly variant = signal<VariantType>('primary');
  readonly appearance = signal<AppearanceType>('solid');
  readonly loading = signal(false);
  readonly customClass = signal('');
  readonly spinnerClass = signal('');
}

// These browser tests use the example's real Tailwind stylesheet, checking resolved
// colors rather than only asserting that the component emits utility class names.
describe('Button consumer theming', () => {
  let fixture: ComponentFixture<ThemeHost>;
  let scope: HTMLElement;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(ThemeHost);
    fixture.detectChanges();
    await fixture.whenStable();
    scope = fixture.nativeElement.querySelector('section');
    button = scope.querySelector('button')!;
  });

  it('switches every semantic tone with a scoped dark theme', () => {
    const tones: VariantType[] = [
      'primary',
      'secondary',
      'success',
      'warning',
      'danger',
      'info',
      'light',
      'dark',
      'accent',
      'destructive',
      'muted',
    ];
    for (const tone of tones) {
      fixture.componentInstance.variant.set(tone);
      fixture.detectChanges();
      scope.classList.remove('dark');
      const light = getComputedStyle(button).backgroundColor;
      scope.classList.add('dark');
      const dark = getComputedStyle(button).backgroundColor;
      expect(light).withContext(`${tone} light background`).not.toBe('rgba(0, 0, 0, 0)');
      expect(dark).withContext(`${tone} dark background`).not.toBe('rgba(0, 0, 0, 0)');
      expect(dark).withContext(`${tone} switches with its ancestor`).not.toBe(light);
    }
  });

  it('uses the theme surface for both outline appearances and the legacy outline variant', () => {
    for (const appearance of ['outline', 'outline-filled'] as const) {
      fixture.componentInstance.appearance.set(appearance);
      fixture.detectChanges();
      scope.classList.remove('dark');
      expect(getComputedStyle(button).backgroundColor).toBe('rgb(255, 255, 255)');
      scope.classList.add('dark');
      expect(getComputedStyle(button).backgroundColor).toBe('rgb(10, 10, 10)');
    }
    fixture.componentInstance.appearance.set('solid');
    fixture.componentInstance.variant.set('outline');
    fixture.detectChanges();
    expect(getComputedStyle(button).backgroundColor).toBe('rgb(10, 10, 10)');
  });

  it('combines semantic colors with borderless, transparent ghost and link appearances', () => {
    fixture.componentInstance.variant.set('success');
    for (const appearance of ['ghost', 'link'] as const) {
      fixture.componentInstance.appearance.set(appearance);
      fixture.detectChanges();
      const style = getComputedStyle(button);
      expect(style.color).toBe('rgb(40, 167, 69)');
      expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(style.borderTopWidth).toBe('0px');
      // Tailwind's shadow-none may serialize as a zero-size transparent shadow.
      expect(style.boxShadow === 'none' || style.boxShadow.includes('rgba(0, 0, 0, 0)')).toBeTrue();
    }
  });

  it('resolves custom subtree tokens in every appearance and its loading spinner', async () => {
    scope.style.setProperty('--primary', '#123456');
    scope.style.setProperty('--primary-foreground', '#fedcba');
    fixture.componentInstance.loading.set(true);
    for (const appearance of ['solid', 'outline', 'outline-filled', 'ghost', 'link'] as const) {
      fixture.componentInstance.appearance.set(appearance);
      fixture.detectChanges();
      await fixture.whenStable();
      const expected = appearance === 'solid' ? 'rgb(254, 220, 186)' : 'rgb(18, 52, 86)';
      expect(getComputedStyle(button).color).withContext(appearance).toBe(expected);
      const spinner = button.querySelector('hlm-spinner svg')!;
      expect(spinner).not.toBeNull();
      expect(getComputedStyle(spinner).color).withContext(`${appearance} spinner`).toBe(expected);
    }
  });

  it('honors consumer text overrides after appearance styles and supports a separate spinner tint', async () => {
    fixture.componentInstance.appearance.set('outline');
    fixture.componentInstance.customClass.set('tw:text-danger');
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(getComputedStyle(button).color).toBe('rgb(220, 53, 69)');
    expect(getComputedStyle(button.querySelector('hlm-spinner svg')!).color).toBe('rgb(220, 53, 69)');

    fixture.componentInstance.spinnerClass.set('tw:[&>svg]:text-info');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(getComputedStyle(button.querySelector('hlm-spinner svg')!).color).toBe('rgb(23, 162, 184)');
  });

  it('gives custom hosts the same appearance styles through the public variant function', () => {
    const customHost = document.createElement('button');
    customHost.style.transition = 'none';
    scope.append(customHost);
    fixture.componentInstance.variant.set('danger');
    for (const appearance of ['solid', 'outline', 'outline-filled', 'ghost', 'link'] as const) {
      fixture.componentInstance.appearance.set(appearance);
      fixture.detectChanges();
      customHost.className = hlm(buttonVariants({ variant: 'danger', appearance }));
      const actual = getComputedStyle(customHost);
      const expected = getComputedStyle(button);
      for (const property of ['color', 'background-color', 'border-top-color', 'border-top-width', 'box-shadow']) {
        expect(actual.getPropertyValue(property))
          .withContext(`${appearance} ${property}`)
          .toBe(expected.getPropertyValue(property));
      }
    }
  });
});
