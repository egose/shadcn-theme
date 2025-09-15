import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  numberAttribute,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import {
  BrnCalendarCell,
  BrnCalendarCellButton,
  BrnCalendarGrid,
  BrnCalendarHeader,
  BrnCalendarNextButton,
  BrnCalendarPreviousButton,
  BrnCalendarRange,
  BrnCalendarWeek,
  BrnCalendarWeekday,
  injectBrnCalendarI18n,
  Weekday,
} from '@spartan-ng/brain/calendar';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { buttonVariants } from '@egose/shadcn-theme-ng/button';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-calendar-range',
  imports: [
    BrnCalendarHeader,
    BrnCalendarNextButton,
    BrnCalendarPreviousButton,
    BrnCalendarWeekday,
    BrnCalendarWeek,
    BrnCalendarCellButton,
    BrnCalendarCell,
    BrnCalendarGrid,
    NgIcon,
    HlmIcon,
    BrnCalendarRange,
  ],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  template: `
    <div
      brnCalendarRange
      [min]="min()"
      [max]="max()"
      [disabled]="disabled()"
      [(startDate)]="startDate"
      [(endDate)]="endDate"
      [dateDisabled]="dateDisabled()"
      [weekStartsOn]="weekStartsOn()"
      [defaultFocusedDate]="defaultFocusedDate()"
      [class]="_computedCalenderClass()"
    >
      <div class="tw:inline-flex tw:flex-col tw:space-y-4">
        <!-- Header -->
        <div class="tw:space-y-4">
          <div class="tw:relative tw:flex tw:items-center tw:justify-center tw:pt-1">
            <div brnCalendarHeader class="tw:text-sm tw:font-medium">
              {{ _heading() }}
            </div>

            <div class="tw:flex tw:items-center tw:space-x-1">
              <button
                brnCalendarPreviousButton
                class="tw:ring-offset-background tw:focus-visible:ring-ring tw:border-input tw:hover:bg-accent tw:hover:text-accent-foreground tw:absolute tw:left-1 tw:inline-flex tw:h-7 tw:w-7 tw:items-center tw:justify-center tw:whitespace-nowrap tw:rounded-md tw:border tw:bg-transparent tw:p-0 tw:text-sm tw:font-medium tw:opacity-50 tw:transition-colors tw:hover:opacity-100 tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-offset-2 tw:disabled:pointer-events-none tw:disabled:opacity-50"
              >
                <ng-icon hlm name="lucideChevronLeft" size="sm" />
              </button>

              <button
                brnCalendarNextButton
                class="tw:ring-offset-background tw:focus-visible:ring-ring tw:border-input tw:hover:bg-accent tw:hover:text-accent-foreground tw:absolute tw:right-1 tw:inline-flex tw:h-7 tw:w-7 tw:items-center tw:justify-center tw:whitespace-nowrap tw:rounded-md tw:border tw:bg-transparent tw:p-0 tw:text-sm tw:font-medium tw:opacity-50 tw:transition-colors tw:hover:opacity-100 tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-offset-2 tw:disabled:pointer-events-none tw:disabled:opacity-50"
              >
                <ng-icon hlm name="lucideChevronRight" size="sm" />
              </button>
            </div>
          </div>
        </div>

        <table class="tw:w-full tw:border-collapse tw:space-y-1" brnCalendarGrid>
          <thead>
            <tr class="tw:flex">
              <th
                *brnCalendarWeekday="let weekday"
                scope="col"
                class="tw:text-muted-foreground tw:w-8 tw:rounded-md tw:text-[0.8rem] tw:font-normal"
                [attr.aria-label]="_i18n.config().labelWeekday(weekday)"
              >
                {{ _i18n.config().formatWeekdayName(weekday) }}
              </th>
            </tr>
          </thead>

          <tbody role="rowgroup">
            <tr *brnCalendarWeek="let week" class="tw:mt-2 tw:flex w-full">
              @for (date of week; track _dateAdapter.getTime(date)) {
                <td
                  brnCalendarCell
                  class="tw:data-[selected]:data-[outside]:bg-accent/50 tw:data-[selected]:bg-accent tw:relative tw:h-8 tw:w-8 tw:p-0 tw:text-center tw:text-sm tw:focus-within:relative tw:focus-within:z-20 tw:first:data-[selected]:rounded-l-md tw:last:data-[selected]:rounded-r-md tw:[&:has([aria-selected].day-range-end)]:rounded-r-md"
                >
                  <button brnCalendarCellButton [date]="date" [class]="_btnClass">
                    {{ _dateAdapter.getDate(date) }}
                  </button>
                </td>
              }
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCalendarRange<T> {
  public readonly calendarClass = input<ClassValue>('');

  protected readonly _computedCalenderClass = computed(() => hlm('tw:rounded-md tw:border p-3', this.calendarClass()));

  /** Access the calendar i18n */
  protected readonly _i18n = injectBrnCalendarI18n();

  /** Access the date time adapter */
  protected readonly _dateAdapter = injectDateAdapter<T>();

  /** The minimum date that can be selected.*/
  public readonly min = input<T>();

  /** The maximum date that can be selected. */
  public readonly max = input<T>();

  /** Determine if the date picker is disabled. */
  public readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /** The start date of the range. */
  public readonly startDate = model<T>();

  /** The end date of the range. */
  public readonly endDate = model<T>();

  /** Whether a specific date is disabled. */
  public readonly dateDisabled = input<(date: T) => boolean>(() => false);

  /** The day the week starts on */
  public readonly weekStartsOn = input<Weekday, NumberInput>(undefined, {
    transform: (v: unknown) => numberAttribute(v) as Weekday,
  });

  /** The default focused date. */
  public readonly defaultFocusedDate = input<T>();

  /** Access the calendar directive */
  private readonly _calendar = viewChild.required(BrnCalendarRange);

  /** Get the heading for the current month and year */
  protected readonly _heading = computed(() =>
    this._i18n
      .config()
      .formatHeader(
        this._dateAdapter.getMonth(this._calendar().focusedDate()),
        this._dateAdapter.getYear(this._calendar().focusedDate()),
      ),
  );

  protected readonly _btnClass = hlm(
    buttonVariants({ variant: 'ghost' }),
    'tw:size-8 tw:p-0 tw:font-normal tw:aria-selected:opacity-100',
    'tw:data-[outside]:text-muted-foreground tw:data-[outside]:aria-selected:text-muted-foreground',
    'tw:data-[today]:bg-accent tw:data-[today]:text-accent-foreground',
    'tw:data-[selected]:bg-primary tw:data-[selected]:text-primary-foreground tw:data-[selected]:focus:bg-primary tw:data-[selected]:focus:text-primary-foreground',
    'tw:data-[disabled]:text-muted-foreground tw:data-[disabled]:opacity-50',
    'tw:data-[range-start]:rounded-l-md',
    'tw:data-[range-end]:rounded-r-md',
    'tw:data-[range-between]:bg-accent tw:data-[range-between]:text-accent-foreground tw:data-[range-between]:rounded-none',
  );
}
