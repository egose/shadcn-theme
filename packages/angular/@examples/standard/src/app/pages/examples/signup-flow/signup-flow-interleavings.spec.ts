import { BreakpointObserver, type BreakpointState } from '@angular/cdk/layout';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { SignupFlowExamplePage } from './signup-flow';

describe('Signup rendered lifecycle', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }).compileComponents();
  });

  afterEach(() => document.querySelector('.cdk-overlay-container')?.remove());

  const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 180));

  function setup(narrow: boolean | null = false) {
    const layout = new BehaviorSubject<BreakpointState>({ matches: narrow ?? false, breakpoints: {} });
    if (narrow !== null) spyOn(TestBed.inject(BreakpointObserver), 'observe').and.returnValue(layout);
    const fixture = TestBed.createComponent(SignupFlowExamplePage);
    const host = fixture.nativeElement as HTMLElement;
    const page = fixture.componentInstance;
    fixture.detectChanges();
    const render = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const panel = () => {
      const header = host.querySelector('[aria-current="step"], [role="tab"][aria-selected="true"]');
      return header ? host.querySelector<HTMLElement>(`#${header.getAttribute('aria-controls')}`)! : host;
    };
    const button = (text: string, root: HTMLElement = panel()) => {
      const result = Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find(
        (candidate) => candidate.textContent?.trim() === text,
      );
      if (!result) throw new Error(`Missing button: ${text}`);
      return result;
    };
    const click = async (text: string, root?: HTMLElement) => {
      button(text, root).click();
      await render();
    };
    const type = async (name: string, value: string) => {
      const input = panel().querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('blur'));
      await render();
    };
    const toggle = async (testid: string) => {
      host.querySelector<HTMLInputElement>(`[data-testid="${testid}"]`)!.click();
      await render();
    };
    const selectRole = async (label = 'Developer') => {
      panel().querySelector<HTMLButtonElement>('eg-form-select button')!.click();
      await render();
      const option = Array.from(document.querySelectorAll<HTMLElement>('[role="option"]')).find(
        (candidate) => candidate.textContent?.trim() === label,
      );
      if (!option) throw new Error(`Missing role option: ${label}`);
      option.click();
      await render();
    };
    const account = async (username = '  Ada Lovelace  ', email = 'ADA@EXAMPLE.COM') => {
      await type('username', username);
      await type('email', email);
      await click('Next');
    };
    const review = async (username?: string, email?: string) => {
      await account(username, email);
      await selectRole();
      panel().querySelector<HTMLButtonElement>('eg-form-checkbox button')!.click();
      await render();
      await click('Next');
    };
    const settle = async () => {
      await wait();
      await render();
    };
    return {
      fixture,
      host,
      page,
      layout,
      render,
      panel,
      button,
      click,
      type,
      toggle,
      selectRole,
      account,
      review,
      settle,
    };
  }

  for (const [name, valid] of [
    ['', false],
    ['   ', false],
    [' a ', false],
    [' ab ', false],
    [' abc ', true],
  ] as const) {
    it(`validates the normalized username ${JSON.stringify(name)} and associates the rendered error`, async () => {
      const ui = setup();
      await ui.account(name);
      if (valid) {
        expect(ui.panel().textContent).toContain('Accept terms');
      } else {
        const input = ui.panel().querySelector<HTMLInputElement>('input[name="username"]')!;
        const error = ui.panel().querySelector('eg-form-text-input hlm-error')!;
        expect(error.textContent).toContain(name.trim() ? '3' : 'required');
        expect(input.getAttribute('aria-describedby')).toContain(error.id);
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(ui.page.pending()).toBeFalse();
      }
    });
  }

  it('blocks invalid email, then clears its associated error after correction', async () => {
    const ui = setup();
    await ui.account('Ada', 'bad-address');
    const input = ui.panel().querySelector<HTMLInputElement>('input[name="email"]')!;
    const error = ui.panel().querySelector('eg-form-text-input[controlName="email"] hlm-error')!;
    expect(input.getAttribute('aria-describedby')).toContain(error.id);
    await ui.type('email', 'ada@example.com');
    expect(input.getAttribute('aria-invalid')).not.toBe('true');
    await ui.click('Next');
    expect(ui.panel().textContent).toContain('Accept terms');
  });

  it('retains linear gating, required terms and back/edit/review with human role labels', async () => {
    const ui = setup();
    ui.host.querySelectorAll<HTMLElement>('hlm-step-header')[2].click();
    await ui.render();
    expect(ui.panel().querySelector('input[name="username"]')).not.toBeNull();
    await ui.account();
    await ui.selectRole('Designer');
    await ui.click('Next');
    const checkbox = ui.panel().querySelector<HTMLButtonElement>('eg-form-checkbox button')!;
    const error = ui.panel().querySelector('eg-form-checkbox hlm-error')!;
    expect(error.textContent).toContain('Accept terms');
    expect(checkbox.getAttribute('aria-describedby')).toContain(error.id);
    checkbox.click();
    await ui.render();
    await ui.click('Next');
    expect(ui.panel().textContent).toContain('Designer');
    expect(ui.panel().textContent).toContain('Accepted');
    await ui.click('Back');
    await ui.selectRole('Manager');
    await ui.click('Back');
    await ui.type('username', '  Grace Hopper  ');
    await ui.click('Next');
    await ui.click('Next');
    expect(ui.panel().textContent).toContain('Grace Hopper');
    expect(ui.panel().textContent).toContain('Manager');
    await ui.click('Finish');
    await ui.settle();
    expect(ui.host.textContent).toContain('signed up as Manager');
  });

  it('locks fields while pending, prevents duplicate submissions and shows the captured normalized result', async () => {
    const ui = setup();
    await ui.review();
    const finish = spyOn(ui.page, 'finish').and.callThrough();
    await ui.click('Finish');
    expect(ui.page.pending()).toBeTrue();
    expect(ui.button('Creating…').disabled).toBeTrue();
    expect(ui.host.querySelector('[aria-busy="true"]')).not.toBeNull();
    ui.button('Creating…').click();
    expect(finish).toHaveBeenCalledTimes(1);
    await ui.page.finish(); // Handler protection independently of the disabled trigger.
    expect(ui.page.pending()).toBeTrue();
    await ui.click('Back');
    expect(ui.panel().querySelector<HTMLButtonElement>('eg-form-select button')!.disabled).toBeTrue();
    expect(ui.panel().querySelector<HTMLButtonElement>('eg-form-checkbox button')!.disabled).toBeTrue();
    await ui.click('Back');
    expect(ui.panel().querySelector<HTMLInputElement>('input[name="username"]')!.readOnly).toBeTrue();
    // External form updates cannot change the request already sent to the simulator.
    ui.page.accountForm.setValue({ username: 'Newer draft', email: 'newer@example.com' });
    ui.page.prefsForm.controls.role.setValue('manager');
    await ui.settle();
    expect(ui.page.submission()).toEqual({
      username: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'developer',
      acceptTerms: true,
    });
    expect(ui.host.textContent).toContain('signed up as Developer');
    expect(ui.host.textContent).not.toContain('Newer draft');
    expect(ui.host.querySelectorAll('h2').length).toBe(1);
    expect(ui.host.querySelector('h3')?.textContent).toBe('Account created');
    expect(document.activeElement).toBe(ui.host.querySelector('#signup-success-heading'));
    expect(ui.host.querySelector('[aria-labelledby="signup-success-heading"] [role="status"]')?.textContent).toContain(
      'Ada Lovelace',
    );
    await ui.page.finish();
    expect(ui.page.pending()).toBeFalse();
  });

  it('retains a failed draft, retries current edited values, and captures the failure setting at start', async () => {
    const ui = setup();
    await ui.review();
    await ui.toggle('signup-fail-submission');
    await ui.click('Finish');
    expect(ui.host.querySelector<HTMLInputElement>('[data-testid="signup-fail-submission"]')!.disabled).toBeTrue();
    await ui.settle();
    expect(ui.host.querySelector('[role="alert"]')?.textContent).toContain('Your values are retained');
    expect(ui.page.accountForm.controls.username.value).toBe('  Ada Lovelace  ');
    expect(ui.page.prefsForm.controls.acceptTerms.value).toBeTrue();
    await ui.click('Back');
    await ui.click('Back');
    await ui.type('username', '  Grace  ');
    await ui.click('Next');
    await ui.click('Next');
    await ui.toggle('signup-fail-submission');
    await ui.click('Retry signup');
    expect(ui.host.querySelector('[role="alert"]')).toBeNull();
    await ui.settle();
    expect(ui.page.submission()?.username).toBe('Grace');
  });

  it('allows readonly review/back navigation but blocks form edits and Finish at entry', async () => {
    const ui = setup();
    await ui.review();
    await ui.toggle('example-state-readonly');
    expect(ui.host.textContent).toContain('Read-only preview: mutation controls are disabled');
    expect(ui.button('Finish').disabled).toBeTrue();
    await ui.page.finish();
    expect(ui.page.pending()).toBeFalse();
    await ui.click('Back');
    expect(ui.panel().querySelector<HTMLButtonElement>('eg-form-select button')!.disabled).toBeTrue();
    expect(ui.panel().querySelector<HTMLButtonElement>('eg-form-checkbox button')!.disabled).toBeTrue();
    await ui.click('Back');
    expect(ui.panel().querySelector<HTMLInputElement>('input[name="username"]')!.readOnly).toBeTrue();
    await ui.click('Next');
    await ui.click('Next');
    expect(ui.panel().textContent).toContain('Ada Lovelace');
    await ui.toggle('example-state-readonly');
    expect(ui.button('Finish').disabled).toBeFalse();
  });

  for (const fails of [false, true]) {
    for (const boundary of ['reset', 'readonly', 'preview', 'reload', 'destroy'] as const) {
      it(`suppresses late signup ${fails ? 'failure' : 'success'} after ${boundary}`, async () => {
        const ui = setup();
        await ui.review();
        if (fails) await ui.toggle('signup-fail-submission');
        await ui.click('Finish');
        if (boundary === 'reset') await ui.click('Start over', ui.host);
        if (boundary === 'readonly') {
          await ui.toggle('example-state-readonly');
          await ui.toggle('example-state-readonly');
        }
        if (boundary === 'preview') {
          await ui.click('Empty', ui.host);
          await ui.click('Loaded', ui.host);
        }
        if (boundary === 'reload') await ui.click('Simulate reload', ui.host);
        if (boundary === 'destroy') ui.fixture.destroy();
        await wait();
        expect(ui.page.pending()).toBeFalse();
        expect(ui.page.submission()).toBeNull();
        expect(ui.page.submitError()).toBeNull();
        if (boundary !== 'destroy') {
          await ui.render();
          expect(ui.host.textContent).not.toContain('Account created');
          expect(ui.host.querySelector('[role="alert"]')).toBeNull();
          expect(ui.page.accountForm.controls.username.value).toBe(
            boundary === 'reset' || boundary === 'reload' ? '' : '  Ada Lovelace  ',
          );
        }
      });
    }
  }

  it('resets pending work, untouched nonnullable defaults and step progress, then starts a fresh successful session', async () => {
    const ui = setup();
    await ui.review();
    await ui.click('Finish');
    await ui.click('Start over', ui.host);
    expect(ui.page.accountForm.getRawValue()).toEqual({ username: '', email: '' });
    expect(ui.page.prefsForm.getRawValue()).toEqual({ role: '', acceptTerms: false });
    expect(ui.page.accountForm.pristine).toBeTrue();
    expect(ui.page.prefsForm.untouched).toBeTrue();
    expect(document.activeElement).toBe(ui.panel().querySelector('input[name="username"]'));
    await ui.click('Next');
    expect(ui.panel().querySelector('input[name="username"]')).not.toBeNull();
    await ui.review('Grace', 'grace@example.com');
    await ui.click('Finish');
    await ui.settle();
    expect(ui.page.submission()?.username).toBe('Grace');
    await ui.click('Start over', ui.host);
    expect(ui.page.completed()).toBeFalse();
    expect(ui.panel().querySelector('input[name="username"]')).not.toBeNull();
    expect(document.activeElement).toBe(ui.panel().querySelector('input[name="username"]'));
  });

  it('renders each shared preview state and recovers from deterministic reload failure', async () => {
    const ui = setup();
    await ui.click('Loading', ui.host);
    expect(ui.host.textContent).toContain('Loading signup preview');
    await ui.click('Empty', ui.host);
    expect(ui.host.querySelector('h3')?.textContent).toContain('not available');
    await ui.click('Show signup', ui.host);
    await ui.account();
    await ui.toggle('example-state-simulate-failure');
    await ui.click('Simulate reload', ui.host);
    expect(ui.page.accountForm.controls.username.value).toBe('');
    await ui.settle();
    expect(ui.host.querySelector('[role="alert"]')?.textContent).toContain('Signup failed to load');
    await ui.toggle('example-state-simulate-failure');
    await ui.click('Retry reload', ui.host);
    await ui.settle();
    expect(ui.panel().querySelector('input[name="username"]')).not.toBeNull();
    expect(document.activeElement).toBe(ui.panel().querySelector('input[name="username"]'));
  });

  for (const fails of [false, true]) {
    for (const boundary of ['reset', 'readonly', 'preview', 'destroy'] as const) {
      it(`cancels ${fails ? 'failed' : 'successful'} reload after ${boundary}`, async () => {
        const ui = setup();
        if (fails) await ui.toggle('example-state-simulate-failure');
        await ui.click('Simulate reload', ui.host);
        if (boundary === 'reset') await ui.click('Start over', ui.host);
        if (boundary === 'readonly') await ui.toggle('example-state-readonly');
        if (boundary === 'preview') await ui.click('Empty', ui.host);
        if (boundary === 'destroy') ui.fixture.destroy();
        await wait();
        if (boundary !== 'destroy') {
          await ui.render();
          expect(ui.host.querySelector('[role="alert"]')).toBeNull();
          expect(ui.host.textContent).not.toContain('Loading signup preview');
          expect(ui.host.textContent).toContain(boundary === 'preview' ? 'not available' : 'At least 3 characters');
        }
      });
    }
  }

  it('uses the latest reload outcome when requests overlap', async () => {
    const ui = setup();
    await ui.toggle('example-state-simulate-failure');
    await ui.click('Simulate reload', ui.host);
    await ui.toggle('example-state-simulate-failure');
    await ui.click('Simulate reload', ui.host);
    await ui.settle();
    expect(ui.host.querySelector('[role="alert"]')).toBeNull();
    expect(ui.panel().querySelector('input[name="username"]')).not.toBeNull();
  });

  it('keeps a 320px workflow operable in invalid, review, pending, failed, readonly and success states', async () => {
    const ui = setup(null); // Exercise the real media query in Karma's 320px browser window.
    ui.host.style.display = 'block';
    ui.host.style.width = '280px'; // 320px browser viewport minus runner scrollbar and page gutters.
    const fits = () => {
      expect(ui.host.scrollWidth).toBeLessThanOrEqual(ui.host.clientWidth + 1);
      expect(ui.host.querySelectorAll('h2').length).toBe(1);
    };
    await ui.render();
    expect(ui.host.querySelector('[aria-current="step"]')).not.toBeNull();
    const hiddenRole = ui.host.querySelector<HTMLButtonElement>('eg-form-select button')!;
    expect(hiddenRole.closest('form')!.inert).toBeTrue();
    hiddenRole.focus();
    expect(document.activeElement).not.toBe(hiddenRole);
    await ui.click('Next');
    fits();
    await ui.review(
      'averylongusernamethatmustwraponthephonewithnospaces',
      'averylongemailaddressthatmustwrap@example.com',
    );
    expect(ui.host.querySelector<HTMLFormElement>('form')!.inert).toBeTrue();
    fits();
    await ui.toggle('signup-fail-submission');
    await ui.click('Finish');
    fits();
    await ui.settle();
    expect(ui.host.querySelector('[role="alert"]')).not.toBeNull();
    fits();
    await ui.toggle('example-state-readonly');
    fits();
    await ui.click('Back');
    fits();
    await ui.click('Next');
    await ui.toggle('example-state-readonly');
    await ui.toggle('signup-fail-submission');
    await ui.click('Finish');
    await ui.settle();
    fits();
    expect(ui.host.querySelector('h3')?.textContent).toBe('Account created');
    expect(document.activeElement).toBe(ui.host.querySelector('#signup-success-heading'));
    await ui.click('Start over', ui.host);
    fits();
  });

  it('switches orientation without losing step progress or form values', async () => {
    const ui = setup(true);
    await ui.review();
    ui.host.style.display = 'block';
    ui.layout.next({ matches: false, breakpoints: {} });
    ui.host.style.width = '640px';
    await ui.render();
    expect(ui.host.querySelector('[role="tablist"]')?.getAttribute('aria-orientation')).toBe('horizontal');
    expect(ui.panel().textContent).toContain('Ada Lovelace');
    expect(ui.host.scrollWidth).toBeLessThanOrEqual(ui.host.clientWidth + 1);
    ui.layout.next({ matches: true, breakpoints: {} });
    await ui.render();
    expect(ui.panel().textContent).toContain('Ada Lovelace');
    expect(ui.host.querySelector('[aria-current="step"]')?.textContent).toContain('Review');
  });
});
