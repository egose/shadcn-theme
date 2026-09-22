# Confirmation Dialog (`@egose/shadcn-theme-ng/confirmation-dialog`)

A promise-based "Are you sure?" modal — the Angular equivalent of a shadcn/ui `AlertDialog` confirmation shortcut. Instead of composing dialog primitives by hand, you call `EgConfirmationDialogService.showConfirmationDialog({ title, description })` and `await` a `Promise<boolean>` (`true` = Confirm, `false` = Cancel/dismiss). The rendered `EgConfirmationDialog` component itself (warning icon + title + description + Cancel/Confirm footer) is opened through `HlmDialogService` from `@egose/shadcn-theme-ng/dialog` with a `BrnDialogRef<boolean>` result. There is no `*Imports` array and no `*Module` — the public surface is the component, the service, and a deprecated misspelled alias.

Ships as `@egose/shadcn-theme-ng/confirmation-dialog` and `@egose/shadcn-theme-ng-tw/confirmation-dialog` (the `tw:`-prefixed variant). See the [package README](../../README.md) for install, peer dependencies, and Tailwind setup. Do not publish this project directory independently — it is consumed via the published subpath only.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peers are listed in the [package README](../../README.md). This subpath declares `@angular/common` and `@angular/core` as peers (see `projects/confirmation-dialog/package.json`); at runtime it uses `@egose/shadcn-theme-ng/dialog`, `button`, `alert`, and `icon`, so install the whole package.

## Imports

The public API (`projects/confirmation-dialog/src/public-api.ts`) exports exactly:

```ts
import {
  EgConfirmationDialog,
  EgConfirmationDialogService,
  // Deprecated misspelled alias (type + const) — do not use in new code:
  EgConfirmationDiaglog,
} from '@egose/shadcn-theme-ng/confirmation-dialog';
// tw variant:
// import { ... } from '@egose/shadcn-theme-ng-tw/confirmation-dialog';
```

There is no `EgConfirmationDialogImports` and no `EgConfirmationDialogModule`. The service is `@Injectable({ providedIn: 'root' })` — just inject it:

```ts
import { Component, inject } from '@angular/core';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';

@Component({ selector: 'app-demo', standalone: true, template: `...` })
export class DemoComponent {
  private readonly confirm = inject(EgConfirmationDialogService);
}
```

> `EgConfirmationDiaglog` (missing the second `a`) is a deprecated type+const alias for `EgConfirmationDialog` kept for back-compat. It will be removed in the next major release — use the correctly spelled name.

## Anatomy / Structure

You never write the dialog markup yourself — the service opens this fixed template:

```html
<!-- Rendered by EgConfirmationDialog (fixed internal template) -->
<hlm-dialog-header>
  <div class="tw:flex tw:items-center tw:gap-1">
    <ng-icon hlm hlmAlertIcon name="lucideTriangleAlert" size="base" />
    <h3 hlmDialogTitle>{{ title }}</h3>
  </div>
  <p hlmDialogDescription>{{ description }}</p>
</hlm-dialog-header>

<hlm-dialog-footer>
  <button hlmButton variant="secondary" appearance="outline">Cancel</button>
  <button hlmButton variant="danger">Confirm</button>
</hlm-dialog-footer>
```

- `EgConfirmationDialog` has **no selector** — it is instantiated by `HlmDialogService.open<boolean>(EgConfirmationDialog, { context: { title, description } })`.
- Title/description fall back to `'Are you absolutely sure?'` / `'This action cannot be undone.'` when the context omits them.
- `close(confirm: boolean)` closes the `BrnDialogRef<boolean>` with the result; Cancel resolves `false`, Confirm resolves `true`, and dismissing (X / backdrop / Escape) resolves `false` via `closed$ ?? false`.

## API reference

### `EgConfirmationDialogService`

`@Injectable({ providedIn: 'root' })`, constructor-injects `HlmDialogService`.

| Method                   | Signature                                                                              | Description                                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `showConfirmationDialog` | `({ title, description }: { title: string; description: string }) => Promise<boolean>` | Opens the modal with the given copy; resolves `true` on Confirm, `false` on Cancel or any dismiss. |

Implementation detail: subscribes to `dialogRef.closed$` once per call and resolves `confirm ?? false`.

### `EgConfirmationDialog`

Standalone component (no selector), opened via the dialog service.

| Member  | Type                         | Description                                                                                 |
| ------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| `close` | `(confirm: boolean) => void` | Closes the dialog with the boolean result. Wired to the two footer buttons in the template. |

Reads `{ title, description }` from `injectBrnDialogContext()`.

## Examples

### 1. Basic delete confirmation (`async/await`)

```ts
import { Component, inject } from '@angular/core';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  template: `<button type="button" (click)="onDelete()">Delete project</button>`,
})
export class DeleteButtonComponent {
  private readonly confirm = inject(EgConfirmationDialogService);

  async onDelete() {
    const ok = await this.confirm.showConfirmationDialog({
      title: 'Delete project?',
      description: 'This will permanently delete the project and all of its data.',
    });
    if (ok) {
      console.log('deleting…');
    }
  }
}
```

### 2. Promise-chain style (no `async`)

