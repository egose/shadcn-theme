import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonModule } from '@egose/shadcn-theme-ng/button';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonModule, EgFormTextInput, EgFormTextarea, EgFormSelect],
  template: `
    <div class="tw:p-4">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="tw:space-y-6">
        <!-- Grid container -->
        <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-6">
          <eg-form-text-input
            label="Full Name"
            placeholder="Enter your full name"
            controlName="name"
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
        </div>

        <!-- Actions -->
        <div class="tw:flex tw:gap-4 tw:pt-4">
          <button type="submit" hlmButton [disabled]="form.invalid || loading">
            {{ loading ? 'Submitting...' : 'Submit' }}
          </button>
          <button type="button" hlmButton variant="warning" variantType="outline" (click)="onReset()">Reset</button>
        </div>
      </form>

      <!-- Submitted Data -->
      @if (submitted) {
        <div class="tw:mt-6 tw:p-4 tw:border tw:rounded-md tw:bg-gray-50">
          <h3 class="tw:font-semibold tw:mb-2">Form Submitted:</h3>
          <pre>{{ form.value | json }}</pre>
        </div>
      }
    </div>
  `,
})
export class FormFieldPage {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    age: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
    about: ['', [Validators.required, Validators.minLength(20)]],
    gender: ['', Validators.required],
    country: ['ca', Validators.required],
    hobbies: [[], Validators.required],
  });

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
    console.log('Form submitted:', this.form.value);
  }

  onReset() {
    this.form.reset();
    this.submitted = false;
  }
}
