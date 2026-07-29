import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonModule, HlmButton } from '@egose/shadcn-theme-ng/button';
import { ChangeDetectionStrategy, Component, computed, signal, inject, ViewChild } from '@angular/core';
import { HlmAutocomplete } from '@egose/shadcn-theme-ng/autocomplete';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import {
  HlmAlertModule,
  HlmAlert,
  HlmAlertIcon,
  HlmAlertTitle,
  HlmAlertDescription,
} from '@egose/shadcn-theme-ng/alert';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';
import { EgFormCheckbox } from '@egose/shadcn-theme-ng/form-checkbox';
import {
  HlmDialog,
  HlmDialogDescription,
  HlmDialogHeader,
  HlmDialogFooter,
  HlmDialogService,
  HlmDialogTitle,
} from '@egose/shadcn-theme-ng/dialog';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';
import { HlmToaster } from '@egose/shadcn-theme-ng/sonner';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideInfo } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { toast } from 'ngx-sonner';

@Component({
  imports: [
    CommonModule,
    HlmButton,
    HlmDialogDescription,
    HlmDialogHeader,
    HlmDialogFooter,
    HlmDialogTitle,
    HlmToaster,
  ],
  standalone: true,
  providers: [provideIcons({ lucideCheck })],
  template: `
    <hlm-toaster position="top-right" [closeButton]="true" [richColors]="true" />
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Form data</h3>
      <p hlmDialogDescription>Preview form data to submit</p>
    </hlm-dialog-header>

    <div class="tw:mt-2 tw:p-4 tw:border tw:rounded-md tw:bg-gray-50">
      <pre>{{ _formData | json }}</pre>
    </div>

    <hlm-dialog-footer>
      <button hlmButton variant="secondary" appearance="outline" (click)="close(true)">Cancel</button>
      <button hlmButton variant="primary" (click)="save()">Save changes</button>
    </hlm-dialog-footer>
  `,
  host: {
    class: 'tw:flex tw:flex-col tw:gap-4',
  },
})
class ConfirmationDiaglog {
  private readonly _dialogRef = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{ formData: Record<string, any> }>();

  protected readonly _formData = this._dialogContext.formData;

  public close(confirm: boolean) {
    this._dialogRef.close(confirm);
  }

