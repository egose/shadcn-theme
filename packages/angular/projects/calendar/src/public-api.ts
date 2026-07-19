/*
 * Public API Surface of calendar
 */

import { NgModule } from '@angular/core';

import { HlmCalendar } from './lib/hlm-calendar';
import { HlmCalendarMulti } from './lib/hlm-calendar-multi';
import { HlmCalendarRange } from './lib/hlm-calendar-range';
import { HlmMonthYearCalendar } from './lib/hlm-month-year-calendar';

export * from './lib/hlm-calendar';
export * from './lib/hlm-calendar-multi';
export * from './lib/hlm-calendar-range';
export * from './lib/hlm-month-year-calendar';

export const HlmCalendarImports = [HlmCalendar, HlmCalendarMulti, HlmCalendarRange, HlmMonthYearCalendar] as const;

@NgModule({
  imports: [...HlmCalendarImports],
  exports: [...HlmCalendarImports],
})
export class HlmCalendarModule {}
