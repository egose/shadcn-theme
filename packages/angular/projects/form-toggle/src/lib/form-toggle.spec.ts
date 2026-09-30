import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { configureLibraryTestBed } from '../../../../test/setup';
import { expectDescriptions } from '../../../../test/validation-descriptions';
import { EgFormToggle } from './form-toggle';
import { provideEgFormToggleConfig } from './form-toggle.token';

@Component({
  imports: [ReactiveFormsModule, EgFormToggle],
  template: `<form [formGroup]="form">
    <eg-form-toggle
      formControlName="value"
      label="Notifications"
      [id]="id()"
      [disabled]="disabled()"
      error="Read the policy first"
      [hint]="hint()"
      [aria-describedby]="descriptions()"
      required
    />
    <p id="notify-external">External notification instructions</p>
    <p id="notify-other">Other notification instructions</p>
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl(false, Validators.requiredTrue) });
  readonly id = signal<string | undefined>('notify');
  readonly disabled = signal(false);
  readonly hint = signal<string | undefined>('Toggle to subscribe');
  readonly descriptions = signal<string | null>(null);
}

@Component({
  imports: [ReactiveFormsModule, EgFormToggle],
  template: `<form [formGroup]="form">
    <eg-form-toggle
      formControlName="value"
      label="Notifications"
      [labelClass]="labelClass()"
      [toggleClass]="toggleClass()"
    />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl(false) });
  readonly labelClass = signal('');
  readonly toggleClass = signal('');
}

