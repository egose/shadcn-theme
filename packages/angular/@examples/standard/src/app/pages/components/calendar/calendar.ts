import { Component, signal } from '@angular/core';
import { BrnCalendarImports } from '@spartan-ng/brain/calendar';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';

@Component({
  selector: 'app-calendar-page',
  imports: [BrnCalendarImports, HlmCalendarImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Calendar</h3>
    <p class="tw:text-gray-500 tw:mb-4">A date calendar.</p>

    <hlm-calendar class="tw:rounded-md tw:border" />
  `,
})
export class CalendarPage {}
