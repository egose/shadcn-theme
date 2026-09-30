import { APP_ID, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { configureLibraryTestBed } from '../../../../test/setup';
import { HlmCheckbox } from './checkbox';

@Component({
  imports: [HlmCheckbox],
  template: `
    <label><hlm-checkbox />Alpha</label>
    <label><hlm-checkbox />Beta</label>
    <label id="existing-label"><hlm-checkbox [id]="id()" />Explicit</label>
  `,
})
class LabelsHost {
  readonly id = signal<string | null>('explicit-checkbox');
}

@Component({
  imports: [HlmCheckbox, ReactiveFormsModule, FormsModule],
  template: `
    <hlm-checkbox
      [formControl]="control"
      [disabled]="disabled()"
      [wrapperDisabled]="wrapperDisabled()"
      (changed)="changes.push($event)"
      aria-label="Reactive"
    />
    <hlm-checkbox [(ngModel)]="value" aria-label="Template driven" />
  `,
})
class FormsHost {
  readonly control = new FormControl<boolean | 'indeterminate'>('indeterminate');
  readonly disabled = signal(false);
  readonly wrapperDisabled = signal(false);
  readonly changes: boolean[] = [];
  readonly value = signal<boolean | 'indeterminate'>('indeterminate');
}

describe('HlmCheckbox native state', () => {
  let fixture: ComponentFixture<HlmCheckbox>;
  const button = () => fixture.nativeElement.querySelector('button[role="checkbox"]') as HTMLButtonElement;
  const state = (aria: string, data: string) => {
    expect(button().getAttribute('aria-checked')).toBe(aria);
    expect(button().getAttribute('data-state')).toBe(data);
  };

  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [HlmCheckbox] }).compileComponents();
    fixture = TestBed.createComponent(HlmCheckbox);
  });
  afterEach(() => fixture.destroy());

  it('renders mixed, checked and unchecked inputs and resolves mixed clicks to true', async () => {
    const changed = jasmine.createSpy('changed');
    const onChange = jasmine.createSpy('onChange');
    fixture.componentInstance.changed.subscribe(changed);
    fixture.componentInstance.registerOnChange(onChange);
    fixture.componentRef.setInput('checked', 'indeterminate');
    await fixture.whenStable();
    state('mixed', 'indeterminate');
    button().click();
    await fixture.whenStable();
    state('true', 'checked');
    expect(fixture.componentInstance.checked()).toBeTrue();
    button().click();
    await fixture.whenStable();
    state('false', 'unchecked');
    expect(changed.calls.allArgs()).toEqual([[true], [false]]);
    expect(onChange.calls.allArgs()).toEqual([[true], [false]]);
    for (const value of [true, 'indeterminate', false, 'indeterminate'] as const) {
      fixture.componentRef.setInput('checked', value);
      await fixture.whenStable();
      state(
        value === 'indeterminate' ? 'mixed' : String(value),
        value === 'indeterminate' ? value : value ? 'checked' : 'unchecked',
      );
    }
    expect(changed).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('preserves mixed CVA writes and clears null without user notifications', async () => {
    const changed = jasmine.createSpy('changed');
    const onChange = jasmine.createSpy('onChange');
    const touched = jasmine.createSpy('touched');
    fixture.componentInstance.changed.subscribe(changed);
    fixture.componentInstance.registerOnChange(onChange);
    fixture.componentInstance.registerOnTouched(touched);
    fixture.componentInstance.writeValue('indeterminate');
    await fixture.whenStable();
    expect(fixture.componentInstance.checked()).toBe('indeterminate');
    state('mixed', 'indeterminate');
    fixture.componentInstance.writeValue(true);
    await fixture.whenStable();
    state('true', 'checked');
    fixture.componentInstance.writeValue(false);
    await fixture.whenStable();
    state('false', 'unchecked');
    fixture.componentInstance.writeValue('indeterminate');
    await fixture.whenStable();
    state('mixed', 'indeterminate');
    fixture.componentInstance.writeValue(null);
    await fixture.whenStable();
    state('false', 'unchecked');
    expect(changed).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(touched).not.toHaveBeenCalled();
  });
});

