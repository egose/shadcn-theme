import { Component } from '@angular/core';
import { BrnHoverCardImports } from '@spartan-ng/brain/hover-card';
import { HlmHoverCardImports } from '@egose/shadcn-theme-ng/hover-card';

@Component({
  selector: 'app-hover-card-page',
  imports: [BrnHoverCardImports, HlmHoverCardImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Hover Card</h3>
    <p class="tw:text-gray-500 tw:mb-4">Hover a trigger to reveal additional content.</p>

    <div hlmHoverCard>
      <a
        href="#"
        hlmHoverCardTrigger
        class="tw:cursor-pointer tw:underline tw:text-blue-600 tw:hover:text-blue-800"
      >
        Hover me
      </a>
      <hlm-hover-card-content class="tw:w-80">
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
