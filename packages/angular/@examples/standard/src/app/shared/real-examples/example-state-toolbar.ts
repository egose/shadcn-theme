import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { EXAMPLE_VIEW_STATES, ExampleViewState } from './example-view-state';

/**
 * Catalog-state toolbar for real product examples.
 *
 * This is catalog tooling, not product UI: the badge labels it visibly as
 * such, and it lives outside the product-surface semantics of the owning
 * example page. Every planned flow (pricing, team management, settings,
 * support inbox) binds to it to preview loading, empty, error, loaded, and
 * read-only/permission states without a backend.
 *
 * State is owned by the example page through two-way `model` bindings so
 * page reload logic and these controls always agree.
 */
@Component({
  selector: 'app-example-state-toolbar',
  standalone: true,
  imports: [HlmButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'tw:block' },
  template: `
    <section
      data-testid="example-state-toolbar"
      aria-label="Catalog example state controls"
      class="tw:space-y-3 tw:rounded-2xl tw:border tw:border-dashed tw:border-slate-300 tw:bg-slate-50 tw:p-4"
    >
      <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
        <span
          data-testid="example-state-toolbar-badge"
          class="tw:rounded-full tw:bg-slate-900 tw:px-2.5 tw:py-1 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.14em] tw:text-white"
        >
          Catalog tooling
        </span>
        <p class="tw:text-xs tw:text-slate-600">Demo state controls — not part of the product UI.</p>
      </div>

      <div class="tw:flex tw:flex-wrap tw:gap-2" role="group" aria-label="Preview state">
        @for (state of viewStates; track state) {
          <button
            hlmButton
            type="button"
            size="sm"
            [variant]="viewState() === state ? 'default' : 'secondary'"
            [attr.aria-pressed]="viewState() === state"
            [attr.data-testid]="'example-state-' + state"
            (click)="viewState.set(state)"
          >
            {{ stateLabel(state) }}
          </button>
        }
      </div>

      <div class="tw:flex tw:flex-wrap tw:gap-x-6 tw:gap-y-2">
        <label class="tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-2 tw:text-sm tw:text-slate-700">
          <input
            type="checkbox"
            class="tw:h-4 tw:w-4 tw:accent-slate-900"
            [checked]="readOnly()"
            (change)="readOnly.set($any($event.target).checked)"
            data-testid="example-state-readonly"
          />
          Read-only preview
        </label>
        <label class="tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-2 tw:text-sm tw:text-slate-700">
          <input
            type="checkbox"
            class="tw:h-4 tw:w-4 tw:accent-slate-900"
            [checked]="simulateFailure()"
            (change)="simulateFailure.set($any($event.target).checked)"
            data-testid="example-state-simulate-failure"
          />
          Simulate reload failure
        </label>
      </div>
    </section>
  `,
})
export class ExampleStateToolbarComponent {
  /** Preview state owned by the example page. */
  readonly viewState = model<ExampleViewState>('loaded');
  /** When true the page disables mutation controls with an explanation. */
  readonly readOnly = model<boolean>(false);
  /** When true the page's next simulated reload rejects instead of resolving. */
  readonly simulateFailure = model<boolean>(false);

  protected readonly viewStates = EXAMPLE_VIEW_STATES;

  protected stateLabel(state: ExampleViewState): string {
    switch (state) {
      case 'loading':
        return 'Loading';
      case 'empty':
        return 'Empty';
      case 'error':
        return 'Error';
      case 'loaded':
        return 'Loaded';
    }
  }
}
