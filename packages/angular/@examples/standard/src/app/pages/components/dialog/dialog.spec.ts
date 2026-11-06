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

function openDialogButton(nativeElement: HTMLElement): HTMLButtonElement {
  return nativeElement.querySelector<HTMLButtonElement>('button')!;
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

/** Polls until the predicate holds, flushing change detection between ticks. */
async function waitFor(
  fixture: ComponentFixture<DialogPage>,
  predicate: (page: DialogPage) => boolean,
  timeoutMs = 3000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!predicate(fixture.componentInstance) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 10));
    fixture.detectChanges();
  }
  fixture.detectChanges();
  const page = fixture.componentInstance;
  expect(predicate(page))
    .withContext(
      `condition met before timeout (phase=${page.savePhase()}, apiCalls=${page.apiCallCount()}, log=\n${page
        .eventLog()
        .join('\n')}\n)`,
    )
    .toBeTrue();
}

function statusText(fixture: ComponentFixture<DialogPage>): string {
  return (fixture.nativeElement as HTMLElement).querySelector('[data-testid="dialog-status"]')?.textContent ?? '';
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

    openDialogButton(fixture.nativeElement).click();
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

  it('saves edited values once and updates state from the async API response', async () => {
    const fixture = TestBed.createComponent(DialogPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    openDialogButton(fixture.nativeElement).click();
    await settle(fixture);

    expect(overlayPane()?.contains(document.activeElement)).withContext('focus is moved into the dialog').toBeTrue();

    setInputValue('#dialog-display-name', 'Grace Hopper');
    setInputValue('#dialog-email', 'grace@example.com');
    overlayButton('Save changes')?.click();
    await settle(fixture);

    expect(overlayPane()).toBeNull();
    // The close event dispatches an async API call; its response — not the close
    // itself — must update the page state and be reflected in the template.
    await waitFor(fixture, (p) => p.savePhase() === 'saved');

    expect(page.apiCallCount()).toBe(1);
    expect(page.eventLog().join('\n'))
      .withContext('the API call was dispatched by the close event')
      .toContain('in flight');
    expect(page.eventLog().join('\n')).withContext('the response wrote the savedProfile signal').toContain('resolved');
    expect(page.savedProfile()).toEqual({
      displayName: 'Grace Hopper',
      email: 'grace@example.com',
    });
    expect(statusText(fixture)).toContain('Saved profile: Grace Hopper (grace@example.com)');

    // Clicking Save after the dialog has closed must not dispatch another call.
    overlayButton('Save changes')?.click();
    await settle(fixture);
    expect(page.apiCallCount()).withContext('no duplicate save after close').toBe(1);

    // Reopening and saving again must run the whole close → API → state cycle again.
    openDialogButton(fixture.nativeElement).click();
    await settle(fixture);
    setInputValue('#dialog-display-name', 'Ada Lovelace');
    overlayButton('Save changes')?.click();
    await settle(fixture);
    await waitFor(fixture, (p) => p.apiCallCount() === 2 && p.savePhase() === 'saved');
    expect(page.savedProfile()?.displayName).toBe('Ada Lovelace');
  });

  it('shows a visible cancellation outcome when cancelled', async () => {
    const fixture = TestBed.createComponent(DialogPage);
    fixture.detectChanges();

    openDialogButton(fixture.nativeElement).click();
    await settle(fixture);

    setInputValue('#dialog-display-name', 'Changed Name');
    overlayButton('Cancel')?.click();
    await settle(fixture);

    expect(overlayPane()).toBeNull();
    expect(fixture.componentInstance.savedProfile()).toBeNull();
    expect(fixture.componentInstance.cancelled()).toBeTrue();
    expect(statusText(fixture)).toContain('cancelled; no changes saved');
  });

  it('shows the failed phase and keeps prior state when the API response rejects', async () => {
    const fixture = TestBed.createComponent(DialogPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;
    page.failNextApiCall.set(true);

    openDialogButton(fixture.nativeElement).click();
    await settle(fixture);

    setInputValue('#dialog-display-name', 'Grace Hopper');
    setInputValue('#dialog-email', 'grace@example.com');
    overlayButton('Save changes')?.click();
    await settle(fixture);

    await waitFor(fixture, (p) => p.savePhase() === 'failed');

    expect(page.savedProfile()).withContext('a rejected response must not write savedProfile').toBeNull();
    expect(page.eventLog().join('\n')).withContext('the rejection was logged').toContain('failed:');
    expect(statusText(fixture)).toContain('API call failed');
  });
});
