import { Directive, inject, linkedSignal } from '@angular/core';
import { BrnDateInput, type BrnDatePickerBase } from '@spartan-ng/brain/date-picker';
import { HlmDatePickerCommitState } from './hlm-date-picker-commit';

/** Internal input lifecycle shared by the single, range and multi pickers. */
@Directive()
export abstract class HlmConstrainedDateInput<V> extends BrnDateInput<V> {
  private readonly _commitState = inject(HlmDatePickerCommitState);

  protected abstract readonly: () => boolean;

  protected override readonly _inputValue = linkedSignal<
    { revision: number; formatted: string | undefined; value: V | null | undefined; inputValue: string },
    string
  >({
    source: () => ({
      revision: this._commitState.revision(),
      formatted: this._datePicker.formattedDate(),
      value: this._datePicker.value?.(),
      inputValue: this.inputValue(),
    }),
    computation: (source, previous) => {
      if (!previous) return source.formatted ?? source.inputValue;
      if (
        source.revision !== previous.source.revision ||
        source.value !== previous.source.value ||
        source.formatted !== previous.source.formatted
      )
        return source.formatted ?? '';
      if (source.inputValue !== previous.source.inputValue) return source.inputValue;
      return previous.value;
    },
  });

  /** Rejected text stays invalid until a successful commit, clear, or external value write. */
  public readonly inputInvalid = linkedSignal(() => {
    this._commitState.revision();
    this._datePicker.value?.();
    this.inputValue();
    return false;
  });

  protected override _commitDate(): void {
    if (this._disabled() || this.readonly()) return;
    const text = this._inputValue();
    const parsed = text ? this.parseValue(text) : null;
    const picker = this._datePicker as BrnDatePickerBase<V> & { updateDate(value: V | null): boolean };
    const accepted = (!text || parsed != null) && picker.updateDate(parsed);
    this.inputInvalid.set(!accepted);
    this._datePicker.touched?.();
  }

  protected override _handleBlur(): void {
    if (this._disabled() || this.readonly()) return;
    this._commitDate();
    if (!this.inputInvalid()) this._inputValue.set(this._datePicker.formattedDate() ?? '');
  }

  protected override _handleEnter(event: Event): void {
    event.preventDefault();
    if (this._disabled() || this.readonly()) return;
    this._commitDate();
    if (!this.inputInvalid()) {
      this._popover().close();
      this._handleFocus();
    }
  }

  protected override _handleFocus(): void {
    if (!this.inputInvalid()) super._handleFocus();
  }

  protected override _clear(): void {
    if (this._disabled() || this.readonly()) return;
    this._inputValue.set('');
    this._commitDate();
  }
}
