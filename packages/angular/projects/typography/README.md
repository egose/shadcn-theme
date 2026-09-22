# Typography (`@egose/shadcn-theme-ng/typography`)

Document type styles, equivalent to [shadcn/ui Typography](https://ui.shadcn.com/docs/components/typography). This subpath ships twelve **thin styling directives** — no behavior, no primitives, no inputs/outputs. Attach them to native elements (`h1`–`h4`, `p`, `blockquote`, `code`, `ul`, …) for shadcn type scale, plus matching exported class constants (`hlmH1`, `hlmP`, …) for reuse in custom components.

> **Ships as:** `@egose/shadcn-theme-ng/typography` and `@egose/shadcn-theme-ng-tw/typography` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

No extra runtime dependencies. See the [package README](../../README.md) for the peer-dependency table.

## Imports

All public symbols are re-exported from `projects/typography/src/public-api.ts`:

```ts
import {
  HlmBlockquote,
  HlmCode,
  HlmH1,
  HlmH2,
  HlmH3,
  HlmH4,
  HlmLarge,
  HlmLead,
  HlmMuted,
  HlmP,
  HlmSmall,
  HlmTypographyImports,
  HlmTypographyModule,
  HlmUl,
} from '@egose/shadcn-theme-ng/typography';
// tw variant: swap to '@egose/shadcn-theme-ng-tw/typography'
```

Class constants are exported alongside (`hlmH1`, `hlmH2`, `hlmH3`, `hlmH4`, `hlmP`, `hlmBlockquote`, `hlmCode`, `hlmLarge`, `hlmLead`, `hlmMuted`, `hlmSmall`, `hlmUl`).

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmTypographyImports } from '@egose/shadcn-theme-ng/typography';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmTypographyImports],
  template: `<h1 hlmH1>Title</h1>`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmTypographyModule } from '@egose/shadcn-theme-ng/typography';

@NgModule({ imports: [HlmTypographyModule] })
export class FeatureModule {}
```

| Symbol                 | Kind          | Host selector (real)             |
| ---------------------- | ------------- | -------------------------------- |
| `HlmH1`                | Directive     | `[hlmH1]`                        |
| `HlmH2`                | Directive     | `[hlmH2]`                        |
| `HlmH3`                | Directive     | `[hlmH3]`                        |
| `HlmH4`                | Directive     | `[hlmH4]`                        |
| `HlmP`                 | Directive     | `[hlmP]`                         |
| `HlmBlockquote`        | Directive     | `[hlmBlockquote]`                |
| `HlmCode`              | Directive     | `[hlmCode]`                      |
| `HlmLarge`             | Directive     | `[hlmLarge]`                     |
| `HlmLead`              | Directive     | `[hlmLead]`                      |
| `HlmMuted`             | Directive     | `[hlmMuted]`                     |
| `HlmSmall`             | Directive     | `[hlmSmall]`                     |
| `HlmUl`                | Directive     | `[hlmUl]`                        |
| `HlmTypographyImports` | `const` array | All twelve directives.           |
| `HlmTypographyModule`  | NgModule      | Imports + re-exports all twelve. |

## Anatomy / Structure

```html
<h1 hlmH1>The Joke Tax Chronicles</h1>
<p hlmLead>Once upon a time, in a far-off land, there was a very lazy king.</p>
<h2 hlmH2>The King's Plan</h2>
<p hlmP>The king thought…</p>
<blockquote hlmBlockquote>"After all," he said, "everyone enjoys a good joke."</blockquote>
<h3 hlmH3>The Joke Tax</h3>
<ul hlmUl>
  <li>1st level of puns: 5 gold coins</li>
  <li>2nd level of jokes: 10 gold coins</li>
</ul>
<p hlmP>Learn more with <code hlmCode>ng add</code>.</p>
<p hlmLarge>Large callout line.</p>
<p hlmMuted>Muted fine print.</p>
<p hlmSmall>Small label text.</p>
<h4 hlmH4>Appendix</h4>
```

Attach each directive to its matching semantic element (`HlmH1`→`<h1>`, `HlmUl`→`<ul>`, `HlmCode`→`<code>`, …) — the directive adds classes only and does not change semantics.

## API reference

None of the twelve directives declare inputs, outputs, or methods. Each merges a fixed class string (also exported as a constant) via `classes()`:

| Directive / constant              | Element        | Fixed classes (abridged)                                                            |
| --------------------------------- | -------------- | ----------------------------------------------------------------------------------- |
| `HlmH1` / `hlmH1`                 | `<h1>`         | `scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl`                    |
| `HlmH2` / `hlmH2`                 | `<h2>`         | `scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0`        |
| `HlmH3` / `hlmH3`                 | `<h3>`         | `scroll-m-20 text-2xl font-semibold tracking-tight`                                 |
| `HlmH4` / `hlmH4`                 | `<h4>`         | `scroll-m-20 text-xl font-semibold tracking-tight`                                  |
| `HlmP` / `hlmP`                   | `<p>`          | `leading-7 [&:not(:first-child)]:mt-6`                                              |
| `HlmBlockquote` / `hlmBlockquote` | `<blockquote>` | `mt-6 border-l-2 pl-6 italic`                                                       |
| `HlmCode` / `hlmCode`             | `<code>`       | `relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold` |
| `HlmUl` / `hlmUl`                 | `<ul>`         | `my-6 ml-6 list-disc [&>li]:mt-2`                                                   |
| `HlmLarge` / `hlmLarge`           | any            | `text-lg font-semibold`                                                             |
| `HlmLead` / `hlmLead`             | `<p>`          | `text-xl text-muted-foreground`                                                     |
| `HlmMuted` / `hlmMuted`           | `<p>`          | `text-sm text-muted-foreground`                                                     |
| `HlmSmall` / `hlmSmall`           | any            | `text-sm font-medium leading-none`                                                  |

User `class` attributes merge (not clobbered) through the shared `classes()` helper.

## Examples

### 1. Full article page

```ts
// demo-article.component.ts
import { Component } from '@angular/core';
import { HlmTypographyImports } from '@egose/shadcn-theme-ng/typography';

