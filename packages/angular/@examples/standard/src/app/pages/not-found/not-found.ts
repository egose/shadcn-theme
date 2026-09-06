import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Recovery target for the intentional root and child wildcard routes.
 * Unknown URLs under `/components/...` and anywhere else render this page
 * instead of an empty shell.
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="tw:mx-auto tw:max-w-xl tw:space-y-4 tw:py-10 tw:text-center" data-testid="not-found-page">
      <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.24em] tw:text-slate-500">404</p>
      <h2 class="tw:text-2xl tw:font-semibold tw:tracking-tight tw:text-slate-950">Page not found</h2>
      <p class="tw:text-sm tw:leading-6 tw:text-slate-600">
        The demo or page you are looking for does not exist. Pick a component from the navigation, or start again from
        the gallery.
      </p>
      <a
        routerLink="/components/button"
        class="tw:inline-flex tw:rounded-xl tw:border tw:border-slate-200 tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-slate-900 tw:shadow-sm"
      >
        Back to the component gallery
      </a>
    </section>
  `,
})
export class NotFoundPage {}
