import {
  type ExistingProvider,
  InjectionToken,
  type InputSignal,
  type InputSignalWithTransform,
  type Type,
  inject,
} from '@angular/core';
import type { NumberInput } from '@angular/cdk/coercion';
import type { ToggleVariants } from '@egose/shadcn-theme-ng/toggle';

export interface HlmToggleGroupContext {
  readonly variant: InputSignal<ToggleVariants['variant']>;
  readonly size: InputSignal<ToggleVariants['size']>;
  readonly spacing: InputSignalWithTransform<number, NumberInput>;
}

export const HlmToggleGroupToken = new InjectionToken<HlmToggleGroupContext>('HlmToggleGroupToken');

export function injectHlmToggleGroup(): HlmToggleGroupContext {
  return inject(HlmToggleGroupToken);
}

export function provideHlmToggleGroup(toggleGroup: Type<HlmToggleGroupContext>): ExistingProvider {
  return { provide: HlmToggleGroupToken, useExisting: toggleGroup };
}
