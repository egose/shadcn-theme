import { Component } from '@angular/core';
import { HlmProgress, HlmProgressIndicator } from '@egose/shadcn-theme-ng/progress';

@Component({
  selector: 'app-progress-page',
  imports: [HlmProgress, HlmProgressIndicator],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Progress</h3>
    <p class="tw:text-gray-500 tw:mb-4">Displays progress for a task.</p>
    <div class="tw:w-full">
      <hlm-progress [value]="65">
        <hlm-progress-indicator />
      </hlm-progress>
    </div>
  `,
})
export class ProgressPage {}
