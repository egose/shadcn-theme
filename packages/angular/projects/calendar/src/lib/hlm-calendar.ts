import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { BrnCalendar, BrnCalendarImports, injectBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { buttonVariants, HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';
import { classes, hlm } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-calendar',
  imports: [BrnCalendarImports, NgIcon, HlmSelectImports, NgTemplateOutlet, HlmButtonImports],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: BrnCalendar,
      inputs: ['min', 'max', 'disabled', 'date', 'dateDisabled', 'weekStartsOn', 'highlightDays', 'defaultFocusedDate'],
      outputs: ['dateChange'],
    },
  ],
  host: { 'data-slot': 'calendar' },
  template: `
    <div class="tw:inline-flex tw:flex-col tw:gap-4">
      <!-- Header -->
      <div class="tw:flex tw:w-full tw:items-center tw:justify-between tw:gap-1.5">
        <ng-template #month>
          <hlm-select brnCalendarMonthSelect class="tw:order-1">
            <hlm-select-trigger size="sm" [class]="_selectClass">
              <hlm-select-value />
            </hlm-select-trigger>
            <hlm-select-content *hlmSelectPortal class="tw:max-h-80">
              <hlm-select-group>
                @for (month of _i18n.config().months(); track month) {
                  <hlm-select-item [value]="month">{{ month }}</hlm-select-item>
                }
              </hlm-select-group>
            </hlm-select-content>
          </hlm-select>
        </ng-template>
        <ng-template #year>
          <hlm-select brnCalendarYearSelect class="tw:order-3">
            <hlm-select-trigger size="sm" [class]="_selectClass">
              <hlm-select-value />
            </hlm-select-trigger>
            <hlm-select-content *hlmSelectPortal class="tw:max-h-80">
              <hlm-select-group>
                @for (year of _i18n.config().years(); track year) {
                  <hlm-select-item [value]="year">{{ year }}</hlm-select-item>
                }
              </hlm-select-group>
            </hlm-select-content>
          </hlm-select>
        </ng-template>
        @let heading = _heading();

        <button
          brnCalendarPreviousButton
          variant="ghost"
          hlmBtn
          class="tw:order-first tw:size-(--cell-size) tw:p-0 tw:select-none tw:aria-disabled:opacity-50"
        >
          <ng-icon name="lucideChevronLeft" class="tw:rtl:rotate-180" />
        </button>

        @switch (captionLayout()) {
          @case ('dropdown') {
            <ng-container [ngTemplateOutlet]="month" />
            <ng-container [ngTemplateOutlet]="year" />
          }
          @case ('dropdown-months') {
            <ng-container [ngTemplateOutlet]="month" />
            <div brnCalendarHeader class="tw:order-4 tw:text-sm tw:font-medium">{{ heading.year }}</div>
          }
          @case ('dropdown-years') {
            <div brnCalendarHeader class="tw:order-2 tw:text-sm tw:font-medium">{{ heading.month }}</div>
            <ng-container [ngTemplateOutlet]="year" />
          }
          @case ('label') {
            <div brnCalendarHeader class="tw:order-5 tw:text-sm tw:font-medium">{{ heading.header }}</div>
          }
        }

        <button
          brnCalendarNextButton
          hlmBtn
          variant="ghost"
          class="tw:order-last tw:size-(--cell-size) tw:p-0 tw:select-none tw:aria-disabled:opacity-50"
        >
          <ng-icon name="lucideChevronRight" class="tw:rtl:rotate-180" />
        </button>
      </div>

      <table class="tw:w-full tw:border-collapse tw:space-y-1" brnCalendarGrid>
        <thead aria-hidden="true">
          <tr class="tw:flex">
            <th
              *brnCalendarWeekday="let weekday"
              scope="col"
              class="tw:text-muted-foreground tw:flex-1 tw:rounded-(--cell-radius) tw:text-[0.8rem] tw:font-normal tw:select-none"
              [attr.aria-label]="_i18n.config().labelWeekday(weekday)"
            >
              {{ _i18n.config().formatWeekdayName(weekday) }}
            </th>
          </tr>
        </thead>

        <tbody role="rowgroup">
          <tr *brnCalendarWeek="let week" class="tw:mt-2 tw:flex tw:w-full">
            @for (date of week; track _dateAdapter.getTime(date)) {
              <td
                brnCalendarCell
                class="tw:group/day tw:relative tw:aspect-square tw:h-full tw:w-full tw:rounded-(--cell-radius) tw:p-0 tw:text-center tw:select-none tw:[&:first-child[data-selected=true]_button]:rounded-s-(--cell-radius) tw:[&:last-child[data-selected=true]_button]:rounded-e-(--cell-radius)"
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
  `,
})
export class HlmCalendar<T> {
  /** Access the calendar i18n */
  protected readonly _i18n = injectBrnCalendarI18n();

