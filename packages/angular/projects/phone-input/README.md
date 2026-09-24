# Phone Input (`@egose/shadcn-theme-ng/phone-input`)

A masked phone-number input. The form model holds raw digits (`"4155552671"`); the visible text is formatted (`"(415) 555-2671"`). Caret position is preserved across mask characters while typing or deleting — no DOM-selector lookups, no manual control subscriptions.

> **Ships as:** `@egose/shadcn-theme-ng/phone-input` and `@egose/shadcn-theme-ng-tw/phone-input`
> (the `tw:`-prefixed Tailwind variant). Both expose the identical TypeScript surface; only the
> emitted Tailwind class strings differ. See the [package README](../../README.md) for install
> steps, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# tw:-prefixed Tailwind variant
npm install @egose/shadcn-theme-ng-tw
```

## Imports

```ts
import { HlmPhoneInput, formatNanpPhoneNumber, type PhoneNumberFormatter } from '@egose/shadcn-theme-ng/phone-input';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/phone-input'
```

`HlmPhoneInput` implements `ControlValueAccessor`: bind it with `formControlName`, `formControl`, or `ngModel`. Prefer `EgFormPhoneInput` (`@egose/shadcn-theme-ng/form-phone-input`) for the label/error/hint wrapper.

## API reference

### `HlmPhoneInput` — `hlm-phone-input`

| Input               | Type                         | Default                 | Description                                        |
| ------------------- | ---------------------------- | ----------------------- | -------------------------------------------------- |
| `inputId`           | `string`                     | `hlm-phone-input-<n>`   | Native input id.                                   |
| `name`              | `string \| undefined`        | —                       | Native `name` forwarded to the inner `<input>`.    |
| `ariaLabel`         | `string \| undefined`        | —                       | Accessible label.                                  |
| `ariaDescribedby`   | `string \| null`             | `null`                  | ID of the describing element.                      |
| `placeholder`       | `string`                     | `''`                    | Input placeholder.                                 |
| `autocomplete`      | `string`                     | `'tel'`                 | Native autocomplete token.                         |
| `readonly`          | `boolean`                    | `false`                 | Native `readonly` state.                           |
| `disabled`          | `boolean`                    | `false`                 | Interaction lock (form control stays enabled).     |
| `forceInvalid`      | `boolean`                    | `false`                 | Forces invalid styling.                            |
| `maxDigits`         | `number`                     | `10`                    | Maximum digit count kept in the model.             |
| `modelFormat`       | `'digits' \| 'formatted'`    | `'digits'`              | Model shape: raw digits or formatted display text. |
| `formatPhoneNumber` | `(digits: string) => string` | `formatNanpPhoneNumber` | Display formatter; receives raw digits.            |
| `class`             | `ClassValue`                 | `''`                    | Extra classes on the inner `<input>`.              |
| `inputClass`        | `ClassValue`                 | `''`                    | Extra classes on the inner `<input>`.              |

Model values may be `string | null | undefined`; non-digit characters are stripped defensively on write. An empty model renders as empty text (no dangling mask characters) and emits `null`. With `modelFormat: 'formatted'` the model holds display text instead of digits — useful when a backend expects the masked value; validators then apply to the formatted string.

### `formatNanpPhoneNumber(digits)`

North-American numbering plan formatter: `4` → `(4`, `4155` → `(415) 5`, `4155552671` → `(415) 555-2671`, truncated to 10 digits. Pass a custom `PhoneNumberFormatter` for other plans (e.g. chunk-and-join national formats) together with a matching `maxDigits`.

## Examples

### 1. Standalone with formControl

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmPhoneInput } from '@egose/shadcn-theme-ng/phone-input';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [ReactiveFormsModule, HlmPhoneInput],
  template: `
    <form [formGroup]="form">
      <label for="callback-phone">Callback number</label>
      <hlm-phone-input formControlName="phone" inputId="callback-phone" />
    </form>
    <p>Digits: {{ form.value.phone ?? '—' }}</p>
  `,
})
export class CallbackComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ phone: ['', [Validators.required, Validators.minLength(10)]] });
}
```

### 2. Custom format (UK-style 5+6 grouping)

```ts
@Component({
  selector: 'app-uk-phone',
  standalone: true,
  imports: [ReactiveFormsModule, HlmPhoneInput],
  template: ` <hlm-phone-input [formControl]="control" [formatPhoneNumber]="ukFormat" [maxDigits]="11" /> `,
})
export class UkPhoneComponent {
  readonly control = new FormControl<string | null>(null);
  readonly ukFormat = (digits: string) => {
    const d = digits.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)} ${d.slice(5)}`;
  };
}
```

## Accessibility notes

- Wire a `<label for>` to `inputId`; pass `ariaLabel`/`ariaDescribedby` when composing manually (the `eg-form-phone-input` wrapper does this automatically).
- Keep `autocomplete="tel"` (the default) so password managers and mobile keyboards offer phone autofill.

## Theming / CSS variables

No component-specific CSS variables; the inner input carries the shared `HlmInput` base. Append utilities via `class` / `inputClass`.

## Related subpaths

- `@egose/shadcn-theme-ng/form-phone-input` — `eg-form-phone-input` label/error/hint wrapper.
- `@egose/shadcn-theme-ng/input` — `hlmInput` directive styling the inner input.
