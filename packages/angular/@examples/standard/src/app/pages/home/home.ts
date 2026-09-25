import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catalogEntriesByKind, catalogLink } from '../../catalog/catalog';

/** First registry entry link per kind, so the home page never hard-codes a demo slug. */
function firstLink(kind: 'component' | 'example', fallback: string): string {
  const first = catalogEntriesByKind(kind)[0];
  return first ? catalogLink(first) : fallback;
}

/**
 * Landing page for the standard example (`/home`).
 *
 * One `h1`, registry-derived counts, and registry-derived entry links into
 * the component gallery and the real product examples. The shell hides its
 * secondary navigation here; section navigation appears once a section is
 * selected.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  styles: ':host { display: block; width: 100%; }',
  template: `
    <section class="tw:mx-auto tw:w-full tw:max-w-7xl tw:space-y-6" data-testid="home-page">
      <div class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm sm:tw:p-8">
        <div class="tw:max-w-3xl tw:space-y-3">
          <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.24em] tw:text-slate-500">
            Angular Standard Example
          </p>
          <h1 class="tw:text-3xl tw:font-semibold tw:tracking-tight tw:text-slate-950 sm:tw:text-4xl">
            Shadcn theme for Angular, running live
          </h1>
          <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
            Browse every packaged @egose/shadcn-theme-ng component with realistic page spacing, or walk through complete
            product flows composed from the same primitives. Pick a section below to reveal its navigation.
          </p>
        </div>

        <div class="tw:mt-6 tw:grid tw:gap-3 sm:tw:grid-cols-2">
          <a
            [routerLink]="componentLink"
            class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-3 tw:no-underline tw:shadow-sm tw:transition-colors hover:tw:border-slate-300 hover:tw:bg-slate-100"
          >
            <span class="tw:block tw:text-sm tw:font-semibold tw:text-slate-900">Component gallery</span>
            <span class="tw:mt-0.5 tw:block tw:text-sm tw:text-slate-600" data-testid="home-component-count">
              Browse all {{ componentCount }} component demos, grouped by category.
            </span>
          </a>
          <a
            [routerLink]="exampleLink"
            class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-3 tw:no-underline tw:shadow-sm tw:transition-colors hover:tw:border-slate-300 hover:tw:bg-slate-100"
          >
            <span class="tw:block tw:text-sm tw:font-semibold tw:text-slate-900">Real product examples</span>
            <span class="tw:mt-0.5 tw:block tw:text-sm tw:text-slate-600" data-testid="home-example-count">
              Walk through {{ exampleCount }} realistic application flows.
            </span>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class HomePage {
  // Displayed counts and entry links derive from the registry so they can
  // never drift from the real routes, menus, or search data.
  protected readonly componentCount = catalogEntriesByKind('component').length;
  protected readonly exampleCount = catalogEntriesByKind('example').length;
  protected readonly componentLink = firstLink('component', '/components/button');
  protected readonly exampleLink = firstLink('example', '/examples/pricing');
}