  /** Access the date time adapter */
  protected readonly _dateAdapter = injectDateAdapter<T>();

  /** Show dropdowns to navigate between months or years. */
  public readonly captionLayout = input<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('label');

  /** Access the calendar directive */
  private readonly _calendar = inject(BrnCalendar);

  /** Get the heading for the current month and year */
  protected readonly _heading = computed(() => {
    const config = this._i18n.config();
    const date = this._calendar.focusedDate();

    return {
      header: config.formatHeader(this._dateAdapter.getMonth(date), this._dateAdapter.getYear(date)),
      month: config.formatMonth(this._dateAdapter.getMonth(date)),
      year: config.formatYear(this._dateAdapter.getYear(date)),
    };
  });

  protected readonly _btnClass = hlm(
    buttonVariants({ variant: 'ghost', size: 'icon' }),
    'tw:data-[today=true]:bg-muted tw:group-data-[focused=true]/day:border-ring tw:group-data-[focused=true]/day:ring-ring/50 tw:data-[range-end=true]:bg-primary tw:data-[range-end=true]:text-primary-foreground tw:data-[range-middle=true]:bg-muted tw:data-[range-middle=true]:text-foreground tw:data-[range-start=true]:bg-primary tw:data-[range-start=true]:text-primary-foreground tw:data-[selected-single=true]:bg-primary tw:data-[selected-single=true]:text-primary-foreground tw:dark:hover:bg-muted/50 tw:dark:hover:text-foreground tw:relative tw:isolate tw:z-10 tw:flex tw:aspect-square tw:size-auto tw:w-full tw:min-w-(--cell-size) tw:flex-col tw:gap-1 tw:border-0 tw:leading-none tw:font-normal tw:group-data-[focused=true]/day:relative tw:group-data-[focused=true]/day:z-10 tw:group-data-[focused=true]/day:ring-[3px] tw:data-[range-end=true]:rounded-(--cell-radius) tw:data-[range-end=true]:rounded-e-(--cell-radius) tw:data-[range-middle=true]:rounded-none tw:data-[range-start=true]:rounded-(--cell-radius) tw:data-[range-start=true]:rounded-s-(--cell-radius) tw:[&>span]:text-xs tw:[&>span]:opacity-70',
    'tw:data-[outside=true]:opacity-50',
    "tw:data-[highlighted]:before:content-['']",
    'tw:data-[highlighted]:before:absolute',
    'tw:data-[highlighted]:before:bottom-1',
    'tw:data-[highlighted]:before:start-1/2',
    'tw:data-[highlighted]:before:h-1',
    'tw:data-[highlighted]:before:w-1',
    'tw:data-[highlighted]:before:-translate-x-1/2',
    'tw:data-[highlighted]:before:rounded-full',
    'tw:data-[highlighted]:before:bg-destructive',
  );

  protected readonly _selectClass = 'gap-0 px-1.5 py-2 [&>ng-icon]:ms-1';

  constructor() {
    classes(
      () =>
        'tw:p-3 tw:[--cell-radius:var(--radius-md)] tw:[--cell-size:--spacing(8)] tw:group/calendar tw:bg-background tw:block tw:in-data-[slot=card-content]:bg-transparent tw:in-data-[slot=popover-content]:bg-transparent',
    );
  }
}
