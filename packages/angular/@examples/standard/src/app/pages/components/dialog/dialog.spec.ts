import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogPage } from './dialog';

function overlayPane(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.cdk-overlay-pane');
}

function overlayButton(text: string): HTMLButtonElement | null {
  const buttons = Array.from(overlayPane()?.querySelectorAll('button') ?? []);
  return buttons.find((button) => button.textContent?.trim() === text) ?? null;
}

function setInputValue(selector: string, value: string): void {
  const input = overlayPane()?.querySelector<HTMLInputElement>(selector);
  expect(input).withContext(`${selector} should exist`).not.toBeNull();
  input!.value = value;
  input!.dispatchEvent(new Event('input', { bubbles: true }));
}

async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('DialogPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('shows validation errors and stays open on an invalid save', async () => {
    const fixture = TestBed.createComponent(DialogPage);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    await settle(fixture);

    expect(overlayPane()?.textContent).toContain('Edit profile');

    setInputValue('#dialog-display-name', '');
    overlayButton('Save changes')?.click();
    await settle(fixture);

    expect(overlayPane()?.querySelector('[data-testid="dialog-display-name-error"]')?.textContent).toContain(
      'Display name is required',
    );
    expect(overlayPane()).not.toBeNull('dialog stays open on validation failure');
    expect(fixture.componentInstance.savedProfile()).toBeNull();
  });

  it('saves edited values once and shows a visible saved outcome', async () => {
    const fixture = TestBed.createComponent(DialogPage);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    await settle(fixture);

    expect(overlayPane()?.contains(document.activeElement)).withContext('focus is moved into the dialog').toBeTrue();

    setInputValue('#dialog-display-name', 'Grace Hopper');
    setInputValue('#dialog-email', 'grace@example.com');
    overlayButton('Save changes')?.click();
    await settle(fixture);

    expect(overlayPane()).toBeNull();
    expect(fixture.componentInstance.savedProfile()).toEqual({
      displayName: 'Grace Hopper',
      email: 'grace@example.com',
    });
    const status = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="dialog-status"]');
    expect(status?.textContent).toContain('Saved profile: Grace Hopper (grace@example.com)');

    overlayButton('Save changes')?.click();
    await settle(fixture);
    expect(fixture.componentInstance.savedProfile()?.displayName).toBe('Grace Hopper');
  });

  it('shows a visible cancellation outcome when cancelled', async () => {
    const fixture = TestBed.createComponent(DialogPage);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    await settle(fixture);

    setInputValue('#dialog-display-name', 'Changed Name');
    overlayButton('Cancel')?.click();
    await settle(fixture);

    expect(overlayPane()).toBeNull();
    expect(fixture.componentInstance.savedProfile()).toBeNull();
    expect(fixture.componentInstance.cancelled()).toBeTrue();
    const status = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="dialog-status"]');
    expect(status?.textContent).toContain('cancelled; no changes saved');
  });
});
