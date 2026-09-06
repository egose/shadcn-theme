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
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';

@Component({
  selector: 'app-typography-page',
  imports: [
    DemoHeaderComponent,
    DemoSectionComponent,
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
    <section class="tw:space-y-8">
      <app-demo-header
        title="Typography"
        description="Semantic typographic primitives for headings, body text, lead copy, blockquotes, inline code, and lists."
      />

      <!-- Specimen elements are pinned to h4 so the page keeps its h2 -> h3 ->
      h4 contract; the hlmH1..hlmH4 directives only supply the visual styles. -->
      <app-demo-section title="Heading scale">
        <div class="tw:flex tw:flex-col tw:gap-3">
          <h4 hlmH1>Heading 1 (hlmH1)</h4>
          <h4 hlmH2>Heading 2 (hlmH2)</h4>
          <h4 hlmH3>Heading 3 (hlmH3)</h4>
          <h4 hlmH4>Heading 4 (hlmH4)</h4>
        </div>
      </app-demo-section>

      <app-demo-section title="Body and inline text">
        <div class="tw:flex tw:flex-col tw:gap-3">
          <p hlmLead>Lead paragraph for page introductions.</p>
          <p hlmP>Regular paragraph text.</p>
          <p hlmLarge>Large text.</p>
          <p hlmSmall>Small text.</p>
          <p hlmMuted>Muted text.</p>
          <blockquote hlmBlockquote>A blockquote for cited content.</blockquote>
          <code hlmCode>const answer = 42;</code>
          <ul hlmUl>
            <li>List item one</li>
            <li>List item two</li>
          </ul>
        </div>
      </app-demo-section>
    </section>
  `,
})
export class TypographyPage {}
