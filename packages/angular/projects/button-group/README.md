# Button Group (`@egose/shadcn-theme-ng/button-group`)

A joined, toolbar-style group layout that fuses buttons, inputs, selects, and static text into one visually continuous control — the Angular port of shadcn/ui `Button Group`. There is no interactive behavior of its own: `HlmButtonGroup` is a thin `cva`-styled layout directive (`orientation: horizontal | vertical`) that strips inner border-radii and collapses adjacent borders, while `HlmButtonGroupText` and `HlmButtonGroupSeparator` provide the static-text cell and the divider cell. The only headless primitive involved is `BrnSeparator` from `@spartan-ng/brain/separator` (used inside the separator directive).

Ships as `@egose/shadcn-theme-ng/button-group` and `@egose/shadcn-theme-ng-tw/button-group` (the `tw:`-prefixed variant). See the [package README](../../README.md) for install, peer dependencies, and Tailwind setup. Do not publish this project directory independently — it is consumed via the published subpath only.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, `@spartan-ng/brain`, etc.) are documented in the [package README](../../README.md). This subpath itself declares `@angular/common`, `@angular/core`, and `@spartan-ng/brain` as peers (see `projects/button-group/package.json`).

## Imports

Named imports from the subpath public API (`projects/button-group/src/public-api.ts`):

```ts
import {
  HlmButtonGroup,
  HlmButtonGroupText,
  HlmButtonGroupSeparator,
  HlmButtonGroupImports,
  HlmButtonGroupModule,
} from '@egose/shadcn-theme-ng/button-group';
// tw variant:
// import { ... } from '@egose/shadcn-theme-ng-tw/button-group';
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmButtonGroupImports } from '@egose/shadcn-theme-ng/button-group';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmButtonGroupImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmButtonGroupModule } from '@egose/shadcn-theme-ng/button-group';

@NgModule({ imports: [HlmButtonGroupModule] })
export class DemoModule {}
```

You can also import the three directives individually (`HlmButtonGroup`, `HlmButtonGroupText`, `HlmButtonGroupSeparator`) instead of the whole `HlmButtonGroupImports` array.

## Anatomy / Structure

```html
<!-- Element OR attribute form for the group itself -->
<hlm-button-group orientation="horizontal">
  <button hlmBtn variant="outline">Left</button>
  <button hlmBtn variant="outline">Middle</button>
  <button hlmBtn variant="outline">Right</button>
</hlm-button-group>

<!-- With static text + separator (attribute forms also work) -->
<div hlmButtonGroup orientation="horizontal">
  <span hlmButtonGroupText>https://</span>
  <input hlmInput placeholder="example.com" />
  <hlm-button-group-separator></hlm-button-group-separator>
  <button hlmBtn>Go</button>
</div>
```

Real selectors (from source):

| Class                     | Selectors                                                 |
| ------------------------- | --------------------------------------------------------- |
| `HlmButtonGroup`          | `[hlmButtonGroup]`, `hlm-button-group`                    |
| `HlmButtonGroupText`      | `[hlmButtonGroupText]`, `hlm-button-group-text`           |
| `HlmButtonGroupSeparator` | `[hlmButtonGroupSeparator]`, `hlm-button-group-separator` |

All three carry a `data-slot` host attribute (`button-group`, `button-group-text`, `button-group-separator`). The group host also sets `role="group"` and `[attr.data-orientation]`.

## API reference

### `HlmButtonGroup` (`[hlmButtonGroup]`, `hlm-button-group`)

| Input         | Type                         | Default        | Description                                                                                                                                                            |
| ------------- | ---------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout axis. `horizontal` collapses left/right radii and left borders; `vertical` stacks, collapses top/bottom radii and top borders. Reflected as `data-orientation`. |

No outputs, no methods. Styling is computed by `buttonGroupVariants({ orientation })` (cva) plus helpers for nested `select-trigger`, `input`, and nested `button-group` spacing.

### `HlmButtonGroupText` (`[hlmButtonGroupText]`, `hlm-button-group-text`)

