import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRocket } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'app-icon-page',
  imports: [NgIcon, HlmIcon],
  providers: [provideIcons({ lucideRocket })],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Icon</h3>
    <p class="tw:text-gray-500 tw:mb-4">Styled icon directive.</p>

    <ng-icon hlm name="lucideRocket" size="xl" />
  `,
})
export class IconPage {}
