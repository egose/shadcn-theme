import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  HlmAccordion,
  HlmAccordionContent,
  HlmAccordionIcon,
  HlmAccordionItem,
  HlmAccordionTrigger,
} from '@egose/shadcn-theme-ng/accordion';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';

@Component({
  selector: 'app-accordion',
  imports: [
    DemoHeaderComponent,
    DemoSectionComponent,
    HlmAccordion,
    HlmAccordionItem,
    HlmAccordionTrigger,
    HlmAccordionIcon,
    HlmAccordionContent,
    NgIcon,
    HlmIcon,
  ],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Accordion"
        description="Vertically stacked disclosure panels: each trigger expands or collapses its own content region while the trigger keeps an accessible expanded state."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm"
          kicker="FAQ"
          title="Billing questions"
        >
          <div hlmAccordion>
            @for (item of faqItems; track item.title) {
              <div hlmAccordionItem>
                <h4 class="contents">
                  <button hlmAccordionTrigger>
                    {{ item.title }}
                    <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
                  </button>
                </h4>
                <hlm-accordion-content>
                  <p class="tw:text-sm tw:leading-7 tw:text-slate-600">{{ item.body }}</p>
                </hlm-accordion-content>
              </div>
            }
          </div>
        </app-demo-section>

        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6"
          kicker="Workflow"
          title="Publishing a documentation page"
        >
          <div hlmAccordion>
            @for (item of workflowItems; track item.title) {
              <div hlmAccordionItem>
                <h4 class="contents">
                  <button hlmAccordionTrigger>
                    {{ item.title }}
                    <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
                  </button>
                </h4>
                <hlm-accordion-content>
                  <p class="tw:text-sm tw:leading-7 tw:text-slate-600">{{ item.body }}</p>
                </hlm-accordion-content>
              </div>
            }
          </div>
        </app-demo-section>
      </div>
    </section>
  `,
})
export class AccordionPage {
  readonly faqItems = [
    {
      title: 'When does the monthly plan renew?',
      body: 'Plans renew on the first day of each billing cycle, and payment method changes apply to the next renewal.',
    },
    {
      title: 'Can I switch plans mid-cycle?',
      body: 'Yes. Upgrades take effect immediately with prorated pricing; downgrades take effect at the next renewal.',
    },
    {
      title: 'How do I export my invoices?',
      body: 'Open the billing settings and choose “Export invoices” to download a CSV of every completed payment.',
    },
  ];

  readonly workflowItems = [
    {
      title: 'Draft the page',
      body: 'Create the page in the workspace and write the first version in the editor.',
    },
    {
      title: 'Request review',
      body: 'Assign a reviewer; they can comment inline and approve or request changes.',
    },
    {
      title: 'Publish',
      body: 'Once approved, publish to make the page visible to every workspace member.',
    },
  ];
}