Thin directive wrapper — no inputs, outputs, or methods. Renders a muted, bordered, static-text cell (`bg-muted`, `rounded-lg`, `px-2.5`, icon-aware). Use for prefixes/suffixes such as `https://`, `.com`, currency symbols, or counts.

### `HlmButtonGroupSeparator` (`[hlmButtonGroupSeparator]`, `hlm-button-group-separator`)

| Brain input (via `BrnSeparator` hostDirective) | Type                         | Default                                        | Description                                                                                                                          |
| ---------------------------------------------- | ---------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `orientation`                                  | `'horizontal' \| 'vertical'` | `'vertical'` (via `provideBrnSeparatorConfig`) | Separator axis. The provider defaults it to `vertical` so it divides horizontal groups out of the box; override for vertical groups. |
| `decorative`                                   | `boolean`                    | —                                              | Passed straight to `BrnSeparator` (aria-hidden handling).                                                                            |

No outputs of its own. Host classes make it `self-stretch`, `bg-input`, 1px thick on the active axis.

## Examples

### 1. Basic horizontal button cluster

Three outline buttons fused into one segmented control.

```ts
import { Component } from '@angular/core';
import { HlmButtonGroupImports } from '@egose/shadcn-theme-ng/button-group';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-basic-group',
  standalone: true,
  imports: [...HlmButtonGroupImports, ...HlmButtonImports],
  template: `
    <hlm-button-group>
      <button hlmBtn variant="outline">Left</button>
      <button hlmBtn variant="outline">Center</button>
      <button hlmBtn variant="outline">Right</button>
    </hlm-button-group>
  `,
})
export class BasicGroupComponent {}
```

### 2. All orientations

`horizontal` (default) vs `vertical`. Vertical stacks children and collapses vertical borders instead.

```ts
import { Component } from '@angular/core';
import { HlmButtonGroupImports } from '@egose/shadcn-theme-ng/button-group';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-orientations',
  standalone: true,
  imports: [...HlmButtonGroupImports, ...HlmButtonImports],
  template: `
    <div class="flex gap-8">
      <hlm-button-group orientation="horizontal">
        <button hlmBtn variant="outline">A</button>
        <button hlmBtn variant="outline">B</button>
        <button hlmBtn variant="outline">C</button>
      </hlm-button-group>

      <hlm-button-group orientation="vertical">
        <button hlmBtn variant="outline">Top</button>
        <button hlmBtn variant="outline">Middle</button>
        <button hlmBtn variant="outline">Bottom</button>
      </hlm-button-group>
    </div>
  `,
})
export class OrientationsComponent {}
```

### 3. Input group with static prefix/suffix text

Classic URL / price field: muted text cells fused with a native-styled input and an action button.

```ts
import { Component } from '@angular/core';
import { HlmButtonGroupImports } from '@egose/shadcn-theme-ng/button-group';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-addon-group',
  standalone: true,
  imports: [...HlmButtonGroupImports, ...HlmButtonImports, HlmInput],
  template: `
    <div hlmButtonGroup>
      <span hlmButtonGroupText>https://</span>
      <input hlmInput placeholder="example.com" class="w-48" />
      <span hlmButtonGroupText>.com</span>
      <button hlmBtn>Visit</button>
    </div>
  `,
})
export class AddonGroupComponent {}
```

### 4. Separated actions (divider cells)

Use `hlm-button-group-separator` between clusters instead of spacing utilities so the divider stretches to the group height.

```ts
import { Component } from '@angular/core';
import { HlmButtonGroupImports } from '@egose/shadcn-theme-ng/button-group';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-separated-group',
  standalone: true,
  imports: [...HlmButtonGroupImports, ...HlmButtonImports],
  template: `
    <hlm-button-group>
      <button hlmBtn variant="outline">Cut</button>
      <button hlmBtn variant="outline">Copy</button>
      <button hlmBtn variant="outline">Paste</button>
      <hlm-button-group-separator></hlm-button-group-separator>
      <button hlmBtn variant="outline">Undo</button>
      <button hlmBtn variant="outline">Redo</button>
    </hlm-button-group>
  `,
})
export class SeparatedGroupComponent {}
```