@Component({
  selector: 'demo-article',
  standalone: true,
  imports: [...HlmTypographyImports],
  template: `
    <article class="max-w-2xl">
      <h1 hlmH1>Taxing Laughter: The Joke Tax</h1>
      <p hlmLead>Once upon a time, a king decided to tax every joke told in his kingdom.</p>
      <h2 hlmH2>The King's Plan</h2>
      <p hlmP>The king thought long and hard, and finally came up with a brilliant plan.</p>
      <blockquote hlmBlockquote>"After all," he said, "everyone enjoys a good joke, so it's only fair."</blockquote>
      <h3 hlmH3>The Joke Tax</h3>
      <p hlmP>The king's subjects were not amused. They grumbled and complained.</p>
      <ul hlmUl>
        <li>1st level of puns: 5 gold coins</li>
        <li>2nd level of jokes: 10 gold coins</li>
        <li>3rd level of one-liners: 20 gold coins</li>
      </ul>
    </article>
  `,
})
export class DemoArticle {}
```

### 2. Headings hierarchy (h1–h4)

```ts
// demo-headings.component.ts
import { Component } from '@angular/core';
import { HlmTypographyImports } from '@egose/shadcn-theme-ng/typography';

@Component({
  selector: 'demo-headings',
  standalone: true,
  imports: [...HlmTypographyImports],
  template: `
    <h1 hlmH1>Heading 1 — page title</h1>
    <h2 hlmH2>Heading 2 — section (with bottom border)</h2>
    <h3 hlmH3>Heading 3 — subsection</h3>
    <h4 hlmH4>Heading 4 — detail header</h4>
  `,
})
export class DemoHeadings {}
```

Keep one `<h1>` per page and nest levels without skipping (h1→h2→h3).

### 3. Lead, large, muted, small

```ts
// demo-scale.component.ts
import { Component } from '@angular/core';
import { HlmTypographyImports } from '@egose/shadcn-theme-ng/typography';

@Component({
  selector: 'demo-scale',
  standalone: true,
  imports: [...HlmTypographyImports],
  template: `
    <p hlmLead>A lead paragraph introduces the page — larger, muted.</p>
    <p hlmP>Body copy with comfortable <code hlmCode>leading-7</code> rhythm.</p>
    <div hlmLarge>Large: callouts, card titles, key figures.</div>
    <p hlmMuted>Muted: timestamps, helper text, captions.</p>
    <span hlmSmall>Small: labels, badges, table meta.</span>
  `,
})
export class DemoScale {}
```

### 4. Inline code + blockquote

```html
<p hlmP>Run <code hlmCode>ng build my-lib</code> to build, then <code hlmCode>npm publish</code> to release.</p>
<blockquote hlmBlockquote>
  "Design is the silent ambassador of your brand." — pair with a <cite>cite</cite> for attribution.
</blockquote>
```

### 5. Lists (bulleted + mixed content)

```html
<ul hlmUl>
  <li>Ship one library per component.</li>
  <li>
    Consume via subpath imports:
    <code hlmCode>@egose/shadcn-theme-ng/button</code>
  </li>
  <li>Theme with CSS variables — no forks.</li>
</ul>
```

### 6. Advanced: reusing class constants in custom components

```ts
// prose.component.ts
import { Component, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { hlmH2, hlmP } from '@egose/shadcn-theme-ng/typography';

@Component({
  selector: 'app-prose-title',
  standalone: true,
  template: `<h2 [class]="classes()"><ng-content /></h2>`,
})
export class ProseTitle {
  readonly tone = input<'default' | 'muted'>('default');

  protected classes() {
    return hlm(hlmH2, this.tone() === 'muted' && 'text-muted-foreground');
  }
}

@Component({
  selector: 'app-prose-body',
  standalone: true,
  template: `<p [class]="hlmP"><ng-content /></p>`,
})
export class ProseBody {
  protected readonly hlmP = hlmP;
}
```

## Accessibility notes

- Use real heading levels in order (`h1`→`h2`→`h3`); the directives style but never repair skipped levels — screen-reader navigation depends on the elements you choose.
- `HlmMuted`/`HlmSmall` reduce size/contrast — verify contrast ratios for body text (muted grays can fail on light backgrounds at small sizes).
- `<blockquote>` should contain the quote; add `<cite>`/attribution outside or within per your style guide.
- `<code hlmCode>` is inline; for multi-line samples use `<pre><code>` with your own overflow handling and a plaintext alternative when meaning depends on formatting.

## Theming / CSS variables

Type styles key off `border-border`, `bg-muted`, and `text-muted-foreground` tokens, so they track your shadcn theme automatically. No per-component CSS variables.

## Related subpaths

- `@egose/shadcn-theme-ng/card` — `CardTitle`/`CardDescription` surfaces that pair with type scale.
- `@egose/shadcn-theme-ng/table` — tabular content styled alongside prose.
- `@egose/shadcn-theme-ng/badge` / `@egose/shadcn-theme-ng/kbd` — inline semantics to mix into paragraphs.
- `@egose/shadcn-theme-ng/utils` — `hlm()` for composing the exported class constants.
