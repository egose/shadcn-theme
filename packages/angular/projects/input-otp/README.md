# Input OTP (`@egose/shadcn-theme-ng/input-otp`)

One-time-password entry: a row of individual character slots (with a blinking fake caret) that behaves as a single field — the shadcn/ui _InputOTP_ equivalent (6-digit SMS/email verification codes, 2FA, invite codes). Keystroke handling, paste splitting, and the `ControlValueAccessor` come from spartan-ng's `BrnInputOtp` family; this subpath adds the shadcn slot styling, group wrapper, separator glyph, and fake caret.

> **Ships as:** `@egose/shadcn-theme-ng/input-otp` (plain Tailwind) and `@egose/shadcn-theme-ng-tw/input-otp` (`tw:`-prefixed variant). See the [package README](../../README.md) for installation, peer dependencies, and the Tailwind-variant contract. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, CDK, `@spartan-ng/brain`, `rxjs`) are documented in the [package README](../../README.md#peer-dependencies).

```ts
import { HlmInputOtpImports } from '@egose/shadcn-theme-ng/input-otp';
// tw variant:
// import { HlmInputOtpImports } from '@egose/shadcn-theme-ng-tw/input-otp';
```

## Imports

The behavior host `BrnInputOtp` lives in `@spartan-ng/brain/input-otp` — import it alongside the styling imports:

```ts
// Standalone component:
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@egose/shadcn-theme-ng/input-otp';

@Component({
  standalone: true,
  imports: [BrnInputOtp, HlmInputOtpImports],
  template: `
    <brn-input-otp hlmInputOtp [length]="6">
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="0" />
        <hlm-input-otp-slot index="1" />
        <hlm-input-otp-slot index="2" />
      </div>
      <hlm-input-otp-separator />
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="3" />
        <hlm-input-otp-slot index="4" />
        <hlm-input-otp-slot index="5" />
      </div>
    </brn-input-otp>
  `,
})
export class MyComp {}
```

```ts
// NgModule-based:
import { HlmInputOtpModule } from '@egose/shadcn-theme-ng/input-otp';

@NgModule({ imports: [BrnInputOtp, HlmInputOtpModule] })
export class MyModule {}
```

Exported from `src/public-api.ts`: `HlmInputOtp`, `HlmInputOtpGroup`, `HlmInputOtpSeparator`, `HlmInputOtpSlot`, `HlmInputOtpFakeCaret`, plus `HlmInputOtpImports` and `HlmInputOtpModule`.

## Anatomy / Structure

```html
<label for="otp-code">Verification code</label>
<brn-input-otp hlmInputOtp [length]="6" inputId="otp-code">
  <div hlmInputOtpGroup>
    <hlm-input-otp-slot index="0" />
    <hlm-input-otp-slot index="1" />
    <hlm-input-otp-slot index="2" />
  </div>
  <hlm-input-otp-separator />
  <div hlmInputOtpGroup>
    <hlm-input-otp-slot index="3" />
    <hlm-input-otp-slot index="4" />
    <hlm-input-otp-slot index="5" />
  </div>
</brn-input-otp>
```

Real selectors: `brn-input-otp[hlmInputOtp]` / `brn-input-otp[hlm]` (flex row container, `data-slot="input-otp"`); `[hlmInputOtpGroup]` / `hlm-input-otp-group` (slot cluster, `data-slot="input-otp-group"`); `hlm-input-otp-slot` (component, requires `index`, renders `brn-input-otp-slot` + `hlm-input-otp-fake-caret`); `hlm-input-otp-separator` (component, `role="separator"`, `lucideMinus` glyph); `hlm-input-otp-fake-caret` (blinking caret block, usually not used directly — the slot renders it).

Brain inputs on `brn-input-otp` (from `@spartan-ng/brain/input-otp`): `length` (**required**), `value` / `valueChange`, `completed`, `disabled`, `inputId`, `inputAutocomplete`, `inputMode`, `inputClass`, `autofocus`, `transformPaste`, `hostStyles` / `inputStyles` / `containerStyles`.

## API reference

### `brn-input-otp[hlmInputOtp]` — `HlmInputOtp`

Pure styling directive (`data-slot="input-otp"`, flex row, dims on `has-disabled`). No inputs/outputs — bind `length`, `value`, `disabled`, `inputId`, … on the `brn-input-otp` element itself.

### `[hlmInputOtpGroup]` — `HlmInputOtpGroup`

Slot cluster wrapper (`data-slot="input-otp-group"`). No inputs/outputs. Use one group per visual cluster (e.g. `3+3` with a separator, or a single group of 4/6).

### `hlm-input-otp-slot` — `HlmInputOtpSlot`

| Input   | Type                                               | Description                                              |
| ------- | -------------------------------------------------- | -------------------------------------------------------- |
| `index` | `number` (**required**, `numberAttribute` coerced) | Zero-based position of the character this slot displays. |

Renders `<brn-input-otp-slot [index]>` internally; active slot gets the `ring` highlight, invalid state the destructive border.

### `hlm-input-otp-separator` — `HlmInputOtpSeparator`

Visual `-` divider between groups (`role="separator"`, `lucideMinus` via `ng-icon`). No inputs/outputs.

### `hlm-input-otp-fake-caret` — `HlmInputOtpFakeCaret`

Blinking caret block rendered inside each slot. No inputs/outputs; not normally instantiated directly.

## Examples

### 1. Basic 6-digit code (3+3 with separator)

```ts
import { Component } from '@angular/core';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@egose/shadcn-theme-ng/input-otp';

@Component({
  standalone: true,
  imports: [BrnInputOtp, HlmInputOtpImports],
  template: `
    <label for="otp-code">Verification code</label>
    <brn-input-otp hlmInputOtp [length]="6" inputId="otp-code">
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="0" />
        <hlm-input-otp-slot index="1" />
        <hlm-input-otp-slot index="2" />
      </div>
      <hlm-input-otp-separator />
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="3" />
        <hlm-input-otp-slot index="4" />
        <hlm-input-otp-slot index="5" />
      </div>
    </brn-input-otp>
  `,
})
export class BasicExample {}
```

### 2. Reactive form + auto-submit on `completed`

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@egose/shadcn-theme-ng/input-otp';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, BrnInputOtp, HlmInputOtpImports],
  template: `
    <form [formGroup]="form">
      <label for="otp">Enter the 6-digit code</label>
      <brn-input-otp
        hlmInputOtp
        formControlName="code"
        [length]="6"
        inputId="otp"
        inputMode="numeric"
        inputAutocomplete="one-time-code"
        (completed)="verify()"
      >
        <div hlmInputOtpGroup>
          <hlm-input-otp-slot index="0" />
          <hlm-input-otp-slot index="1" />
          <hlm-input-otp-slot index="2" />
          <hlm-input-otp-slot index="3" />
          <hlm-input-otp-slot index="4" />
          <hlm-input-otp-slot index="5" />
        </div>
      </brn-input-otp>
      <p class="tw:text-sm">Value: {{ form.value.code }}</p>
    </form>
  `,
})
export class ReactiveExample {
  readonly form = new FormGroup({
    code: new FormControl<string>('', { nonNullable: true, validators: [Validators.minLength(6)] }),
  });

