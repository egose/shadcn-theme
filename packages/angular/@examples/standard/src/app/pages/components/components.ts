import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catalogEntriesByKind } from '../../catalog/catalog';

@Component({
  selector: 'app-components',
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
export class ComponentsLayout {
  // Displayed in the header; derived from the registry so the count can never
  // drift from the real route/menu/search data.
  protected readonly demoCount = catalogEntriesByKind('component').length;
}
