import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { BrnCalendarImports } from '@spartan-ng/brain/calendar';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';

@Component({
  selector: 'app-calendar-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, BrnCalendarImports, HlmCalendarImports],
  template: `
    <app-demo-header
      title="Calendar"
      description="A date calendar with single, multi-date, range, and month/year variants."
    />

    <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
      <app-demo-section kicker="Single date" title="Default" description="Basic single-date calendar.">
        <hlm-calendar class="tw:rounded-md tw:border" />
      </app-demo-section>

      <app-demo-section
        kicker="Single date"
        title="Dropdown caption"
        description="Dropdown month/year navigation for fast jumps."
      >
        <hlm-calendar captionLayout="dropdown" class="tw:rounded-md tw:border" />
      </app-demo-section>

      <app-demo-section kicker="Multi-date" title="Multiple selection" description="Select up to 3 dates.">
        <hlm-calendar-multi [maxSelection]="3" class="tw:rounded-md tw:border" />
      </app-demo-section>

      <app-demo-section kicker="Range" title="Date range" description="Pick a start and end date.">
        <hlm-calendar-range class="tw:rounded-md tw:border" />
      </app-demo-section>

      <app-demo-section kicker="Month / year" title="Month-year picker" description="Navigate by month and year grids.">
        <hlm-month-year-calendar class="tw:rounded-md tw:border" />
      </app-demo-section>
    </div>
  `,
})
export class CalendarPage {}
