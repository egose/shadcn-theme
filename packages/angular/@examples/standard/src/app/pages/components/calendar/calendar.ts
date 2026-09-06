import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnCalendarImports } from '@spartan-ng/brain/calendar';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';

@Component({
  selector: 'app-calendar-page',
  imports: [DemoHeaderComponent, BrnCalendarImports, HlmCalendarImports],
  template: `
    <app-demo-header title="Calendar" description="A date calendar." />

    <hlm-calendar class="tw:rounded-md tw:border" />
  `,
})
export class CalendarPage {}
