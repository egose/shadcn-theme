import { Component, inject, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  HlmDialogDescription,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogService,
  HlmDialogTitle,
} from '@egose/shadcn-theme-ng/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';

export interface ProfileDialogValue {
  displayName: string;
  email: string;
}

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmDialogDescription,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmInput,
    HlmLabel,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()" novalidate class="tw:contents">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Edit profile</h3>
        <p hlmDialogDescription>Make changes to your profile here.</p>
      </hlm-dialog-header>

      <div class="tw:grid tw:gap-4 tw:py-4">
        <div class="tw:grid tw:gap-2">
          <label hlmLabel for="dialog-display-name">Display name</label>
          <input hlmInput id="dialog-display-name" formControlName="displayName" autocomplete="name" />
          @if (displayNameError(); as error) {
            <p data-testid="dialog-display-name-error" class="tw:text-sm tw:text-red-600">{{ error }}</p>
          }
        </div>
        <div class="tw:grid tw:gap-2">
          <label hlmLabel for="dialog-email">Email</label>
          <input hlmInput id="dialog-email" type="email" formControlName="email" autocomplete="email" />
          @if (emailError(); as error) {
            <p data-testid="dialog-email-error" class="tw:text-sm tw:text-red-600">{{ error }}</p>
          }
        </div>
      </div>

      <hlm-dialog-footer>
        <button hlmButton type="button" variant="secondary" appearance="outline" (click)="cancel()">Cancel</button>
        <button hlmButton type="submit" variant="primary">Save changes</button>
      </hlm-dialog-footer>
    </form>
  `,
  host: { class: 'tw:flex tw:flex-col tw:gap-2' },
})
export class EditProfileDialog {
  private readonly _dialogRef = inject<BrnDialogRef<ProfileDialogValue | null>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{ initial: ProfileDialogValue }>();

  readonly form = inject(FormBuilder).nonNullable.group({
    displayName: [this._dialogContext.initial.displayName, [Validators.required, Validators.minLength(2)]],
    email: [this._dialogContext.initial.email, [Validators.required, Validators.email]],
  });

  displayNameError(): string | null {
    const control = this.form.controls.displayName;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Display name is required';
    if (control.hasError('minlength')) return 'Display name must be at least 2 characters';
    return null;
  }

  emailError(): string | null {
    const control = this.form.controls.email;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Email is required';
    if (control.hasError('email')) return 'Enter a valid email address';
    return null;
  }

  /** Cancel closes the dialog without a value; the page reports the cancellation. */
  cancel(): void {
    this._dialogRef.close(null);
  }

  /** Save submits the dialog's own form exactly once per valid submission. */
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this._dialogRef.close(this.form.getRawValue());
  }
}

@Component({
  selector: 'app-dialog-page',
  imports: [HlmButton, DemoHeaderComponent],
  template: `
    <app-demo-header
      title="Dialog"
      description="A modal dialog with its own validated form. Save and cancel have distinct, visible outcomes."
    />

    <button hlmButton type="button" (click)="openDialog()">Open dialog</button>

    <p data-testid="dialog-status" role="status" aria-live="polite" class="tw:mt-4 tw:text-sm tw:text-slate-700">
      @if (savedProfile(); as saved) {
        Saved profile: {{ saved.displayName }} ({{ saved.email }}).
      } @else if (cancelled()) {
        Profile edit cancelled; no changes saved.
      }
    </p>
  `,
})
export class DialogPage {
  private readonly _hlmDialogService = inject(HlmDialogService);

  readonly savedProfile = signal<ProfileDialogValue | null>(null);
  readonly cancelled = signal(false);

  openDialog(): void {
    const initial: ProfileDialogValue = this.savedProfile() ?? {
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
    };

    const dialogRef = this._hlmDialogService.open<ProfileDialogValue | null>(EditProfileDialog, {
      context: { initial },
      contentClass: 'tw:w-full tw:max-w-[425px]',
    });

    dialogRef.closed$.subscribe((result) => {
      if (result != null) {
        this.savedProfile.set(result);
        this.cancelled.set(false);
      } else {
        this.cancelled.set(true);
      }
    });
  }
}
