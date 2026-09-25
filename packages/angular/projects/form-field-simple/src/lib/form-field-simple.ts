import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  inject,
  contentChild,
  signal,
  AfterContentInit,
  DoCheck,
  OnDestroy,
} from '@angular/core';
import { ControlContainer, FormControlName, FormGroup, FormGroupDirective } from '@angular/forms';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'eg-form-field',
  template: `
    <ng-content></ng-content>

    @if (hasError()) {
      <ng-content select="hlm-error"></ng-content>
    } @else {
      <ng-content select="hlm-hint"></ng-content>
    }
  `,
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgFormField implements AfterContentInit, DoCheck, OnDestroy {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm('', this.userClass()));

  public readonly control = contentChild(FormControlName);

  private readonly formGroupDirective = inject(FormGroupDirective);
  public readonly form: FormGroup = this.formGroupDirective.form;

  private statusSignal = signal<string | null>(null);
  /**
   * Mirrors `FormGroupDirective.submitted` (plain boolean) into a signal so
   * `hasError` stays reactive under OnPush and errors appear after submit
   * even when the control was never touched/dirty.
   */
  private submittedSignal = signal(false);
  /**
   * `touched`/`dirty` are plain flags with no observable: surfacing errors via
   * `markAllAsTouched()` (e.g. a stepper blocking `Next` without changing the
   * control status) would otherwise stay invisible under OnPush. Polled in
   * `ngDoCheck` so `hasError` recomputes on interaction changes too.
   */
  private interactedSignal = signal(false);

  private sub = new Subscription();

  ngAfterContentInit() {
    const ctrlDir = this.control();
    if (ctrlDir) {
      this.sub.add(
        ctrlDir.control.statusChanges.subscribe((status) => {
          this.statusSignal.set(status);
        }),
      );

      this.statusSignal.set(ctrlDir.control.status);
      this.interactedSignal.set(ctrlDir.control.touched || ctrlDir.control.dirty);
    }
  }

  ngDoCheck() {
    const submitted = !!this.formGroupDirective?.submitted;
    if (this.submittedSignal() !== submitted) this.submittedSignal.set(submitted);
    // NOTE: `control` itself may still be unset on the first pass (this hook
    // runs before the content child's setup), so optional-chain everything.
    const ctrl = this.control()?.control ?? null;
    if (ctrl) {
      const interacted = ctrl.touched || ctrl.dirty;
      if (this.interactedSignal() !== interacted) this.interactedSignal.set(interacted);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public readonly hasError = computed(() => {
    const ctrl = this.control()?.control ?? null;
    if (!ctrl) return false;

    this.statusSignal();
    this.submittedSignal();
    this.interactedSignal();

    return !!ctrl.errors && (this.interactedSignal() || this.submittedSignal());
  });

  public readonly firstErrorKey = computed(() => {
    const ctrl = this.control()?.control ?? null;
    if (!ctrl?.errors) return null;
    this.statusSignal();
    return Object.keys(ctrl.errors)[0] ?? null;
  });
}
