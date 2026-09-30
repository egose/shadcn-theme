import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../app.routes';
import { PhoneInputPage } from './phone-input';

describe('Phone Input demo', () => {
  let fixture: ComponentFixture<PhoneInputPage>;
  const input = (id: string) => fixture.nativeElement.querySelector(`#phone-${id}`) as HTMLInputElement;
  function edit(id: string, value: string, caret = value.length): void {
    const element = input(id);
    element.value = value;
    element.setSelectionRange(caret, caret);
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneInputPage],
      providers: [provideRouter(routes)],
    }).compileComponents();
    fixture = TestBed.createComponent(PhoneInputPage);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders through its registered public route with one routed heading', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/components/phone-input');
    expect(harness.routeNativeElement?.querySelector('app-phone-input-page')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelectorAll('h2').length).toBe(1);
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe('Phone Input');
  });

  it('shows formatted displays with distinct raw and formatted form models', () => {
    edit('raw', '650-555-0123');
    edit('formatted', '6505550123');
    expect(input('raw').value).toBe('(650) 555-0123');
    expect(input('formatted').value).toBe('(650) 555-0123');
    expect(fixture.componentInstance.raw.value).toBe('6505550123');
    expect(fixture.componentInstance.formatted.value).toBe('(650) 555-0123');
    expect(fixture.nativeElement.querySelector('#phone-raw-value').textContent).toContain('6505550123');
    expect(fixture.nativeElement.querySelector('#phone-formatted-value').textContent).toContain('(650) 555-0123');
  });

  it('corrects selected digits and retains the caret before the remaining suffix', () => {
    // Browser result of selecting 415 and typing 650 in the initial formatted value.
    input('raw').setSelectionRange(1, 4);
    edit('raw', '(650) 555-2671', 4);
    expect(fixture.componentInstance.raw.value).toBe('6505552671');
    expect(input('raw').selectionStart).toBe(4);
    expect(input('raw').value).toBe('(650) 555-2671');
  });

  for (const [inputType, caret, expected] of [
    ['deleteContentBackward', 6, '415552671'],
    ['deleteContentForward', 4, '415552671'],
  ] as const) {
    it(`supports ${inputType} across mask separators`, () => {
      input('raw').setSelectionRange(caret, caret);
      input('raw').dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType }));
      fixture.detectChanges();
      expect(fixture.componentInstance.raw.value).toBe(expected);
      expect(input('raw').value).toBe('(415) 552-671');
    });
  }

  it('normalizes pasted punctuation and bounds the model to ten digits', () => {
    edit('raw', '650.555.012345');
    expect(fixture.componentInstance.raw.value).toBe('6505550123');
    expect(input('raw').value).toBe('(650) 555-0123');
  });

  it('clearing emits null and the reset action clears both edited models and interaction state', () => {
    edit('raw', '123');
    edit('formatted', '456');
    input('raw').dispatchEvent(new Event('blur'));
    expect(fixture.componentInstance.raw.dirty).toBeTrue();
    expect(fixture.componentInstance.raw.touched).toBeTrue();
    edit('formatted', '');
    expect(fixture.componentInstance.formatted.value).toBeNull();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    for (const control of [fixture.componentInstance.raw, fixture.componentInstance.formatted]) {
      expect(control.value).toBeNull();
      expect(control.pristine).toBeTrue();
      expect(control.untouched).toBeTrue();
    }
    expect(input('raw').value).toBe('');
    expect(input('formatted').value).toBe('');
    expect(input('readonly').value).toBe('(415) 555-2671');
  });

  it('labels every native control and preserves readonly/disabled values against edits', () => {
    for (const id of ['raw', 'formatted', 'readonly', 'disabled']) {
      expect(fixture.nativeElement.querySelector(`label[for="phone-${id}"]`)).not.toBeNull();
    }
    expect(input('readonly').readOnly).toBeTrue();
    expect(input('disabled').disabled).toBeTrue();
    input('readonly').focus();
    expect(document.activeElement).toBe(input('readonly'));
    input('disabled').focus();
    expect(document.activeElement).toBe(input('readonly'));
    edit('readonly', '999');
    edit('disabled', '999');
    expect(fixture.componentInstance.readOnly.value).toBe('4155552671');
    expect(fixture.componentInstance.disabled.value).toBe('2125550199');
    expect(input('readonly').value).toBe('(415) 555-2671');
    expect(input('disabled').value).toBe('(212) 555-0199');
  });

  it('fits a narrow content area before and after correction/reset', () => {
    const host = fixture.nativeElement as HTMLElement;
    host.style.display = 'block';
    host.style.width = '280px';
    edit('raw', '6505550123');
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
  });
});
