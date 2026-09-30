import { Injectable, signal } from '@angular/core';
import type { BrnDateAdapter } from '@spartan-ng/brain/date-time';

/** Internal synchronization for explicit writes, including writes of the same value. */
@Injectable()
export class HlmDatePickerCommitState {
  readonly revision = signal(0);

  changed(): void {
    this.revision.update((revision) => revision + 1);
  }
}

/** Match the calendar's inclusive whole-day bounds with the configured adapter. */
export function isSelectableDate<T>(adapter: BrnDateAdapter<T>, value: T, min?: T, max?: T): boolean {
  return (
    value != null &&
    Number.isFinite(adapter.getTime(value)) &&
    (min == null || !adapter.isBefore(value, adapter.startOfDay(min))) &&
    (max == null || !adapter.isAfter(value, adapter.endOfDay(max)))
  );
}
