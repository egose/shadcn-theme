import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Shared demo section frame: an optional kicker, an `h3` heading (one level
 * below the page title from `app-demo-header`), an optional description, and
 * the projected demonstration. Package component markup inside the section
 * stays fully visible in the page template; layout/styling classes are applied
 * by the page directly onto the `<app-demo-section>` host.
 *
 * `tone` switches heading/description colors for dark surfaces so framed
 * sections remain readable on `slate-950` cards.
 */
@Component({
  selector: 'app-demo-section',
  standalone: true,
  host: { class: 'tw:block' },
  template: `
    @if (kicker(); as kickerText) {
      <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em]" [class]="kickerClass()">
        {{ kickerText }}
      </p>
    }
    <h3 class="tw:mt-2 tw:text-lg tw:font-semibold" [class]="titleClass()">{{ title() }}</h3>
    @if (description(); as descriptionText) {
      <p class="tw:mt-2 tw:text-sm tw:leading-6" [class]="descriptionClass()">{{ descriptionText }}</p>
    }
    <div class="tw:mt-5">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoSectionComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly kicker = input<string | undefined>(undefined);
  readonly tone = input<'light' | 'dark'>('light');

  protected kickerClass(): string {
    return this.tone() === 'dark' ? 'tw:text-slate-400' : 'tw:text-slate-500';
  }

  protected titleClass(): string {
    return this.tone() === 'dark' ? 'tw:text-white' : 'tw:text-slate-900';
  }

  protected descriptionClass(): string {
    return this.tone() === 'dark' ? 'tw:text-slate-400' : 'tw:text-slate-600';
  }
}
