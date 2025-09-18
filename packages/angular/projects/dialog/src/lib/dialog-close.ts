import { Directive, computed, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmDialogClose],[brnDialogClose][hlm]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmDialogClose {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:ring-offset-background tw:focus:ring-ring tw:data-[state=open]:bg-accent tw:data-[state=open]:text-muted-foreground tw:rounded-xs tw:absolute tw:right-4 tw:top-4 tw:flex tw:items-center tw:justify-center tw:opacity-70 tw:transition-opacity tw:hover:opacity-100 tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-offset-2 tw:disabled:pointer-events-none tw:[&_ng-icon]:shrink-0',
      this.userClass(),
    ),
  );
}
