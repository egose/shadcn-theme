import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmHoverCardImports } from '@egose/shadcn-theme-ng/hover-card';

@Component({
  selector: 'app-hover-card-page',
  imports: [DemoHeaderComponent, HlmHoverCardImports],
  template: `
    <app-demo-header title="Hover Card" description="Hover a link to reveal a preview card. The trigger is a real external link, not a placeholder anchor." />

    <div hlmHoverCard>
      <a
        href="https://nextjs.org"
        hlmHoverCardTrigger
        class="tw:cursor-pointer tw:underline tw:text-blue-600 tw:hover:text-blue-800"
      >
        Next.js
      </a>
      <hlm-hover-card-content *hlmHoverCardPortal class="tw:w-80">
        <div class="tw:flex tw:gap-4">
          <div>
            <p class="tw:font-semibold">@nextjs</p>
            <p class="tw:text-sm tw:text-gray-500">The React framework for the web.</p>
          </div>
        </div>
      </hlm-hover-card-content>
    </div>
  `,
})
export class HoverCardPage {}
