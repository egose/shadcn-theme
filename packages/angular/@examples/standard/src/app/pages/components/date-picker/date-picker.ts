import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmDatePickerImports } from '@egose/shadcn-theme-ng/date-picker';

@Component({
  selector: 'app-date-picker-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmDatePickerImports, HlmButton],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Date Picker"
        description="A text input or button trigger with a calendar popover; single, multi-date, range, and month/year variants."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm"
          kicker="Single date"
          title="Text input trigger"
          description="Type YYYY-MM-DD or pick from the calendar. Committed dates are mirrored into the input."
        >
          <div class="tw:grid tw:w-full tw:min-w-0 tw:max-w-full tw:gap-2 sm:tw:max-w-xs">
            <label for="date-picker-input" class="tw:min-w-0 tw:break-words tw:text-sm tw:font-medium tw:text-slate-700"
              >Appointment date</label
            >
            <hlm-date-picker class="tw:w-full tw:min-w-0 tw:max-w-full">
              <hlm-date-picker-input
                inputId="date-picker-input"
                placeholder="Pick a date"
                ariaLabel="Appointment date"
              />
            </hlm-date-picker>
          </div>
        </app-demo-section>

        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6"
          kicker="Single date"
          title="Button trigger with bounds"
          description="Dropdown caption for fast month/year jumps, constrained to 2025–2026, closes on select."
        >
          <div class="tw:grid tw:gap-2 sm:tw:max-w-xs">
            <label for="date-picker-button" class="tw:text-sm tw:font-medium tw:text-slate-700"> Vacation start </label>
            <hlm-date-picker
              captionLayout="dropdown"
              [min]="min"
              [max]="max"
              autoCloseOnSelect
              (dateChange)="buttonDate.set($event)"
            >
              <hlm-date-picker-trigger buttonId="date-picker-button"> Pick a date </hlm-date-picker-trigger>
            </hlm-date-picker>
            <p role="status" class="tw:text-sm tw:text-slate-600">Selected: {{ formatSingle(buttonDate()) }}</p>
          </div>
        </app-demo-section>

        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm"
          kicker="Multiple"
          title="Multi-date picker"
          description="Pick up to 3 dates. The popover closes automatically once the limit is reached."
        >
          <div class="tw:grid tw:gap-2 sm:tw:max-w-xs">
            <label for="date-multi-input" class="tw:text-sm tw:font-medium tw:text-slate-700">
              Workshop days (max 3)
            </label>
            <hlm-date-picker-multi [maxSelection]="3" autoCloseOnMaxSelection (dateChange)="multiDates.set($event)">
              <hlm-date-multi-input inputId="date-multi-input" placeholder="Pick up to 3 dates" />
            </hlm-date-picker-multi>
            <p role="status" class="tw:text-sm tw:text-slate-600">
              {{ multiDates().length }} selected{{ multiDates().length ? ': ' + formatList(multiDates()) : '' }}
            </p>
          </div>
        </app-demo-section>

        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6"
          kicker="Range"
          title="Range picker with footer"
          description="Select a start and end date. Footer actions clear the range or close the popover."
        >
          <div class="tw:grid tw:gap-2 sm:tw:max-w-xs">
            <label for="date-range-input" class="tw:text-sm tw:font-medium tw:text-slate-700"> Booking window </label>
            <hlm-date-range-picker #rangePicker autoCloseOnEndSelection (dateChange)="range.set($event)">
              <hlm-date-range-input inputId="date-range-input" placeholder="Start - End" />
              <div hlmDatePickerFooter class="tw:flex tw:justify-end tw:gap-2 tw:p-2">
                <button hlmButton variant="ghost" size="sm" type="button" (click)="rangePicker.reset()">Clear</button>
                <button hlmButton variant="outline" size="sm" type="button" (click)="rangePicker.close()">Done</button>
              </div>
            </hlm-date-range-picker>
            <div class="tw:flex tw:items-center tw:gap-2">
              <button hlmButton variant="outline" size="sm" type="button" (click)="rangePicker.open()">
                Open calendar
              </button>
              <p role="status" class="tw:text-sm tw:text-slate-600">Range: {{ formatRange(range()) }}</p>
            </div>
          </div>
        </app-demo-section>

        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm"
          kicker="Month / Year"
          title="Month-year picker"
          description="Month-level selection, formatted as MM/YYYY — useful for billing periods or archives."
        >
          <div class="tw:grid tw:gap-2 sm:tw:max-w-xs">
            <label for="month-year-input" class="tw:text-sm tw:font-medium tw:text-slate-700"> Billing month </label>
            <hlm-month-year-picker (dateChange)="month.set($event)">
              <hlm-month-year-input inputId="month-year-input" placeholder="MM/YYYY" />
            </hlm-month-year-picker>
            <p role="status" class="tw:text-sm tw:text-slate-600">Selected: {{ formatMonth(month()) }}</p>
          </div>
        </app-demo-section>

        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6"
          kicker="State"
          title="Disabled picker"
          description="The trigger and calendar are non-interactive while disabled."
        >
          <div class="tw:grid tw:gap-2 sm:tw:max-w-xs">
            <label for="date-picker-disabled" class="tw:text-sm tw:font-medium tw:text-slate-700">
              Frozen deadline
            </label>
            <hlm-date-picker disabled class="tw:w-full">
              <hlm-date-picker-input inputId="date-picker-disabled" placeholder="Pick a date" />
            </hlm-date-picker>
          </div>
        </app-demo-section>
      </div>
    </section>
  `,
})
export class DatePickerPage {
  readonly min = new Date(2025, 0, 1);
  readonly max = new Date(2026, 11, 31);

  readonly buttonDate = signal<Date | null>(null);
  readonly multiDates = signal<Date[]>([]);
  readonly range = signal<[Date, Date] | null>(null);
  readonly month = signal<Date | null>(null);

  formatSingle(date: Date | null): string {
    return date ? date.toDateString() : 'none';
  }

  formatList(dates: Date[]): string {
    return dates.map((d) => d.toLocaleDateString()).join(' · ');
  }

  formatRange(range: [Date, Date] | null): string {
    if (!range) return 'none';
    return `${range[0].toLocaleDateString()} - ${range[1].toLocaleDateString()}`;
  }

  formatMonth(date: Date | null): string {
    if (!date) return 'none';
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }
}
