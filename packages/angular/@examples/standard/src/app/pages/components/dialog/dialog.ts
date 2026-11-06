import { ChangeDetectorRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { simulateExampleLoad } from '../../../shared/real-examples/async-simulator';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { defaultIfEmpty, take } from 'rxjs';
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

/** Lifecycle of the async API call triggered by the dialog close. */
export type DialogSavePhase = 'idle' | 'saving' | 'saved' | 'failed';

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
      description="A modal dialog with its own validated form. Closing it triggers an async API call whose response — not the close event itself — updates this page's state."
    />

    <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-4">
      <button hlmButton type="button" (click)="openDialog()">Open dialog</button>
      <button
        hlmButton
        type="button"
        variant="secondary"
        appearance="outline"
        data-testid="dialog-force-render"
        (click)="forceRender()"
      >
        Force re-render (diagnostic)
      </button>
      <label class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-slate-700">
        <input
          type="checkbox"
          data-testid="dialog-fail-next"
          [checked]="failNextApiCall()"
          (change)="failNextApiCall.set(!failNextApiCall())"
        />
        Fail next API call
      </label>
    </div>

    <p data-testid="dialog-status" role="status" aria-live="polite" class="tw:mt-4 tw:text-sm tw:text-slate-700">
      @if (savePhase() === 'saving') {
        Saving profile via API… waiting for the response to update this state.
      } @else if (savePhase() === 'failed') {
        API call failed; profile not saved.
      } @else if (savedProfile(); as saved) {
        Saved profile: {{ saved.displayName }} ({{ saved.email }}).
      } @else if (cancelled()) {
        Profile edit cancelled; no changes saved.
      }
    </p>

    @if (savedProfile(); as saved) {
      <p data-testid="dialog-api-meta" class="tw:text-xs tw:text-slate-500">
        State above was written by the async API response (API calls so far: {{ apiCallCount() }}).
      </p>
    }

    @if (eventLog().length) {
      <ul data-testid="dialog-event-log" class="tw:mt-2 tw:list-disc tw:pl-5 tw:font-mono tw:text-xs tw:text-slate-500">
        @for (entry of eventLog(); track $index) {
          <li>{{ entry }}</li>
        }
      </ul>
    }
  `,
})
export class DialogPage {
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _cdr = inject(ChangeDetectorRef);

  /** Long enough to observe the in-flight state in the browser; the spec polls for completion. */
  private static readonly _API_LATENCY_MS = 1200;

  readonly savedProfile = signal<ProfileDialogValue | null>(null);
  readonly cancelled = signal(false);
  readonly savePhase = signal<DialogSavePhase>('idle');
  readonly apiCallCount = signal(0);
  readonly failNextApiCall = signal(false);
  readonly eventLog = signal<string[]>([]);

  openDialog(): void {
    const initial: ProfileDialogValue = this.savedProfile() ?? {
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
    };

    const dialogRef = this._hlmDialogService.open<ProfileDialogValue | null>(EditProfileDialog, {
      context: { initial },
      contentClass: 'tw:w-full tw:max-w-[425px]',
    });

    dialogRef.closed$.pipe(take(1), takeUntilDestroyed(this._destroyRef), defaultIfEmpty(null)).subscribe((result) => {
      if (result != null) {
        this.cancelled.set(false);
        this.savePhase.set('saving');
        this._log(`dialog closed with a result; dispatching async API call #${this.apiCallCount() + 1}`);
        void this._persistProfile(result);
      } else {
        this.savePhase.set('idle');
        this.cancelled.set(true);
        this._log('dialog closed without a result; nothing to persist');
      }
    });
  }

  /**
   * Async API call triggered by the dialog close. The response — not the close
   * event itself — writes the final state, so if the template never reflects
   * the resolved data here, the async continuation is not reaching the view.
   */
  private async _persistProfile(submitted: ProfileDialogValue): Promise<void> {
    this.apiCallCount.update((count) => count + 1);
    const callNumber = this.apiCallCount();
    const shouldFail = this.failNextApiCall();
    if (shouldFail) this.failNextApiCall.set(false);

    this._log(`API call #${callNumber} in flight (${DialogPage._API_LATENCY_MS}ms latency)`);

    try {
      // Mimics server-side normalization: trimmed name, lowercased email.
      const response = await simulateExampleLoad<ProfileDialogValue>(
        { displayName: submitted.displayName.trim(), email: submitted.email.trim().toLowerCase() },
        { latencyMs: DialogPage._API_LATENCY_MS, shouldFail },
      );

      this.savedProfile.set(response);
      this.savePhase.set('saved');
      this._log(`API call #${callNumber} resolved; savedProfile signal written from the response`);
    } catch (error) {
      this.savePhase.set('failed');
      this._log(`API call #${callNumber} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Diagnostic: a template click always runs change detection. If the status
   * text only updates after clicking this button, the async state write did
   * happen but zoneless change detection was never scheduled for it.
   */
  forceRender(): void {
    this._cdr.markForCheck();
    this._log(`manual re-render requested while phase=${this.savePhase()}`);
  }

  private _log(message: string): void {
    const time = new Date().toISOString().slice(11, 23);
    this.eventLog.update((entries) => [...entries, `${time} ${message}`]);
  }
}
