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
  styles: ':host { display: block; width: 100%; }',
  template: `
    <section class="tw:mx-auto tw:w-full tw:max-w-7xl tw:space-y-6">
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