  verify() {
    console.log('verifying', this.form.value.code);
  }
}
```

### 3. Two-way value binding + controlled value

```ts
import { Component, signal } from '@angular/core';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@egose/shadcn-theme-ng/input-otp';

@Component({
  standalone: true,
  imports: [BrnInputOtp, HlmInputOtpImports],
  template: `
    <brn-input-otp hlmInputOtp [length]="4" [value]="pin()" (valueChange)="pin.set($event)" inputId="pin">
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="0" />
        <hlm-input-otp-slot index="1" />
        <hlm-input-otp-slot index="2" />
        <hlm-input-otp-slot index="3" />
      </div>
    </brn-input-otp>
    <div class="tw:flex tw:gap-2">
      <button type="button" (click)="pin.set('')">Clear</button>
      <button type="button" (click)="pin.set('1234')">Fill demo</button>
    </div>
  `,
})
export class ControlledExample {
  readonly pin = signal('');
}
```

### 4. Different lengths: 4-digit PIN vs 8-char invite code

```ts
import { Component } from '@angular/core';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@egose/shadcn-theme-ng/input-otp';

@Component({
  standalone: true,
  imports: [BrnInputOtp, HlmInputOtpImports],
  template: `
    <label for="pin">Card PIN (4 digits)</label>
    <brn-input-otp hlmInputOtp [length]="4" inputId="pin" inputMode="numeric">
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="0" />
        <hlm-input-otp-slot index="1" />
        <hlm-input-otp-slot index="2" />
        <hlm-input-otp-slot index="3" />
      </div>
    </brn-input-otp>

    <label for="invite">Invite code (8 characters, two groups of 4)</label>
    <brn-input-otp hlmInputOtp [length]="8" inputId="invite" inputMode="text">
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="0" />
        <hlm-input-otp-slot index="1" />
        <hlm-input-otp-slot index="2" />
        <hlm-input-otp-slot index="3" />
      </div>
      <hlm-input-otp-separator />
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="4" />
        <hlm-input-otp-slot index="5" />
        <hlm-input-otp-slot index="6" />
        <hlm-input-otp-slot index="7" />
      </div>
    </brn-input-otp>
  `,
})
export class LengthsExample {}
```

### 5. Disabled + error display with resend flow

```ts
import { Component, signal } from '@angular/core';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@egose/shadcn-theme-ng/input-otp';
import { HlmError } from '@egose/shadcn-theme-ng/form-field';

