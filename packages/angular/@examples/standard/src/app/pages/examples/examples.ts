import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Layout shell for the real product examples (`/examples/<slug>`).
 *
 * Intentionally thin: only a `router-outlet` wrapper. The catalog surface
 * lives elsewhere (home counts/links and the fly-out navigation derived from
 * `catalogMenuGroups('example')`), so this shell must not duplicate an `h1`,
 * count, or link list. Routed example pages render their own titles via
 * `app-demo-header` (`h2`) beneath the app shell.
 */
@Component({
  selector: 'app-examples',
  imports: [RouterOutlet],
  styles: ':host { display: block; width: 100%; }',
  template: `
    <section class="tw:mx-auto tw:w-full tw:max-w-7xl tw:space-y-6">
      <div class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-5 tw:shadow-sm sm:tw:p-8">
        <router-outlet />
      </div>
    </section>
  `,
})
export class ExamplesLayout {}
