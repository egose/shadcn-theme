/*
 * Public API Surface of calendar
 */

import { NgModule } from '@angular/core';
import { HlmCalendar } from './lib/calendar';
import { HlmCalendarMulti } from './lib/calendar-multi';
import { HlmCalendarRange } from './lib/calendar-range';

export * from './lib/calendar';
export * from './lib/calendar-multi';
export * from './lib/calendar-range';

export const HlmCalendarImports = [HlmCalendar, HlmCalendarMulti, HlmCalendarRange] as const;

@NgModule({
  imports: [...HlmCalendarImports],
  exports: [...HlmCalendarImports],
})
export class HlmCalendarModule {}