```ts
import { Component, inject } from '@angular/core';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';

@Component({
  selector: 'app-leave-page',
  standalone: true,
  template: `<button type="button" (click)="leave()">Discard changes</button>`,
})
export class LeavePageComponent {
  private readonly confirm = inject(EgConfirmationDialogService);

  leave() {
    this.confirm
      .showConfirmationDialog({
        title: 'Discard unsaved changes?',
        description: 'Your edits will be lost if you leave this page.',
      })
      .then((ok) => {
        if (ok) console.log('navigating away…');
      });
  }
}
```

### 3. Destructive row action in a table

Each row awaits its own confirmation before mutating the list.

```ts
import { Component, inject, signal } from '@angular/core';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';

interface Member {
  id: number;
  name: string;
}

@Component({
  selector: 'app-members-table',
  standalone: true,
  template: `
    <ul>
      @for (m of members(); track m.id) {
        <li class="flex items-center justify-between py-1">
          <span>{{ m.name }}</span>
          <button type="button" (click)="remove(m)">Remove</button>
        </li>
      }
    </ul>
  `,
})
export class MembersTableComponent {
  private readonly confirm = inject(EgConfirmationDialogService);
  readonly members = signal<Member[]>([
    { id: 1, name: 'Ada' },
    { id: 2, name: 'Grace' },
  ]);

  async remove(m: Member) {
    const ok = await this.confirm.showConfirmationDialog({
      title: `Remove ${m.name}?`,
      description: `${m.name} will lose access immediately. You can re-invite them later.`,
    });
    if (ok) this.members.update((ms) => ms.filter((x) => x.id !== m.id));
  }
}
```

### 4. Guarding a reactive form reset

```ts
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <input formControlName="name" placeholder="Workspace name" />
      <button type="button" (click)="reset()">Reset to defaults</button>
    </form>
  `,
})
export class SettingsFormComponent {
  private readonly confirm = inject(EgConfirmationDialogService);
  readonly form = new FormGroup({ name: new FormControl('acme') });

  async reset() {
    if (this.form.pristine) return;
    const ok = await this.confirm.showConfirmationDialog({
      title: 'Reset settings?',
      description: 'All fields return to their default values.',
    });
    if (ok) this.form.reset({ name: 'acme' });
  }
}
```

### 5. Sequential confirmations (two-step destructive flow)

Await twice — e.g. confirm scope, then confirm irreversibility.

```ts
import { Component, inject } from '@angular/core';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';

@Component({
  selector: 'app-purge-flow',
  standalone: true,
  template: `<button type="button" (click)="purge()">Purge organization</button>`,
})
export class PurgeFlowComponent {
  private readonly confirm = inject(EgConfirmationDialogService);

  async purge() {
    const step1 = await this.confirm.showConfirmationDialog({
      title: 'Purge all data?',
      description: 'This affects every project in the organization.',
    });
    if (!step1) return;

    const step2 = await this.confirm.showConfirmationDialog({
      title: 'Are you absolutely sure?',
      description: 'This action cannot be undone. Backups are deleted too.',
    });
    if (step2) console.log('purging…');
  }
}
```

### 6. Opening the component directly (custom dialog options)

If you need non-default dialog chrome (different `contentClass`, close behavior), bypass the service and use `HlmDialogService` with `EgConfirmationDialog` directly.

```ts
import { Component, inject } from '@angular/core';
import { EgConfirmationDialog } from '@egose/shadcn-theme-ng/confirmation-dialog';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';

@Component({
  selector: 'app-custom-open',
  standalone: true,
  template: `<button type="button" (click)="open()">Review defaults</button>`,
})
export class CustomOpenComponent {
  private readonly dialogs = inject(HlmDialogService);

  open() {
    // No title/description → component falls back to its default copy.
    const ref = this.dialogs.open<boolean>(EgConfirmationDialog, {
      context: { title: '', description: '' },
      contentClass: 'sm:max-w-md',
    });
    ref.closed$.subscribe((ok) => console.log('result:', ok ?? false));
  }
}
```

## Accessibility notes

- The dialog uses the standard `hlm-dialog` primitives (`hlmDialogTitle` + `hlmDialogDescription`), so screen readers announce title/description on open and focus is trapped/moved per the dialog service.
- Confirm is styled `variant="danger"` and Cancel `variant="secondary" appearance="outline"` — the safe action is visually distinct; keyboard order is Cancel → Confirm.
- Dismiss (Escape/backdrop/X) resolves `false` — the destructive path always requires an explicit Confirm click.
- Keep `title`/`description` specific ("Delete 'Q3 report'?") rather than generic so SR users hear the consequence without surrounding context.

## Theming / CSS variables

No component-specific CSS variables. The icon uses `hlmAlertIcon` (warning treatment), the title is `text-xl`, the description `text-base text-gray-700`, and the footer is `mt-4`. Buttons follow the shared `hlmButton` `secondary`/`danger` variants in both themes.

## Related subpaths

- `@egose/shadcn-theme-ng/dialog` — `HlmDialogService.open`, title/description/footer primitives behind this shortcut.
- `@egose/shadcn-theme-ng/alert-dialog` — fully custom alert dialogs when you need your own buttons/copy/layout.
- `@egose/shadcn-theme-ng/button` — `secondary`/`danger` variants used by the footer.
- `@egose/shadcn-theme-ng/alert` — `HlmAlertIcon` warning treatment for the header icon.
