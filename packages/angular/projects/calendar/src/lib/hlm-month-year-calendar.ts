import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { BrnCalendarImports, BrnMonthYearCalendar, injectBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { buttonVariants, HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { classes, hlm } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-month-year-calendar',
  imports: [BrnCalendarImports, NgIcon, HlmButtonImports],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: BrnMonthYearCalendar,
      inputs: ['min', 'max', 'disabled', 'date', 'defaultFocusedDate', 'view'],
      outputs: ['dateChange'],
    },
  ],
  host: { 'data-slot': 'month-year-calendar' },
  template: `
    <div class="tw:flex tw:flex-col tw:gap-4">
      <!-- Header -->
      <div class="tw:flex tw:w-full tw:items-center tw:justify-between tw:gap-1.5">
        <button
          brnMonthYearCalendarPreviousButton
          hlmBtn
          variant="ghost"
          class="tw:order-first tw:size-(--cell-size) tw:p-0 tw:select-none tw:aria-disabled:opacity-50"
        >
          <ng-icon name="lucideChevronLeft" class="tw:rtl:rotate-180" />
        </button>

        <button
          hlmBtn
          variant="ghost"
          class="tw:h-(--cell-size) tw:py-0 tw:select-none tw:aria-disabled:opacity-50"
          brnMonthYearCalendarHeader
        >
          {{ _heading() }}
        </button>

        <button
          brnMonthYearCalendarNextButton
          hlmBtn
          variant="ghost"
          class="tw:order-last tw:size-(--cell-size) tw:p-0 tw:select-none tw:aria-disabled:opacity-50"
        >
          <ng-icon name="lucideChevronRight" class="tw:rtl:rotate-180" />
        </button>
      </div>

      <!-- Grid -->
      @switch (_picker.view()) {
        @case ('year') {
          <div brnMonthYearCalendarGrid class="tw:grid tw:grid-cols-4 tw:gap-2">
            @for (year of _picker.years(); track _dateAdapter.getYear(year)) {
              <button brnMonthYearCalendarYearButton [date]="year" [class]="_btnClass">
                {{ _i18n.config().formatYear(_dateAdapter.getYear(year)) }}
              </button>
            }
          </div>
        }
        @case ('month') {
          <div brnMonthYearCalendarGrid class="tw:grid tw:grid-cols-4 tw:gap-2">
            @for (month of _picker.months(); track _dateAdapter.getMonth(month)) {
              <button brnMonthYearCalendarMonthButton [date]="month" [class]="_btnClass">
                {{ _i18n.config().months()[_dateAdapter.getMonth(month)] }}
              </button>
            }
          </div>
        }
      }
    </div>
  `,
})
export class HlmMonthYearCalendar<T> {
  /** Access the calendar i18n */
  protected readonly _i18n = injectBrnCalendarI18n();

  /** Access the date adapter */
  protected readonly _dateAdapter = injectDateAdapter<T>();

  /** Access the picker directive */
  protected readonly _picker = inject(BrnMonthYearCalendar<T>);

  /** The heading for the current view. */
  protected readonly _heading = computed(() => {
    const config = this._i18n.config();

    if (this._picker.view() === 'month') {
      return config.formatYear(this._dateAdapter.getYear(this._picker.focusedDate()));
    }

    const { start, end } = this._picker.yearRange();
    return `${config.formatYear(start)} – ${config.formatYear(end)}`;
  });

  protected readonly _btnClass = hlm(
    buttonVariants({ variant: 'ghost' }),
    'tw:data-[today=true]:bg-muted',
    'tw:data-[selected=true]:bg-primary tw:data-[selected=true]:text-primary-foreground tw:data-[selected=true]:hover:bg-primary tw:data-[selected=true]:hover:text-primary-foreground',
    'tw:data-[focused=true]:border-ring tw:data-[focused=true]:ring-ring/50 tw:data-[focused=true]:ring-[3px]',
    'tw:aria-disabled:pointer-events-none tw:aria-disabled:opacity-50',
    'tw:h-(--cell-size)',
  );

  constructor() {
    classes(
      () =>
        'tw:p-3 tw:[--cell-radius:var(--radius-md)] tw:[--cell-size:--spacing(8)] tw:group/calendar tw:bg-background tw:block tw:in-data-[slot=card-content]:bg-transparent tw:in-data-[slot=popover-content]:bg-transparent',
    );
  }
}