describe('EgFormToggle', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  for (const interaction of ['touch', 'submit'] as const) {
    it(`describes the actual button through settled ${interaction}, correction and reset`, async () => {
      await fixture.whenStable();
      const host = fixture.componentInstance;
      const control = host.form.controls.value;
      const button = fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
      const directive = fixture.debugElement.query(By.directive(FormGroupDirective)).injector.get(FormGroupDirective);
      const expectHint = () => {
        expectDescriptions([button], ['notify-hint']);
        expect(document.getElementById('notify-error')).toBeNull();
        expect(button.getAttribute('aria-invalid')).not.toBe('true');
      };
      const expectError = () => {
        expectDescriptions([button], ['notify-error']);
        expect(document.getElementById('notify-hint')).toBeNull();
        expect(button.getAttribute('aria-invalid')).toBe('true');
      };
      expect(control.value).toBeFalse();
      expect(control.invalid).toBeTrue();
      expect(control.untouched).toBeTrue();
      expect(control.pristine).toBeTrue();
      expectHint();
      button.focus();
      expect(document.activeElement).toBe(button);
      expect(button.labels?.[0].htmlFor).toBe(button.id);
      expect(button.labels?.[0].textContent).toContain('Notifications');
      expect(button.getAttribute('aria-pressed')).toBe('false');
      button.blur();

      if (interaction === 'touch') host.form.markAllAsTouched();
      else
        fixture.nativeElement
          .querySelector('form')
          .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await fixture.whenStable();
      expect(control.value).toBeFalse();
      expect(control.invalid).toBeTrue();
      if (interaction === 'submit') {
        expect(directive.submitted).toBeTrue();
        expect(control.untouched).toBeTrue();
        expect(control.pristine).toBeTrue();
      }
      expectError();

      directive.resetForm({ value: false });
      await fixture.whenStable();
      expect(control.invalid).toBeTrue();
      expect(control.untouched).toBeTrue();
      expect(control.pristine).toBeTrue();
      expectHint();

      host.form.markAllAsTouched();
      await fixture.whenStable();
      expectError();
      button.click();
      await fixture.whenStable();
      expect(control.value).toBeTrue();
      expect(control.valid).toBeTrue();
      expect(button.getAttribute('aria-pressed')).toBe('true');
      expectHint();
      directive.resetForm({ value: false });
      await fixture.whenStable();
      expect(control.invalid).toBeTrue();
      expect(control.untouched).toBeTrue();
      expect(control.pristine).toBeTrue();
      expect(button.getAttribute('aria-pressed')).toBe('false');
      expectHint();
    });
  }

  it('aligns explicit/generated IDs, label, error, and hint', () => {
    const control = () => fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
    expect(control().id).toBe('notify');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('notify');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error').textContent).toContain('Read the policy first');
    fixture.componentInstance.form.controls.value.setValue(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-hint').textContent).toContain('Toggle to subscribe');
    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(control().id).toMatch(/^eg-form-toggle-.+-\d+$/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(control().id);
  });

  it('preserves consumer IDs across errors, correction, reset and changing control IDs', async () => {
    await fixture.whenStable();
    const host = fixture.componentInstance;
    const button = fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
    host.descriptions.set(' notify-external  notify-external\tnotify-other ');
    await fixture.whenStable();
    expectDescriptions([button], ['notify-external', 'notify-other', 'notify-hint']);
    host.form.markAllAsTouched();
    await fixture.whenStable();
    expectDescriptions([button], ['notify-external', 'notify-other', 'notify-error']);
    expect(document.getElementById('notify-hint')).toBeNull();
    expect(button.getAttribute('aria-invalid')).toBe('true');

    host.id.set('renamed-notify');
    host.hint.set(undefined);
    await fixture.whenStable();
    expectDescriptions([button], ['notify-external', 'notify-other', 'renamed-notify-error']);
    expect(document.getElementById('notify-error')).toBeNull();
    expect(button.labels?.[0].htmlFor).toBe('renamed-notify');
    expect(button.labels?.[0].textContent).toContain('Notifications');
    host.form.controls.value.setValue(true);
    await fixture.whenStable();
    expectDescriptions([button], ['notify-external', 'notify-other']);
    expect(document.getElementById('renamed-notify-error')).toBeNull();
    expect(button.getAttribute('aria-invalid')).toBeNull();

    host.form.reset({ value: false });
    host.hint.set('Restored notification hint');
    await fixture.whenStable();
    expectDescriptions([button], ['notify-external', 'notify-other', 'renamed-notify-hint']);
    expect(button.getAttribute('aria-invalid')).toBeNull();
    host.descriptions.set('notify-other');
    await fixture.whenStable();
    expectDescriptions([button], ['notify-other', 'renamed-notify-hint']);
    host.descriptions.set(null);
    await fixture.whenStable();
    expectDescriptions([button], ['renamed-notify-hint']);
  });

  it('removes conditional hint references and the attribute when no descriptions remain', async () => {
    await fixture.whenStable();
    const host = fixture.componentInstance;
    const button = fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
    host.hint.set(undefined);
    await fixture.whenStable();
    expectDescriptions([button], []);
    expect(document.getElementById('notify-hint')).toBeNull();
    host.descriptions.set('notify-external');
    await fixture.whenStable();
    expectDescriptions([button], ['notify-external']);
    host.hint.set('Restored notification hint');
    await fixture.whenStable();
    expectDescriptions([button], ['notify-external', 'notify-hint']);
    host.id.set(undefined);
    await fixture.whenStable();
    expectDescriptions([button], ['notify-external', `${button.id}-hint`]);
    expect(button.labels?.[0].htmlFor).toBe(button.id);
    expect(document.getElementById('notify-hint')).toBeNull();
    host.hint.set('');
    host.descriptions.set(' \t ');
    await fixture.whenStable();
    expectDescriptions([button], []);
    expect(fixture.nativeElement.querySelector('hlm-hint')).toBeNull();
    expect(button.getAttribute('aria-invalid')).toBeNull();
  });

  for (const interaction of ['touched', 'dirty'] as const) {
    it(`updates settled invalid feedback on ${interaction}-only changes and reset`, async () => {
      await fixture.whenStable();
      const form = fixture.componentInstance.form;
      const control = form.controls.value;
      const values: unknown[] = [];
      const statuses: string[] = [];
      const valueSub = control.valueChanges.subscribe((value) => values.push(value));
      const statusSub = control.statusChanges.subscribe((status) => statuses.push(status));
      try {
        expect(control.value).toBeFalse();
        expect(control.status).toBe('INVALID');
        expect(control.untouched).toBeTrue();
        expect(control.pristine).toBeTrue();
        expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();
        expect(fixture.nativeElement.querySelector('hlm-hint')?.textContent).toContain('Toggle to subscribe');

        if (interaction === 'touched') form.markAllAsTouched();
        else control.markAsDirty();
        await fixture.whenStable();

        expect(control.value).toBeFalse();
        expect(control.status).toBe('INVALID');
        expect(values).toEqual([]);
        expect(statuses).toEqual([]);
        expect(fixture.nativeElement.querySelector('hlm-error')?.textContent).toContain('Read the policy first');
        expect(fixture.nativeElement.querySelector('hlm-hint')).toBeNull();

        form.reset({ value: false });
        await fixture.whenStable();

        expect(control.value).toBeFalse();
        expect(control.status).toBe('INVALID');
        expect(control.untouched).toBeTrue();
        expect(control.pristine).toBeTrue();
        expect(values).toEqual([false]);
        expect(statuses).toEqual(['INVALID']);
        expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();
        expect(fixture.nativeElement.querySelector('hlm-hint')?.textContent).toContain('Toggle to subscribe');
      } finally {
        valueSub.unsubscribe();
        statusSub.unsubscribe();
      }
    });
  }

  it('keeps errors until both touched and dirty are cleared without value or status events', async () => {
    await fixture.whenStable();
    const control = fixture.componentInstance.form.controls.value;
    control.markAsTouched();
    control.markAsDirty();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('hlm-error')?.textContent).toContain('Read the policy first');
    control.markAsUntouched();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('hlm-error')?.textContent).toContain('Read the policy first');
    control.markAsPristine();
    await fixture.whenStable();
    expect(control.invalid).toBeTrue();
    expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('hlm-hint')?.textContent).toContain('Toggle to subscribe');
  });

  it('shows submit-only errors and restores the hint on invalid-to-invalid resetForm', async () => {
    await fixture.whenStable();
    const control = fixture.componentInstance.form.controls.value;
    const directive = fixture.debugElement.query(By.directive(FormGroupDirective)).injector.get(FormGroupDirective);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(directive.submitted).toBeTrue();
    expect(control.untouched).toBeTrue();
    expect(control.pristine).toBeTrue();
    expect(control.value).toBeFalse();
    expect(control.invalid).toBeTrue();
    expect(fixture.nativeElement.querySelector('hlm-error')?.textContent).toContain('Read the policy first');
    expect(fixture.nativeElement.querySelector('hlm-hint')).toBeNull();
    directive.resetForm({ value: false });
    await fixture.whenStable();
    expect(directive.submitted).toBeFalse();
    expect(control.untouched).toBeTrue();
    expect(control.pristine).toBeTrue();
    expect(control.value).toBeFalse();
    expect(control.invalid).toBeTrue();
    expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('hlm-hint')?.textContent).toContain('Toggle to subscribe');
  });

  it('refreshes silent interaction changes on the next change-detection pass', async () => {
    await fixture.whenStable();
    const control = fixture.componentInstance.form.controls.value;
    control.markAsTouched({ emitEvent: false });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error')?.textContent).toContain('Read the policy first');
    control.reset(false, { emitEvent: false });
    fixture.detectChanges();
    expect(control.value).toBeFalse();
    expect(control.invalid).toBeTrue();
    expect(control.untouched).toBeTrue();
    expect(control.pristine).toBeTrue();
    expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('hlm-hint')?.textContent).toContain('Toggle to subscribe');
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const control = () => fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    control().click();
    expect(fixture.componentInstance.form.controls.value.value).toBeFalse();
    expect(fixture.componentInstance.form.controls.value.untouched).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    control().click();
    expect(fixture.componentInstance.form.controls.value.value).toBeFalse();
    expect(fixture.componentInstance.form.controls.value.untouched).toBeTrue();
    fixture.componentInstance.form.controls.value.enable();
    fixture.detectChanges();
    expect(control().disabled).toBeFalse();
    control().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.value.value).toBeTrue();
    expect(fixture.componentInstance.form.controls.value.touched).toBeTrue();
    expect(fixture.componentInstance.form.controls.value.dirty).toBeTrue();
  });

  it('writes toggle changes back to the control', () => {
    const control = () => fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
    control().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.value.value).toBeTrue();
  });
});

describe('EgFormToggle global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormToggleConfig({ labelClass: 'tw:text-xs', toggleClass: 'tw:text-xs' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const control = () => fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
    expect(label().className).toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-xs');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.toggleClass.set('tw:text-lg');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-lg');
    expect(control().className).not.toContain('tw:text-xs');
  });
});
