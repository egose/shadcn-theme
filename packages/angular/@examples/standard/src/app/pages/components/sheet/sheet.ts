import { Component, inject, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmSheet, HlmSheetImports } from '@egose/shadcn-theme-ng/sheet';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

export interface SheetProfileValue {
  name: string;
  email: string;
}

const INITIAL_PROFILE: SheetProfileValue = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
};

@Component({
  selector: 'app-sheet-page',
  imports: [
    DemoHeaderComponent,
    BrnSheetImports,
    HlmSheetImports,
    HlmButtonImports,
    HlmLabelImports,
    HlmInput,
    ReactiveFormsModule,
  ],
  template: `
    <app-demo-header
      title="Sheet"
      description="A side panel with an editable form. Save commits the values, Cancel closes and restores the last saved values."
    />

    <hlm-sheet #sheet="hlmSheet" side="right">
      <button id="sheet-trigger" hlmButton brnSheetTrigger type="button">Open sheet</button>
      <hlm-sheet-content *brnSheetContent="let ctx" class="tw:gap-0">
        <form [formGroup]="form" (ngSubmit)="save(sheet)" novalidate class="tw:contents">
          <hlm-sheet-header>
            <h3 hlmSheetTitle>Edit Profile</h3>
            <p hlmSheetDescription>Make changes to your profile here, then save or cancel.</p>
          </hlm-sheet-header>
          <div class="tw:grid tw:flex-1 tw:auto-rows-min tw:gap-6 tw:px-4">
            <div class="tw:grid tw:gap-2">
              <label hlmLabel for="sheet-name">Name</label>
              <input hlmInput id="sheet-name" formControlName="name" autocomplete="name" />
              @if (nameError(); as error) {
                <p data-testid="sheet-name-error" class="tw:text-sm tw:text-red-600">{{ error }}</p>
              }
            </div>
            <div class="tw:grid tw:gap-2">
              <label hlmLabel for="sheet-email">Email</label>
              <input hlmInput id="sheet-email" type="email" formControlName="email" autocomplete="email" />
              @if (emailError(); as error) {
                <p data-testid="sheet-email-error" class="tw:text-sm tw:text-red-600">{{ error }}</p>
              }
            </div>
          </div>
          <hlm-sheet-footer>
            <button hlmButton type="submit">Save changes</button>
            <button hlmSheetClose hlmButton type="button" variant="secondary" appearance="outline" (click)="cancel()">
              Cancel
            </button>
          </hlm-sheet-footer>
        </form>
      </hlm-sheet-content>
    </hlm-sheet>

    <p data-testid="sheet-status" role="status" aria-live="polite" class="tw:mt-4 tw:text-sm tw:text-slate-700">
      @if (saved(); as value) {
        Saved: {{ value.name }} ({{ value.email }}).
      } @else if (cancelled()) {
        Changes discarded.
      }
    </p>
  `,
})
export class SheetPage {
  readonly form = inject(FormBuilder).nonNullable.group({
    name: [INITIAL_PROFILE.name, [Validators.required, Validators.minLength(2)]],
    email: [INITIAL_PROFILE.email, [Validators.required, Validators.email]],
  });

  readonly saved = signal<SheetProfileValue | null>(null);
  readonly cancelled = signal(false);

  private _committed: SheetProfileValue = { ...INITIAL_PROFILE };

  /** Submit the sheet's own form; on success commit the values and close the sheet. */
  save(sheet: HlmSheet): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this._committed = this.form.getRawValue();
    this.saved.set(this._committed);
    this.cancelled.set(false);
    sheet.close();
  }

  /** Cancel discards unsaved edits by restoring the last committed values. */
  cancel(): void {
    this.form.reset(this._committed);
    this.saved.set(null);
    this.cancelled.set(true);
  }

  protected nameError(): string | null {
    const control = this.form.controls.name;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Name is required';
    if (control.hasError('minlength')) return 'Name must be at least 2 characters';
    return null;
  }

  protected emailError(): string | null {
    const control = this.form.controls.email;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Email is required';
    if (control.hasError('email')) return 'Enter a valid email address';
    return null;
  }
}