Explanation: the separator defaults to `orientation="vertical"` via its provider. Inside a `orientation="vertical"` group, bind it explicitly:

```html
<hlm-button-group orientation="vertical">
  <button hlmBtn variant="outline">One</button>
  <hlm-button-group-separator orientation="horizontal"></hlm-button-group-separator>
  <button hlmBtn variant="outline">Two</button>
</hlm-button-group>
```

### 5. Mixed controls: select + input + button

The group stylesheet special-cases `select-trigger` and `input` children (`w-fit` triggers, `flex-1` inputs), so mixed toolbars fuse cleanly.

```ts
import { Component, signal } from '@angular/core';
import { HlmButtonGroupImports } from '@egose/shadcn-theme-ng/button-group';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-mixed-group',
  standalone: true,
  imports: [...HlmButtonGroupImports, ...HlmButtonImports, HlmInput, ...HlmSelectImports],
  template: `
    <div hlmButtonGroup>
      <hlm-select [value]="unit()">
        <hlm-select-trigger class="w-28">
          <hlm-select-value />
        </hlm-select-trigger>
        <hlm-select-content *hlmSelectPortal>
          <hlm-select-item value="px">px</hlm-select-item>
          <hlm-select-item value="rem">rem</hlm-select-item>
          <hlm-select-item value="em">em</hlm-select-item>
        </hlm-select-content>
      </hlm-select>
      <input hlmInput type="number" value="16" class="w-24" />
      <button hlmBtn (click)="apply()">Apply</button>
    </div>
  `,
})
export class MixedGroupComponent {
  readonly unit = signal('px');
  apply() {
    console.log('apply', this.unit());
  }
}
```

### 6. Icon toolbar with labels for assistive tech

Buttons keep their own `aria-label`s; the group only adds `role="group"` — give it an `aria-label` for context.

```ts
import { Component } from '@angular/core';
import { HlmButtonGroupImports } from '@egose/shadcn-theme-ng/button-group';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';

@Component({
  selector: 'app-toolbar-group',
  standalone: true,
  imports: [...HlmButtonGroupImports, ...HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
  template: `
    <hlm-button-group aria-label="Text formatting">
      <button hlmBtn variant="outline" size="icon" aria-label="Bold">
        <ng-icon name="lucideBold" />
      </button>
      <button hlmBtn variant="outline" size="icon" aria-label="Italic">
        <ng-icon name="lucideItalic" />
      </button>
      <button hlmBtn variant="outline" size="icon" aria-label="Underline">
        <ng-icon name="lucideUnderline" />
      </button>
    </hlm-button-group>
  `,
})
export class ToolbarGroupComponent {}
```

## Accessibility notes

- The group host renders `role="group"` — always pair it with `aria-label` or `aria-labelledby` when the purpose is not obvious from the buttons alone.
- `HlmButtonGroupSeparator` delegates to `BrnSeparator`: mark purely visual dividers `decorative`, otherwise keep them exposed so screen readers announce the grouping break.
- `HlmButtonGroupText` is a plain `<span>`-style cell with no semantics; never put interactive content inside it.
- Keyboard behavior is unchanged — Tab moves through each fused button/input normally; roving tabindex is not applied.

## Theming / CSS variables

No component-specific CSS variables. Styling is Tailwind-driven (`bg-muted` text cells, `bg-input` separators, ring/border tokens). Dark mode follows the shared `tw:dark:` theme tokens. Override via `class` on any cell — the `classes()` helper merges your classes with the defaults.

## Related subpaths

- `@egose/shadcn-theme-ng/button` — `hlmBtn` / `HlmBtn` used for every fused button.
- `@egose/shadcn-theme-ng/input` — `hlmInput` fused text/number fields.
- `@egose/shadcn-theme-ng/select` — triggers auto-size (`w-fit`) inside groups.
- `@egose/shadcn-theme-ng/separator` — standalone separator primitive (the group ships its own opinionated divider).