describe('HlmCheckbox label identity', () => {
  beforeEach(() => configureLibraryTestBed([{ provide: APP_ID, useValue: 'checkbox-test' }]));

  it('gives nested labels distinct own names and preserves explicit control/label IDs', async () => {
    const fixture = TestBed.createComponent(LabelsHost);
    await fixture.whenStable();
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button[role="checkbox"]'),
    ) as HTMLButtonElement[];
    const labels = Array.from(fixture.nativeElement.querySelectorAll('label')) as HTMLLabelElement[];
    expect(new Set(labels.map((label) => label.id)).size).toBe(3);
    expect(new Set(buttons.map((button) => button.id)).size).toBe(3);
    buttons.forEach((button, index) => {
      expect(button.id).not.toBe('');
      expect(document.getElementById(button.getAttribute('aria-labelledby')!)).toBe(labels[index]);
      expect(button.labels?.[0]).toBe(labels[index]);
    });
    expect(buttons[2].id).toBe('explicit-checkbox');
    expect(labels[2].id).toBe('existing-label');
    const firstId = buttons[0].id;
    fixture.componentInstance.id.set(null);
    await fixture.whenStable();
    const fallback = buttons[2].id;
    expect(fallback).toMatch(/^hlm-checkbox-checkbox-test-\d+$/);
    fixture.componentInstance.id.set('replacement');
    await fixture.whenStable();
    expect(buttons[2].id).toBe('replacement');
    fixture.componentInstance.id.set(null);
    await fixture.whenStable();
    expect(buttons[2].id).toBe(fallback);
    expect(buttons[0].id).toBe(firstId);
    expect(buttons[2].getAttribute('aria-labelledby')).toBe('existing-label');
    fixture.destroy();
  });

  it('restarts fallback IDs per application and reproduces them for matching APP_ID and creation order', async () => {
    const render = async (appId: string) => {
      TestBed.resetTestingModule();
      configureLibraryTestBed([{ provide: APP_ID, useValue: appId }]);
      const fixture = TestBed.createComponent(LabelsHost);
      await fixture.whenStable();
      const ids = Array.from(
        fixture.nativeElement.querySelectorAll('button[role="checkbox"]') as NodeListOf<HTMLButtonElement>,
      ).map((button) => button.id);
      fixture.destroy();
      return ids;
    };
    const first = await render('first-app');
    expect(first).toEqual(['hlm-checkbox-first-app-0', 'hlm-checkbox-first-app-1', 'explicit-checkbox']);
    expect(await render('first-app')).toEqual(first);
    expect(await render('second-app')).toEqual([
      'hlm-checkbox-second-app-0',
      'hlm-checkbox-second-app-1',
      'explicit-checkbox',
    ]);
  });
});

describe('HlmCheckbox forms', () => {
  let fixture: ComponentFixture<FormsHost>;
  const buttons = () =>
    Array.from(fixture.nativeElement.querySelectorAll('button[role="checkbox"]')) as HTMLButtonElement[];
  beforeEach(async () => {
    configureLibraryTestBed();
    fixture = TestBed.createComponent(FormsHost);
    await fixture.whenStable();
  });
  afterEach(() => fixture.destroy());

  it('binds reactive forms and ngModel mixed writes, boolean user edits and resets', async () => {
    const host = fixture.componentInstance;
    expect(buttons().map((button) => button.getAttribute('aria-checked'))).toEqual(['mixed', 'mixed']);
    buttons().forEach((button) => button.click());
    await fixture.whenStable();
    expect(host.control.value).toBeTrue();
    expect(host.control.touched).toBeTrue();
    expect(host.value()).toBeTrue();
    expect(host.changes).toEqual([true]);
    host.control.setValue('indeterminate');
    host.value.set('indeterminate');
    await fixture.whenStable();
    expect(host.value()).withContext('parent ngModel value after external write').toBe('indeterminate');
    expect(fixture.debugElement.queryAll(By.directive(HlmCheckbox))[1].componentInstance.checked())
      .withContext('ngModel CVA value after external write')
      .toBe('indeterminate');
    expect(buttons().map((button) => button.getAttribute('aria-checked'))).toEqual(['mixed', 'mixed']);
    host.control.reset();
    await fixture.whenStable();
    expect(host.control.value).toBeNull();
    expect(host.control.touched).toBeFalse();
    expect(buttons()[0].getAttribute('aria-checked')).toBe('false');
    expect(host.changes).toEqual([true]);
  });

  for (const lock of ['disabled', 'wrapperDisabled', 'form'] as const) {
    it(`blocks mixed clicks while ${lock} is locked and selects after unlocking`, async () => {
      const host = fixture.componentInstance;
      if (lock === 'form') host.control.disable();
      else host[lock].set(true);
      await fixture.whenStable();
      expect(buttons()[0].disabled).toBeTrue();
      expect(buttons()[0].getAttribute('aria-checked')).toBe('mixed');
      buttons()[0].click();
      await fixture.whenStable();
      expect(host.control.value).toBe('indeterminate');
      expect(host.control.touched).toBeFalse();
      expect(host.changes).toEqual([]);
      if (lock === 'form') host.control.enable();
      else host[lock].set(false);
      await fixture.whenStable();
      expect(buttons()[0].disabled).toBeFalse();
      buttons()[0].click();
      await fixture.whenStable();
      expect(host.control.value).toBeTrue();
      expect(host.changes).toEqual([true]);
    });
  }
});
