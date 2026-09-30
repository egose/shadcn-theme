import { Component, computed, input } from '@angular/core';

/** Local framing only: package controls stay visible in each section template. */
@Component({
  selector: 'app-settings-section',
  template: `
    <section
      [attr.id]="sectionId()"
      [attr.aria-labelledby]="headingId()"
      [attr.data-testid]="'settings-section-' + sectionId()"
      class="tw:min-w-0 tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-5"
    >
      <h3 [attr.id]="headingId()" tabindex="-1" class="tw:text-base tw:font-semibold tw:text-slate-900">
        {{ title() }}
      </h3>
      @if (description()) {
        <p class="tw:mt-1 tw:text-sm tw:text-slate-600">{{ description() }}</p>
      }
      <div class="tw:mt-4 tw:grid tw:min-w-0 tw:gap-4"><ng-content /></div>
    </section>
  `,
})
export class SettingsSectionComponent {
  readonly sectionId = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input('');
  protected readonly headingId = computed(() => `${this.sectionId()}-title`);
}
