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

@Component({
  selector: 'app-accordion',
  imports: [
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
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Accordion</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Accordions read better when they answer a focused set of questions instead of feeling like generic placeholder
          copy. This page now shows two believable content patterns.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">FAQ</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Standard example review</h4>
          </div>

          <div hlmAccordion class="tw:mt-5">
            @for (item of faqItems; track item.title) {
              <div hlmAccordionItem>
                <h3 class="contents">
                  <button hlmAccordionTrigger>
                    {{ item.title }}
                    <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
                  </button>
                </h3>
                <hlm-accordion-content>
                  <p class="tw:text-sm tw:leading-7 tw:text-slate-600">{{ item.body }}</p>
                </hlm-accordion-content>
              </div>
            }
          </div>
        </article>

        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Workflow</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">How the polish pass works</h4>
          </div>

          <div hlmAccordion class="tw:mt-5">
            @for (item of workflowItems; track item.title) {
              <div hlmAccordionItem>
                <h3 class="contents">
                  <button hlmAccordionTrigger>
                    {{ item.title }}
                    <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
                  </button>
                </h3>
                <hlm-accordion-content>
                  <p class="tw:text-sm tw:leading-7 tw:text-slate-600">{{ item.body }}</p>
                </hlm-accordion-content>
              </div>
            }
          </div>
        </article>
      </div>
    </section>
  `,
})
export class AccordionPage {
  readonly faqItems = [
    {
      title: 'Why did the newer demos feel off?',
      body: 'Most of them were using very thin placeholder content, so the components looked sparse even when the primitives were correct.',
    },
    {
      title: 'What changed first?',
      body: 'The example shell was updated so every routed page rendered in a better-framed showcase area instead of a centered projection slot.',
    },
    {
      title: 'What is the goal of the current pass?',
      body: 'Make each component page read like real product UI while still preserving a compact QA surface for variants and states.',
    },
  ];

  readonly workflowItems = [
    {
      title: 'Inspect the current example',
      body: 'Identify whether the component is actually broken or just being undersold by weak content and layout.',
    },
    {
      title: 'Use a realistic scenario',
      body: 'Replace demo-only text with settings, dashboards, forms, alerts, and review flows that feel believable.',
    },
    {
      title: 'Keep a compact QA surface',
      body: 'Where needed, retain a smaller matrix or palette so variants are still easy to scan without overwhelming the page.',
    },
  ];
}
