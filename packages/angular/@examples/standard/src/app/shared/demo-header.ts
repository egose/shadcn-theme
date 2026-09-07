import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Shared demo-page header. Establishes the heading contract: the routed page
 * title renders as exactly one `h2` beneath the gallery's single `h1`, followed
 * by a plain-language description of the behavior the page demonstrates.
 *
 * The component only renders the title and description; package component
 * markup always stays visible in the owning page template.
 */
@Component({
  selector: 'app-demo-header',
  standalone: true,
  host: { class: 'tw:mb-6 tw:block' },
  template: `
    <div class="tw:max-w-3xl tw:space-y-3">
      <h2 data-testid="demo-title" class="tw:text-2xl tw:font-bold tw:text-slate-950">{{ title() }}</h2>
      <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">{{ description() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
