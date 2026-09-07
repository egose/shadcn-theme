import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { catalogEntriesByKind, catalogLink } from '../../catalog/catalog';

/**
 * Layout shell for the real product examples (`/examples/<slug>`).
 *
 * Mirrors the component gallery shell: one `h1`, a registry-derived count,
 * and a registry-derived catalog of example links so adding a flow is one
 * registry entry plus its feature directory. Routed example pages render
 * their own `h2` titles beneath this heading.
 */
@Component({
  selector: 'app-examples',
  imports: [RouterOutlet, RouterLink],
  template: `
    <section class="tw:mx-auto tw:w-full tw:max-w-7xl tw:space-y-6">
      <div class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm sm:tw:p-8">
        <div class="tw:flex tw:flex-col tw:gap-6 lg:tw:flex-row lg:tw:items-end lg:tw:justify-between">
          <div class="tw:max-w-3xl tw:space-y-3">
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.24em] tw:text-slate-500">
              Angular Standard Example
            </p>
            <h1 class="tw:text-3xl tw:font-semibold tw:tracking-tight tw:text-slate-950 sm:tw:text-4xl">
              Real product examples
            </h1>
            <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
              Realistic application flows composed from packaged @egose/shadcn-theme-ng components. Each flow keeps
              its own models and fixtures and previews loading, empty, error, loaded, and read-only states through
              catalog tooling instead of a backend.
            </p>
          </div>

          <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-3">
            <p class="tw:text-xs tw:font-medium tw:text-slate-500">Catalog</p>
            <p class="tw:mt-1 tw:text-sm tw:text-slate-700" data-testid="example-count">
              Browse all {{ exampleCount }} real examples from the list below.
            </p>
          </div>
        </div>

        <nav aria-label="Real examples" class="tw:mt-6">
          <ul data-testid="example-catalog" class="tw:grid tw:gap-3 sm:tw:grid-cols-2">
            @for (entry of examples; track entry.slug) {
              <li>
                <a
                  [routerLink]="entry.link"
                  class="tw:block tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:px-4 tw:py-3 tw:no-underline tw:shadow-sm"
                >
                  <span class="tw:block tw:text-sm tw:font-semibold tw:text-slate-900">{{ entry.title }}</span>
                  <span class="tw:mt-0.5 tw:block tw:text-xs tw:text-slate-500">{{ entry.category }}</span>
                </a>
              </li>
            }
          </ul>
        </nav>
      </div>

      <div class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-5 tw:shadow-sm sm:tw:p-8">
        <router-outlet />
      </div>
    </section>
  `,
})
export class ExamplesLayout {
  // Displayed count and catalog links derive from the registry so they can
  // never drift from the real example routes.
  protected readonly exampleCount = catalogEntriesByKind('example').length;
  protected readonly examples = catalogEntriesByKind('example').map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    category: entry.category,
    link: catalogLink(entry),
  }));
}
