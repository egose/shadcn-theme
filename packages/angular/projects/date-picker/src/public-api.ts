/*
 * Public API Surface of date-picker
 */

import { NgModule } from '@angular/core';
import { HlmDatePicker } from './lib/date-picker';
import { HlmDatePickerMulti } from './lib/date-picker-multi';
import { HlmDateRangePicker } from './lib/date-range-picker';

export * from './lib/date-picker-multi.token';
export * from './lib/date-picker.token';

export * from './lib/date-picker';
export * from './lib/date-picker-multi';
export * from './lib/date-range-picker';
export * from './lib/date-range-picker.token';

export const HlmDatePickerImports = [HlmDatePicker, HlmDatePickerMulti, HlmDateRangePicker] as const;

@NgModule({
  imports: [...HlmDatePickerImports],
  exports: [...HlmDatePickerImports],
})
export class HlmDatePickerModule {}