@Component({
  standalone: true,
  imports: [BrnInputOtp, HlmInputOtpImports, HlmError],
  template: `
    <label for="otp-verify">Verification code</label>
    <brn-input-otp
      hlmInputOtp
      [length]="6"
      inputId="otp-verify"
      inputMode="numeric"
      inputAutocomplete="one-time-code"
      [disabled]="verifying()"
      [value]="code()"
      (valueChange)="code.set($event); error.set(null)"
      (completed)="verify()"
      aria-describedby="otp-error"
    >
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="0" />
        <hlm-input-otp-slot index="1" />
        <hlm-input-otp-slot index="2" />
      </div>
      <hlm-input-otp-separator />
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="3" />
        <hlm-input-otp-slot index="4" />
        <hlm-input-otp-slot index="5" />
      </div>
    </brn-input-otp>
    @if (error()) {
      <hlm-error id="otp-error">{{ error() }}</hlm-error>
    }
    <button type="button" (click)="resend()" [disabled]="verifying()">
      {{ verifying() ? 'Verifying…' : 'Resend code' }}
    </button>
  `,
})
export class VerifyFlowExample {
  readonly code = signal('');
  readonly error = signal<string | null>(null);
  readonly verifying = signal(false);

  verify() {
    this.verifying.set(true);
    setTimeout(() => {
      this.verifying.set(false);
      if (this.code() !== '123456') {
        this.error.set('That code is incorrect. Try again or resend.');
        this.code.set('');
      }
    }, 900);
  }

  resend() {
    this.error.set(null);
    this.code.set('');
  }
}
```

### 6. Paste normalization with `transformPaste`

```ts
import { Component } from '@angular/core';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@egose/shadcn-theme-ng/input-otp';

@Component({
  standalone: true,
  imports: [BrnInputOtp, HlmInputOtpImports],
  template: `
    <label for="otp-paste">Code (pasting “12-34-56” works)</label>
    <brn-input-otp hlmInputOtp [length]="6" inputId="otp-paste" [transformPaste]="stripSeparators">
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="0" />
        <hlm-input-otp-slot index="1" />
        <hlm-input-otp-slot index="2" />
        <hlm-input-otp-slot index="3" />
        <hlm-input-otp-slot index="4" />
        <hlm-input-otp-slot index="5" />
      </div>
    </brn-input-otp>
  `,
})
export class PasteExample {
  stripSeparators(pasted: string): string {
    return pasted.replace(/[^0-9]/g, '').slice(0, 6);
  }
}
```

## Accessibility notes

- Always render a visible `<label>` bound via `inputId` — the hidden native input is what AT focuses; without the label the purpose is unclear.
- `inputMode="numeric"` (digits) vs `text` (alphanumeric) selects the right mobile keyboard; `inputAutocomplete="one-time-code"` lets browsers/OS autofill SMS codes.
- Announce failures with a text error (`<hlm-error>` + `aria-describedby`), never by slot color alone.
- Keep `length` aligned with what the backend expects and validate `minLength(length)` on the form control so incomplete codes cannot submit.

## Theming / CSS variables

No component-specific CSS variables; slots use the shared `--input` / `--ring` / `--destructive` tokens. Slot size is fixed (`size-9`); adjust grouping/spacing with wrapper classes rather than per-slot overrides.

## Related subpaths

- `@egose/shadcn-theme-ng/input` — single-field `HlmInput` for non-OTP entry.
- `@egose/shadcn-theme-ng/form-field` — `HlmError`/`HlmHint` for code error text.
- `@egose/shadcn-theme-ng/button` — Verify/Resend actions.
- `@egose/shadcn-theme-ng/form-text-input` — labeled wrapper pattern to mirror for OTP forms.
