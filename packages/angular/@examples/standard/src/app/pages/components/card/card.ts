import { Component } from '@angular/core';
import {
  HlmCard,
  HlmCardHeader,
  HlmCardTitle,
  HlmCardDescription,
  HlmCardContent,
  HlmCardFooter,
} from '@egose/shadcn-theme-ng/card';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-card-page',
  imports: [HlmCard, HlmCardHeader, HlmCardTitle, HlmCardDescription, HlmCardContent, HlmCardFooter, HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Card</h3>
    <p class="tw:text-gray-500 tw:mb-4">A container with a header, content, and footer.</p>
    <div class="tw:w-[350px]">
      <div hlmCard>
        <div hlmCardHeader>
          <div hlmCardTitle>Create project</div>
          <div hlmCardDescription>Deploy your new project in one click.</div>
        </div>
        <div hlmCardContent>
          <p class="tw:text-sm">Card content goes here.</p>
        </div>
        <div hlmCardFooter class="tw:gap-2">
          <button hlmButton variant="secondary" appearance="outline">Cancel</button>
          <button hlmButton variant="primary">Deploy</button>
        </div>
      </div>
    </div>
  `,
})
export class CardPage {}