  public save() {
    toast.success('Form saved', {
      description: 'The form data is successfully saved!',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  }
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmButtonModule,
    HlmAlertModule,
    HlmAlert,
    HlmAlertIcon,
    HlmAlertTitle,
    HlmAlertDescription,
    EgFormTextInput,
    EgFormTextarea,
    EgFormSelect,
    EgFormDatePicker,
    EgFormCheckbox,
    NgIcon,
    HlmIcon,
    EgFormSearchableMultiselect,
  ],
  providers: [provideIcons({ lucideInfo })],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-4xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Form Field</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          This page is the strongest end-to-end form example in the gallery, so it now presents the inputs inside a more
          product-like onboarding flow instead of a raw field dump.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.4fr)_20rem]">
        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm sm:tw:p-8">
          <div hlmAlert variant="info" class="tw:mb-6">
            <ng-icon hlm hlmAlertIcon name="lucideInfo" />
            <h4 hlmAlertTitle>Complete your profile</h4>
            <p hlmAlertDescription>
              Use this page to review how the packaged form wrappers behave in a realistic onboarding flow.
            </p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="tw:space-y-6">
            <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-6">
              <eg-form-text-input
                label="Full Name"
                placeholder="Enter your full name"
                controlName="name"
                [required]="true"
                [error]="getError('name')"
                hint="First and last name required"
              ></eg-form-text-input>

              <eg-form-text-input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                controlName="email"
                [error]="getError('email')"
                hint="We'll never share your email"
              ></eg-form-text-input>

              <eg-form-text-input
                label="Password"
                type="password"
                placeholder="Enter a secure password"
                controlName="password"
                [error]="getError('password')"
                hint="At least 6 characters"
              ></eg-form-text-input>

              <!-- New Numeric Input for Age -->
              <eg-form-text-input
                label="Age"
                type="number"
                placeholder="Enter your age"
                controlName="age"
                [error]="getError('age')"
                max="100"
                hint="Age must be between 1 and 120"
              ></eg-form-text-input>

              <eg-form-date-picker
                label="Date of Birth"
                controlName="birthday"
                pickerClass="tw:w-[280px]"
                [min]="minDate"
                [max]="maxDate"
                placeholder="Pick a date"
                [error]="getError('birthday')"
                hint="Your date of birth is used to calculate your age."
              ></eg-form-date-picker>

              <eg-form-select
                [label]="'Gender'"
                [controlName]="'gender'"
                [optionsLabel]="'Gender'"
                [options]="genderOptions"
                [required]="true"
                [error]="getError('gender')"
              ></eg-form-select>

              <eg-form-select
                [label]="'Country'"
                [controlName]="'country'"
                [optionsLabel]="'Countries'"
                [options]="countryOptions"
                [required]="true"
                [error]="getError('country')"
              ></eg-form-select>

              <!-- Multi-select for Hobbies -->
              <eg-form-select
                [label]="'Hobbies'"
                [controlName]="'hobbies'"
                [optionsLabel]="'Select your hobbies'"
                [options]="hobbiesOptions"
                [required]="true"
                [multiple]="true"
                [error]="getError('hobbies')"
              ></eg-form-select>

              <!-- Full-width textarea -->
              <eg-form-textarea
                class="tw:md:col-span-2"
                textareaClass="tw:min-h-[100px]"
                label="About You"
                placeholder="Tell us something about yourself"
                controlName="about"
                [error]="getError('about')"
                hint="Minimum 20 characters"
              ></eg-form-textarea>

              <eg-form-searchable-multiselect
                [options]="memberOptions"
                controlName="members"
                label="Members"
                [error]="getError('members')"
                hint="Members"
              />

              <eg-form-checkbox
                controlName="agreed"
                label="Agreed"
                [error]="getError('agreed')"
                hint="Required before the profile can be submitted"
              />
            </div>

            <div class="tw:flex tw:flex-wrap tw:gap-2 tw:pt-2">
              <button type="submit" hlmButton [disabled]="form.invalid || loading">
                {{ loading ? 'Submitting...' : 'Submit profile' }}
              </button>
              <button type="button" hlmButton variant="warning" variantType="outline" (click)="onReset()">Reset</button>
            </div>
          </form>
        </article>

        <aside class="tw:space-y-4 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Why it works</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Form wrappers in context</h4>
          </div>

          <div class="tw:space-y-3">
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Mixed field types</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                Text, select, date picker, checkbox, and multiselect all share one rhythm.
              </p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Validation feedback</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                Error, hint, and required states remain easy to review in a realistic layout.
              </p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Submission flow</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                The dialog preview and confirmation reset still exercise the supporting components.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class FormFieldPage {
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _egConfirmationDialogService = inject(EgConfirmationDialogService);

  public minDate = new Date(2023, 0, 1);
  public maxDate = new Date(2030, 11, 31);
  private fb = inject(FormBuilder);

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'in', label: 'India' },
  ];

  hobbiesOptions = [
    { value: 'reading', label: 'Reading' },
    { value: 'traveling', label: 'Traveling' },
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
    { value: 'cooking', label: 'Cooking' },
  ];

  memberOptions = [
    { label: 'Marty McFly', value: 'marty-mcfly' },
    { label: 'Doc Brown', value: 'doc-brown' },
    { label: 'Biff Tannen', value: 'biff-tannen' },
    { label: 'George McFly', value: 'george-mcfly' },
    { label: 'Jennifer Parker', value: 'jennifer-parker' },
    { label: 'Emmett Brown', value: 'emmett-brown' },
    { label: 'Einstein', value: 'einstein' },
    { label: 'Clara Clayton', value: 'clara-clayton' },
    { label: 'Needles', value: 'needles' },
    { label: 'Goldie Wilson', value: 'goldie-wilson' },
    { label: 'Marvin Berry', value: 'marvin-berry' },
    { label: 'Lorraine Baines', value: 'lorraine-baines' },
    { label: 'Strickland', value: 'strickland' },
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    age: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
    birthday: [null, Validators.required],
    about: ['', [Validators.required, Validators.minLength(20)]],
    gender: ['', Validators.required],
    country: ['ca', Validators.required],
    hobbies: [[], Validators.required],
    members: [[this.memberOptions[0].value, this.memberOptions[1].value], Validators.required],
    agreed: [false, Validators.requiredTrue],
  });

  submitted = false;
  loading = false;

  getError(controlName: string): string | undefined {
    const control = this.form.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) return `${this.prettyLabel(controlName)} is required`;
      if (control.errors?.['email']) return `Please enter a valid email address`;
      if (control.errors?.['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `${this.prettyLabel(controlName)} must be at least ${requiredLength} characters`;
      }
      if (control.errors?.['min']) {
        return `${this.prettyLabel(controlName)} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors?.['max']) {
        return `${this.prettyLabel(controlName)} must be less than or equal to ${control.errors['max'].max}`;
      }
    }
    return undefined;
  }

  private prettyLabel(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.loading = false;
    this.submitted = true;

    const dialogRef = this._hlmDialogService.open(ConfirmationDiaglog, {
      context: {
        formData: this.form.value,
      },
      contentClass: 'tw:w-full',
    });

    dialogRef.closed$.subscribe((confirm) => {
      console.log('Confirmation:', confirm);
    });
  }

  async onReset() {
    const confirmed = await this._egConfirmationDialogService.showConfirmationDialog({
      title: 'Confirm reset',
      description: 'Do you really want to reset the form?',
    });

    console.log('confirmed', confirmed);

    this.form.reset();
    this.submitted = false;
  }
}
