import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupFlowExamplePage } from './signup-flow';

function buttonByText(host: HTMLElement, text: string): HTMLButtonElement {
  const found = Array.from(host.querySelectorAll('button')).find((button) => button.textContent?.trim() === text);
  if (!found) throw new Error(`Expected a "${text}" button`);
  return found as HTMLButtonElement;
}

describe('SignupFlowExamplePage', () => {
  let fixture: ComponentFixture<SignupFlowExamplePage>;
  let host: HTMLElement;
  let page: SignupFlowExamplePage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }).compileComponents();
    fixture = TestBed.createComponent(SignupFlowExamplePage);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
    page = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    document.querySelector('.cdk-overlay-container')?.remove();
  });

  it('lazy-loads through the registry entry', async () => {
    const loaded = await import('./signup-flow').then((m) => m.SignupFlowExamplePage);
    expect(loaded).toBe(SignupFlowExamplePage);
  });

  it('blocks Next on the account step and shows field errors', () => {
    expect(host.querySelector('hlm-error')).toBeNull();

    buttonByText(host, 'Next').click();
    fixture.detectChanges();

    // Still on the account step: the prefs form is not rendered yet.
    expect(host.textContent).not.toContain('Accept terms and conditions');
    const errors = Array.from(host.querySelectorAll('hlm-error')).map((el) => el.textContent);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.join(' ')).toContain('Username is required');
  });

  it('advances once the account step is valid', () => {
    page.accountForm.controls.username.setValue('ada');
    page.accountForm.controls.email.setValue('ada@example.com');
    fixture.detectChanges();

    buttonByText(host, 'Next').click();
    fixture.detectChanges();

    expect(host.textContent).toContain('Accept terms and conditions');
  });

  it('shows the terms-checkbox error on blocked Next without prior touch', () => {
    page.accountForm.controls.username.setValue('ada');
    page.accountForm.controls.email.setValue('ada@example.com');
    fixture.detectChanges();
    buttonByText(host, 'Next').click();
    fixture.detectChanges();

    // Pristine checkbox: no error before attempting to advance.
    expect(host.querySelector('eg-form-checkbox hlm-error')).toBeNull();

    buttonByText(host, 'Next').click();
    fixture.detectChanges();

    // Blocked Next touches the step controls, so the required-terms error
    // surfaces even though the checkbox was never interacted with — and the
    // flow stays on the preferences step.
    expect(host.querySelector('eg-form-checkbox hlm-error')?.textContent).toContain('Accept terms');
    expect(host.textContent).toContain('Accept terms and conditions');
    expect(host.textContent).not.toContain('Account created');
  });

  it('finish marks every step form touched and completes only when all valid', () => {
    page.accountForm.controls.username.setValue('ada');
    page.accountForm.controls.email.setValue('ada@example.com');
    fixture.detectChanges();
    buttonByText(host, 'Next').click();
    fixture.detectChanges();

    page.finish();
    fixture.detectChanges();

    expect(page.completed()).toBeFalse();
    expect(page.prefsForm.touched).toBeTrue();
    expect(host.querySelector('eg-form-checkbox hlm-error')).not.toBeNull();

    page.prefsForm.controls.role.setValue('developer');
    page.prefsForm.controls.acceptTerms.setValue(true);
    page.finish();
    fixture.detectChanges();

    expect(page.completed()).toBeTrue();
    expect(host.textContent).toContain('Account created');
    expect(host.textContent).toContain('ada@example.com');
  });

  it('completes the full flow through the UI', () => {
    page.accountForm.controls.username.setValue('grace');
    page.accountForm.controls.email.setValue('grace@example.com');
    fixture.detectChanges();
    buttonByText(host, 'Next').click();
    fixture.detectChanges();

    page.prefsForm.controls.role.setValue('designer');
    page.prefsForm.controls.acceptTerms.setValue(true);
    fixture.detectChanges();
    buttonByText(host, 'Next').click();
    fixture.detectChanges();

    expect(host.textContent).toContain('grace@example.com');
    buttonByText(host, 'Finish').click();
    fixture.detectChanges();

    expect(host.textContent).toContain('Account created');
  });
});
