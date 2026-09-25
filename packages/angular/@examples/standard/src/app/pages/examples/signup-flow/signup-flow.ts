import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { EgFormCheckbox } from '@egose/shadcn-theme-ng/form-checkbox';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';
import { HlmStepperImports } from '@egose/shadcn-theme-ng/stepper';
import { DemoHeaderComponent } from '../../../shared/demo-header';

const SIGNUP_ROLES = [
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Manager', value: 'manager' },
];

/**
 * Multi-step signup flow. Each step owns a separate `FormGroup` wired to the
 * step via `[stepControl]`, so the linear stepper validates before advancing:
 * `Next` marks the step's controls touched (surfacing every field error,
 * including an untouched required checkbox) and blocks while invalid. The
 * final `Finish` is not a native submit — it marks all step forms touched and
 * only completes when every form is valid.
 */
@Component({
  selector: 'app-signup-flow-example',
  imports: [
    DemoHeaderComponent,
    ReactiveFormsModule,
    HlmButtonImports,
    HlmStepperImports,
    EgFormTextInput,
    EgFormCheckbox,
    EgFormSelect,
  ],
  template: `
    <app-demo-header
      title="Signup Flow"
      description="Multi-step signup with a validated form per step: account details, preferences with a required terms checkbox, then review and finish."
    />

    @if (!completed()) {
      <div class="tw:min-w-0 tw:overflow-x-auto">
        <hlm-stepper [linear]="true" class="tw:w-full tw:max-w-xl tw:min-w-[24rem]">
          <hlm-step label="Account" [stepControl]="accountForm">
            <form [formGroup]="accountForm" class="tw:flex tw:flex-col tw:gap-4">
              <eg-form-text-input
                controlName="username"
                label="Username"
                hint="At least 3 characters."
                [required]="true"
              />
              <eg-form-text-input
                controlName="email"
                label="Email"
                type="email"
                hint="We will never share your email."
                [required]="true"
              />
              <div class="tw:flex tw:justify-end">
                <button hlmBtn type="button" hlmStepperNext>Next</button>
              </div>
            </form>
          </hlm-step>

          <hlm-step label="Preferences" [stepControl]="prefsForm">
            <form [formGroup]="prefsForm" class="tw:flex tw:flex-col tw:gap-4">
              <eg-form-select
                controlName="role"
                label="Role"
                placeholder="Select a role"
                hint="What best describes you?"
                [required]="true"
                [options]="roles"
              />
              <eg-form-checkbox
                controlName="acceptTerms"
                label="Accept terms and conditions"
                hint="Required to create your account."
                [required]="true"
              />
              <div class="tw:flex tw:justify-between tw:gap-2">
                <button hlmBtn type="button" variant="outline" hlmStepperPrevious>Back</button>
                <button hlmBtn type="button" hlmStepperNext>Next</button>
              </div>
            </form>
          </hlm-step>

          <hlm-step label="Review">
            <div class="tw:flex tw:flex-col tw:gap-4">
              <dl class="tw:grid tw:gap-1 tw:text-sm">
                <div class="tw:flex tw:gap-2">
                  <dt class="tw:text-muted-foreground">Username:</dt>
                  <dd>{{ accountForm.controls.username.value }}</dd>
                </div>
                <div class="tw:flex tw:gap-2">
                  <dt class="tw:text-muted-foreground">Email:</dt>
                  <dd>{{ accountForm.controls.email.value }}</dd>
                </div>
                <div class="tw:flex tw:gap-2">
                  <dt class="tw:text-muted-foreground">Role:</dt>
                  <dd>{{ prefsForm.controls.role.value }}</dd>
                </div>
              </dl>
              <div class="tw:flex tw:justify-between tw:gap-2">
                <button hlmBtn type="button" variant="outline" hlmStepperPrevious>Back</button>
                <button hlmBtn type="button" (click)="finish()">Finish</button>
              </div>
            </div>
          </hlm-step>
        </hlm-stepper>
      </div>
    } @else {
      <div class="tw:flex tw:max-w-xl tw:flex-col tw:gap-2">
        <h2 class="tw:text-lg tw:font-semibold">Account created</h2>
        <p class="tw:text-sm tw:text-muted-foreground">
          Welcome, {{ accountForm.controls.username.value }} ({{ accountForm.controls.email.value }}) — signed up as
          {{ prefsForm.controls.role.value }}.
        </p>
      </div>
    }
  `,
})
export class SignupFlowExamplePage {
  private readonly _formBuilder = inject(FormBuilder);

  readonly roles = SIGNUP_ROLES;

  readonly accountForm = this._formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly prefsForm = this._formBuilder.group({
    role: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue],
  });

  readonly completed = signal(false);

  finish(): void {
    // A stepper has no native submit: surface every pending error by touching
    // all step forms, then complete only when everything is valid.
    this.accountForm.markAllAsTouched();
    this.prefsForm.markAllAsTouched();
    if (this.accountForm.valid && this.prefsForm.valid) {
      this.completed.set(true);
    }
  }
}
