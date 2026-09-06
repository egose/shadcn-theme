import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';
import { FormFieldPage, ProfileFormValue } from './form-field';

const VALID_VALUE: ProfileFormValue = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  password: 'engine-note-1843', // pragma: allowlist secret
  age: 36,
  birthday: new Date(1988, 11, 10),
  about: 'I write notes on the analytical engine and its programs.',
  gender: 'female',
  country: 'uk',
  hobbies: ['reading'],
  members: ['doc-brown'],
  agreed: true,
};

function overlayPane(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.cdk-overlay-pane');
}

function overlayButton(text: string): HTMLButtonElement | null {
  const buttons = Array.from(overlayPane()?.querySelectorAll('button') ?? []);
  return buttons.find((button) => button.textContent?.trim() === text) ?? null;
}

async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  // Give simulated latency, dialog open, and overlay close animations time to run.
  await new Promise((resolve) => setTimeout(resolve, 100));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('FormFieldPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('marks fields invalid and opens no dialog when the form is invalid', async () => {
    const fixture = TestBed.createComponent(FormFieldPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmit();
    await settle(fixture);

    expect(component.form.invalid).toBeTrue();
    expect(component.loading()).toBeFalse();
    expect(component.getError('name')).toContain('required');
    expect(component.getError('agreed')).toBeTruthy();
    expect(overlayPane()).toBeNull();
    expect(component.savedProfile()).toBeNull();
  });

  it('preserves every field when reset confirmation is rejected', async () => {
    const fixture = TestBed.createComponent(FormFieldPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const confirmation = TestBed.inject(EgConfirmationDialogService);
    spyOn(confirmation, 'showConfirmationDialog').and.resolveTo(false);

    component.form.setValue(VALID_VALUE);
    await component.onReset();

    expect(component.form.getRawValue()).toEqual(VALID_VALUE);
  });

  it('resets the form when reset confirmation is accepted', async () => {
    const fixture = TestBed.createComponent(FormFieldPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const confirmation = TestBed.inject(EgConfirmationDialogService);
    spyOn(confirmation, 'showConfirmationDialog').and.resolveTo(true);

    const defaults = { ...component.form.getRawValue() };
    component.form.setValue(VALID_VALUE);
    component.savedProfile.set(VALID_VALUE);
    await component.onReset();

    expect(component.form.getRawValue()).toEqual(defaults);
    expect(component.form.getRawValue().name).toBe('');
    expect(component.savedProfile()).toBeNull();
  });

  it('keeps values and records no save when the preview dialog is cancelled', async () => {
    const fixture = TestBed.createComponent(FormFieldPage);
    const component = fixture.componentInstance;
    component.submitLatencyMs = 1;
    fixture.detectChanges();

    component.form.setValue(VALID_VALUE);
    component.onSubmit();
    await settle(fixture);

    const pane = overlayPane();
    expect(pane?.textContent).toContain('Form data');
    expect(pane?.contains(document.activeElement)).withContext('dialog keeps focus inside the overlay pane').toBeTrue();

    overlayButton('Cancel')?.click();
    await settle(fixture);

    expect(overlayPane()).toBeNull();
    expect(component.savedProfile()).toBeNull();
    expect(component.form.getRawValue()).toEqual(VALID_VALUE);
    const status = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="save-status"]');
    expect(status?.textContent).not.toContain('Profile saved');
  });

  it('shows a visible save outcome when the preview dialog is saved', async () => {
    const fixture = TestBed.createComponent(FormFieldPage);
    const component = fixture.componentInstance;
    component.submitLatencyMs = 1;
    fixture.detectChanges();

    component.form.setValue(VALID_VALUE);
    component.onSubmit();
    await settle(fixture);

    overlayButton('Save changes')?.click();
    await settle(fixture);

    expect(overlayPane()).toBeNull();
    expect(component.savedProfile()).toEqual(VALID_VALUE);

    const status = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="save-status"]');
    expect(status?.textContent).toContain('Profile saved for Ada Lovelace (ada@example.com)');
  });
});
