import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import { BrnAutocompleteAnchor, BrnAutocompleteClear, BrnAutocompleteInput } from '@spartan-ng/brain/autocomplete';
import { HlmInputGroup, HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';

@Component({
  selector: 'hlm-autocomplete-input',
  imports: [HlmInputGroupImports, NgIcon, BrnAutocompleteClear, BrnAutocompleteInput, BrnFieldControlDescribedBy],
  providers: [provideIcons({ lucideSearch, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnAutocompleteAnchor, HlmInputGroup],
  template: `
    <input
      brnAutocompleteInput
      #autocompleteInput="brnAutocompleteInput"
      hlmInputGroupInput
      [id]="inputId()"
      [placeholder]="placeholder()"
      brnFieldControlDescribedBy
      [aria-describedby]="ariaDescribedBy()"
      [attr.aria-required]="required() || null"
      [aria-invalid]="ariaInvalidOverride()"
      [forceInvalid]="forceInvalid()"
    />

    @if (showSearch()) {
      <hlm-input-group-addon>
        <ng-icon name="lucideSearch" [class.opacity-50]="autocompleteInput.disabled()" />
      </hlm-input-group-addon>
    }

    @if (showClear()) {
      <hlm-input-group-addon align="inline-end">
        <button
          *brnAutocompleteClear
          hlmInputGroupButton
          data-slot="autocomplete-clear"
          [disabled]="autocompleteInput.disabled()"
          size="icon-xs"
          variant="ghost"
        >
          <ng-icon name="lucideX" />
        </button>
      </hlm-input-group-addon>
    }
    <ng-content />
  `,
})
export class HlmAutocompleteInput {
  private static _id = 0;

  public readonly inputId = input<string>(`hlm-autocomplete-input-${HlmAutocompleteInput._id++}`);

  public readonly placeholder = input<string>('');

  /** Native input description IDs, merged with enclosing Spartan field descriptions. */
  public readonly ariaDescribedBy = input<string | null>(null, { alias: 'aria-describedby' });
  public readonly required = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  public readonly showSearch = input<boolean, BooleanInput>(true, { transform: booleanAttribute });
  public readonly showClear = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  /** Forces the invalid state visually, regardless of form control state. */
  public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  /** Manual override for aria-invalid. When not set, auto-detects from the parent autocomplete error state. */
  public readonly ariaInvalidOverride = input<boolean | undefined, BooleanInput>(undefined, {
    transform: (v: BooleanInput) => (v === '' || v === undefined ? undefined : booleanAttribute(v)),
    alias: 'aria-invalid',
  });

  constructor() {
    classes(() => 'tw:w-auto');
  }
}
