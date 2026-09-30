import { BreakpointObserver } from '@angular/cdk/layout';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators, type ValidatorFn } from '@angular/forms';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { EgFormCheckbox } from '@egose/shadcn-theme-ng/form-checkbox';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';
import { HlmStepper, HlmStepperImports } from '@egose/shadcn-theme-ng/stepper';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { simulateExampleLoad } from '../../../shared/real-examples/async-simulator';
import { ExampleStateToolbarComponent } from '../../../shared/real-examples/example-state-toolbar';
import { EXAMPLE_READ_ONLY_MESSAGE, type ExampleViewState } from '../../../shared/real-examples/example-view-state';
import {
  isSignupRole,
  normalizeSignupEmail,
  SIGNUP_ACCOUNT_DEFAULTS,
  SIGNUP_PREFERENCES_DEFAULTS,
  SIGNUP_ROLES,
  signupRoleLabel,
} from './signup-flow-fixtures';
import type { SignupAccountForm, SignupPreferencesForm, SignupRole, SignupSubmission } from './signup-flow-types';

const usernameValidator: ValidatorFn = (control) => {
  const value = (control.value as string).trim();
  if (!value) return { required: true };
  return value.length < 3 ? { minlength: { requiredLength: 3, actualLength: value.length } } : null;
};
const emailValidator: ValidatorFn = (control) => {
  const value = normalizeSignupEmail(control.value as string);
  return value ? Validators.email(new FormControl(value)) : { required: true };
};

/** The route owns the draft, captured request and session; the public stepper owns linear navigation. */
@Component({
  selector: 'app-signup-flow-example',
  imports: [
    DemoHeaderComponent,
    ExampleStateToolbarComponent,
    ReactiveFormsModule,
    HlmButtonImports,
    HlmStepperImports,
    EgFormTextInput,
    EgFormCheckbox,
    EgFormSelect,
  ],
  templateUrl: './signup-flow.html',
})
export class SignupFlowExamplePage {
  private readonly _fb = inject(FormBuilder).nonNullable;
  private readonly _injector = inject(Injector);
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _stepper = viewChild(HlmStepper);
  private _alive = true;
  private _session = 0;

  readonly roles = SIGNUP_ROLES;
  readonly accountForm: SignupAccountForm = this._fb.group({
    username: ['', usernameValidator],
    email: ['', emailValidator],
  });
  readonly prefsForm: SignupPreferencesForm = this._fb.group({
    role: this._fb.control<SignupRole | ''>('', (control) => (isSignupRole(control.value) ? null : { required: true })),
    acceptTerms: this._fb.control<boolean>(false, Validators.requiredTrue),
  });
  readonly submission = signal<SignupSubmission | null>(null);
  readonly completed = computed(() => this.submission() !== null);
  readonly pending = signal(false);
  readonly submitError = signal<string | null>(null);

  protected readonly viewState = signal<ExampleViewState>('loaded');
  protected readonly readOnly = signal(false);
  protected readonly simulateFailure = signal(false);
  protected readonly failSubmission = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);
  protected readonly narrow = toSignal(inject(BreakpointObserver).observe('(max-width: 639px)'));
  protected readonly fieldsLocked = computed(() => this.readOnly() || this.pending());
  protected readonly roleLabel = signupRoleLabel;
  protected readonly normalizeEmail = normalizeSignupEmail;
  protected readonly READ_ONLY_MESSAGE = EXAMPLE_READ_ONLY_MESSAGE;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this._alive = false;
      this._invalidate();
    });
  }

  protected setViewState(state: ExampleViewState): void {
    if (!this._alive || state === this.viewState()) return;
    this._invalidate();
    this.viewState.set(state);
    this.notice.set('Preview changed. Pending work was cancelled; your draft and completed result are retained.');
  }

  protected setReadOnly(value: boolean): void {
    if (!this._alive || value === this.readOnly()) return;
    this._invalidate();
    this.readOnly.set(value);
    if (this.viewState() === 'loading') this.viewState.set('loaded');
    this.notice.set('Permission changed. Pending work was cancelled; your draft and completed result are retained.');
  }

  private _invalidate(): void {
    ++this._session;
    this.pending.set(false);
    this.submitError.set(null);
  }

  private _current(session: number): boolean {
    return this._alive && session === this._session;
  }

  private _focus(selector: string, session = this._session): void {
    afterNextRender(
      () => {
        if (this._current(session)) this._host.nativeElement.querySelector<HTMLElement>(selector)?.focus();
      },
      { injector: this._injector },
    );
  }

  private _clear(): void {
    this._invalidate();
    this.submission.set(null);
    this.accountForm.reset(SIGNUP_ACCOUNT_DEFAULTS);
    this.prefsForm.reset(SIGNUP_PREFERENCES_DEFAULTS);
    this._stepper()?.reset();
    this.loadError.set(null);
    this.failSubmission.set(false);
  }

  /** Catalog reset is deliberately available in readonly mode; it never creates an account. */
  protected startOver(): void {
    if (!this._alive) return;
    this._clear();
    this.viewState.set('loaded');
    this.notice.set('Started over. The previous draft, result and pending work were cleared.');
    this._focus('input[name="username"]');
  }

  protected async reload(): Promise<void> {
    if (!this._alive) return;
    this._clear();
    const session = this._session;
    this.viewState.set('loading');
    this.notice.set('Reload discards the draft and result and restores a blank signup.');
    try {
      await simulateExampleLoad(null, { shouldFail: this.simulateFailure() });
      if (!this._current(session)) return;
      this.viewState.set('loaded');
      this._focus('input[name="username"]', session);
    } catch (error) {
      if (!this._current(session)) return;
      this.loadError.set(error instanceof Error ? error.message : 'Signup failed to load.');
      this.viewState.set('error');
    }
  }

  async finish(): Promise<void> {
    if (!this._alive || this.readOnly() || this.viewState() !== 'loaded' || this.pending() || this.completed()) return;
    this.accountForm.markAllAsTouched();
    this.prefsForm.markAllAsTouched();
    const account = this.accountForm.getRawValue();
    const prefs = this.prefsForm.getRawValue();
    if (!this.accountForm.valid || !this.prefsForm.valid || !isSignupRole(prefs.role) || !prefs.acceptTerms) {
      const stepper = this._stepper();
      if (stepper) stepper.selectedIndex = this.accountForm.invalid ? 0 : 1;
      this._focus('[aria-invalid="true"]');
      return;
    }
    const submitted: SignupSubmission = {
      username: account.username.trim(),
      email: normalizeSignupEmail(account.email),
      role: prefs.role,
      acceptTerms: true,
    };
    const session = this._session;
    this.submitError.set(null);
    this.notice.set(null);
    this.pending.set(true);
    try {
      const result = await simulateExampleLoad(submitted, {
        shouldFail: this.failSubmission(),
        errorMessage: 'Account creation failed. Your values are retained. Review them and retry.',
      });
      if (!this._current(session) || this.readOnly() || this.viewState() !== 'loaded') return;
      this.submission.set(result);
      this._focus('#signup-success-heading', session);
    } catch (error) {
      if (!this._current(session) || this.readOnly() || this.viewState() !== 'loaded') return;
      this.submitError.set(error instanceof Error ? error.message : 'Account creation failed. Please retry.');
    } finally {
      if (this._current(session)) this.pending.set(false);
    }
  }
}
