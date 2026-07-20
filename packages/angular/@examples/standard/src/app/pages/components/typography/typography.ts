import { Component } from '@angular/core';
import {
  HlmTypographyImports,
  HlmH1,
  HlmH2,
  HlmH3,
  HlmH4,
  HlmP,
  HlmLead,
  HlmLarge,
  HlmSmall,
  HlmMuted,
  HlmBlockquote,
  HlmCode,
  HlmUl,
} from '@egose/shadcn-theme-ng/typography';

@Component({
  selector: 'app-typography-page',
  imports: [
    HlmTypographyImports,
    HlmH1,
    HlmH2,
    HlmH3,
    HlmH4,
    HlmP,
    HlmLead,
    HlmLarge,
    HlmSmall,
    HlmMuted,
    HlmBlockquote,
    HlmCode,
    HlmUl,
  ],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Typography</h3>
    <p class="tw:text-gray-500 tw:mb-4">Semantic typographic primitives.</p>
    <div class="tw:flex tw:flex-col tw:gap-3">
      <h1 hlmH1>Heading 1</h1>
      <h2 hlmH2>Heading 2</h2>
      <h3 hlmH3>Heading 3</h3>
      <h4 hlmH4>Heading 4</h4>
      <p hlmP>Regular paragraph text.</p>
      <p hlmLead>Lead paragraph.</p>
      <p hlmLarge>Large text.</p>
      <p hlmSmall>Small text.</p>
      <p hlmMuted>Muted text.</p>
      <blockquote hlmBlockquote>A blockquote.</blockquote>
      <code hlmCode>const x = 1;</code>
      <ul hlmUl>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </div>
  `,
})
export class TypographyPage {}
