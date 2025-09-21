import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  inject,
  contentChild,
  signal,
  AfterContentInit,
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
export class EgFormField implements AfterContentInit, OnDestroy {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm('', this.userClass()));

  public readonly control = contentChild(FormControlName);

  private readonly formGroupDirective = inject(FormGroupDirective);
  public readonly form: FormGroup = this.formGroupDirective.form;

  private statusSignal = signal<string | null>(null);

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
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public readonly hasError = computed(() => {
    const ctrlDir = this.control();
    if (!ctrlDir) return false;

    this.statusSignal();

    return !!ctrlDir.control.errors && (ctrlDir.control.touched || ctrlDir.control.dirty);
  });

  public readonly firstErrorKey = computed(() => {
    const ctrlDir = this.control();
    if (!ctrlDir || !ctrlDir.control.errors) return null;
    this.statusSignal();
    return Object.keys(ctrlDir.control.errors)[0] ?? null;
  });
}
