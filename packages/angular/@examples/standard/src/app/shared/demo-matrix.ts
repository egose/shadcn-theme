import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Shared frame for the optional variant/state QA matrix that accompanies a
 * demo page. Renders an `h3` title plus optional description and projects the
 * matrix rows, so exhaustive variant grids stay visually subordinate to the
 * realistic demonstration without hiding any package markup.
 */
@Component({
  selector: 'app-demo-matrix',
  standalone: true,
  host: {
    class: 'tw:block tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6',
    role: 'region',
  },
  template: `
    <h3 class="tw:text-lg tw:font-semibold tw:text-slate-900">{{ title() }}</h3>
    @if (description(); as descriptionText) {
      <p class="tw:mt-2 tw:text-sm tw:leading-6 tw:text-slate-600">{{ descriptionText }}</p>
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoMatrixComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
}
