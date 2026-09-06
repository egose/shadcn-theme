import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SheetPage } from './sheet';

function overlayPane(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.cdk-overlay-pane');
}

function overlayButton(text: string): HTMLButtonElement | null {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.cdk-overlay-pane button'));
  return buttons.find((button) => button.textContent?.trim() === text) ?? null;
}

function setSheetInput(selector: string, value: string): void {
  const input = document.querySelector<HTMLInputElement>(`.cdk-overlay-pane ${selector}`);
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

async function openSheet(fixture: ComponentFixture<SheetPage>): Promise<void> {
  (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('#sheet-trigger')!.click();
  await settle(fixture);
}

describe('SheetPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('keeps the sheet open and shows validation errors on invalid submission', async () => {
    const fixture = TestBed.createComponent(SheetPage);
    fixture.detectChanges();
    await openSheet(fixture);

    expect(overlayPane()?.textContent).toContain('Edit Profile');
    expect(overlayPane()?.contains(document.activeElement)).withContext('focus is moved into the sheet').toBeTrue();

    setSheetInput('#sheet-name', '');
    overlayButton('Save changes')?.click();
    await settle(fixture);

    expect(document.querySelector('.cdk-overlay-pane [data-testid="sheet-name-error"]')?.textContent).toContain(
      'Name is required',
    );
    expect(overlayPane()).not.toBeNull('sheet stays open on validation failure');
    expect(fixture.componentInstance.saved()).toBeNull();
  });

  it('saves edited values and shows a visible saved outcome', async () => {
    const fixture = TestBed.createComponent(SheetPage);
    fixture.detectChanges();
    await openSheet(fixture);

    setSheetInput('#sheet-name', 'Grace Hopper');
    setSheetInput('#sheet-email', 'grace@example.com');
    overlayButton('Save changes')?.click();
    await settle(fixture);

    expect(fixture.componentInstance.saved()).toEqual({ name: 'Grace Hopper', email: 'grace@example.com' });
    const status = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="sheet-status"]');
    expect(status?.textContent).toContain('Saved: Grace Hopper (grace@example.com)');
  });

  it('restores the last committed values when cancelled', async () => {
    const fixture = TestBed.createComponent(SheetPage);
    fixture.detectChanges();
    await openSheet(fixture);

    setSheetInput('#sheet-name', 'Grace Hopper');
    overlayButton('Save changes')?.click();
    await settle(fixture);

    await openSheet(fixture);
    setSheetInput('#sheet-name', 'Draft Edit');
    overlayButton('Cancel')?.click();
    await settle(fixture);

    expect(fixture.componentInstance.cancelled()).toBeTrue();
    expect(fixture.componentInstance.saved()).toBeNull();
    const status = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="sheet-status"]');
    expect(status?.textContent).toContain('Changes discarded');

    await openSheet(fixture);
    const nameInput = document.querySelector<HTMLInputElement>('.cdk-overlay-pane #sheet-name');
    expect(nameInput?.value).toBe('Grace Hopper');
  });
});
