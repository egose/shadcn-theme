import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideX } from '@ng-icons/lucide';
import {
  BrnDateInput,
  type BrnDatePickerTriggerBase,
  provideBrnDatePickerTrigger,
} from '@spartan-ng/brain/date-picker';
import { HlmInputGroup, HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';
import { classes, hlm } from '@egose/shadcn-theme-ng/utils';
import type { BooleanInput } from '@angular/cdk/coercion';
import type { ClassValue } from 'clsx';
import { injectHlmMonthYearPickerConfig } from './hlm-month-year-picker.token';

@Component({
  selector: 'hlm-month-year-input',
  imports: [HlmInputGroupImports, NgIcon],
  providers: [provideIcons({ lucideCalendar, lucideX }), provideBrnDatePickerTrigger(HlmMonthYearInput)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [HlmInputGroup],
  template: `
    <input
      #input
      hlmInputGroupInput
      [value]="_inputValue()"
      [id]="inputId()"
      [attr.name]="name()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedby()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [disabled]="_disabled()"
      [forceInvalid]="forceInvalid()"
      [class]="$inputClass()"
      (click)="_handleClick()"
      (keydown.arrowDown)="_open()"
      (keydown.enter)="_handleEnter($event)"
      (input)="_handleInputChange($event)"
      (focus)="_handleFocus()"
      (blur)="_handleBlur()"
    />
    <hlm-input-group-addon align="inline-end">
      @if (_showClearButton()) {
        <button
          hlmInputGroupButton
          size="icon-xs"
          variant="ghost"
          [attr.aria-label]="clearAriaLabel()"
          (click)="_clear()"
          [disabled]="_disabled()"
        >
          <ng-icon name="lucideX" />
        </button>
      }
      <button
        hlmInputGroupButton
        size="icon-xs"
        [attr.aria-label]="calendarAriaLabel()"
        (click)="_popover().open()"
        [disabled]="_disabled()"
      >
        <ng-icon name="lucideCalendar" />
      </button>
    </hlm-input-group-addon>
  `,
})
export class HlmMonthYearInput<T> extends BrnDateInput<T> implements BrnDatePickerTriggerBase {
  private readonly _config = injectHlmMonthYearPickerConfig<T>();

  /** Native `name` attribute forwarded to the inner `<input>`. */
  public readonly name = input<string | undefined>(undefined);

  /** Native `readonly` state forwarded to the inner `<input>`. */
  public readonly readonly = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  public readonly ariaLabel = input<string | undefined>(undefined);
  public readonly ariaDescribedby = input<string | null>(null);

  /** Extra classes merged onto the host group container (over the `HlmInputGroup` base). */
  public readonly userClass = input<ClassValue>('', { alias: 'class' });

  /** Extra classes merged onto the inner `<input>` (over the input-group input base). */
  public readonly inputClass = input<ClassValue>('');
  protected readonly $inputClass = computed(() => hlm(this.inputClass()));

  constructor() {
    super();
    classes(() => [this.userClass()]);
  }

  /**
   * Parses input text into a date value. Return `null` for invalid
   * input - the picker's date is cleared while the text is preserved so
   * the user can fix it.
   *
   * Defaults to `parseDate` from `HlmMonthYearPickerConfig`.
   */
  public readonly parseDate = input<(value: string) => T | null>(this._config.parseDate);

  /**
   * Formats the current date into the input/edit format shown while the
   * input is focused. On blur the picker's display format is restored.
   *
   * Defaults to `formatInputDate` from `HlmMonthYearPickerConfig`.
   */
  public readonly formatInputDate = input<(date: T) => string>(this._config.formatInputDate);

  protected override parseValue(value: string): T | null {
    return this.parseDate()(value);
  }

  protected override formatInputValue(value: T): string {
    return this.formatInputDate()(value);
  }
}
