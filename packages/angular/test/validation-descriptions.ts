import { ComponentFixture } from '@angular/core/testing';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';

/** Assert the relationship on the interactive element, including portaled controls. */
export function expectDescriptions(controls: HTMLElement[], ids: string[]): void {
  expect(controls.length).toBeGreaterThan(0);
  for (const control of controls) {
    const actual = control.getAttribute('aria-describedby');
    expect(actual).toBe(ids.length ? ids.join(' ') : null);
    for (const id of (actual ?? '').split(/\s+/).filter(Boolean)) {
      const target = document.getElementById(id);
      expect(target).withContext(`description ${id} resolves`).not.toBeNull();
      expect(target?.textContent?.trim()).withContext(`description ${id} has text`).toBeTruthy();
    }
  }
}

export async function verifyValidationDescriptions<T>(
  fixture: ComponentFixture<T>,
  controls: () => HTMLElement[],
  control: AbstractControl,
  validValue: unknown,
  interaction: 'touch' | 'submit',
  checkFocus = true,
  invalidControls = controls,
): Promise<void> {
  await fixture.whenStable();
  fixture.detectChanges();
  const hintId = (fixture.nativeElement.querySelector('hlm-hint') as HTMLElement).id;
  const errorId = hintId.replace(/-hint$/, '-error');
  expectDescriptions(controls(), [hintId]);
  expect(document.getElementById(errorId)).toBeNull();
  expect(control.invalid).toBeTrue();

  for (const element of checkFocus ? controls() : []) {
    element.focus();
    expect(document.activeElement).toBe(element);
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      expect(document.getElementById(labelledBy)?.textContent?.trim()).toBeTruthy();
    } else {
      expect((element as HTMLInputElement).labels?.length).toBeGreaterThan(0);
    }
    element.blur();
  }
  await fixture.whenStable();
  // Focus/blur can touch CVAs; start each validation path from a settled pristine field.
  control.markAsUntouched();
  control.markAsPristine();
  fixture.detectChanges();
  expect(control.untouched).toBeTrue();
  expectDescriptions(controls(), [hintId]);
  if (interaction === 'touch') control.markAllAsTouched();
  else
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  expectDescriptions(controls(), [errorId]);
  for (const element of invalidControls()) expect(element.getAttribute('aria-invalid')).toBe('true');

  // Reset while still invalid, with no intervening valid value/status transition.
  const form = fixture.debugElement.query(By.directive(FormGroupDirective)).injector.get(FormGroupDirective);
  if (interaction === 'submit') {
    expect(form.submitted).toBeTrue();
    expect(control.untouched).toBeTrue();
  }
  form.resetForm();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  expect(control.invalid).toBeTrue();
  expect(control.untouched).toBeTrue();
  expectDescriptions(controls(), [hintId]);
  expect(document.getElementById(errorId)).toBeNull();
  control.markAllAsTouched();
  fixture.detectChanges();
  expectDescriptions(controls(), [errorId]);

  control.setValue(validValue);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  expect(control.valid).toBeTrue();
  expectDescriptions(controls(), [hintId]);
  expect(document.getElementById(errorId)).toBeNull();
  for (const element of controls()) expect(element.getAttribute('aria-invalid')).not.toBe('true');

  form.resetForm();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  expect(control.untouched).toBeTrue();
  expect(control.pristine).toBeTrue();
  expectDescriptions(controls(), [hintId]);
  expect(document.getElementById(errorId)).toBeNull();
}
