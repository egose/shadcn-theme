import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  EgAccordion,
  EgAccordionContent,
  EgAccordionIcon,
  EgAccordionItem,
  EgAccordionTrigger,
} from '@egose/shadcn-theme-ng/accordion';
import { EgIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'app-accordion',
  imports: [EgAccordion, EgAccordionItem, EgAccordionTrigger, EgAccordionIcon, EgAccordionContent, NgIcon, EgIcon],
  template: `
    <div egAccordion>
      <div egAccordionItem>
        <button egAccordionTrigger>
          Product Information
          <ng-icon name="lucideChevronDown" eg egAccIcon />
        </button>
        <eg-accordion-content>
          <p>
            Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it
            offers unparalleled performance and reliability.
          </p>

          <p>
            Key features include advanced processing capabilities, and an intuitive user interface designed for both
            beginners and experts.
          </p>
        </eg-accordion-content>
      </div>

      <div egAccordionItem>
        <button egAccordionTrigger>
          Shipping Details
          <ng-icon name="lucideChevronDown" eg egAccIcon />
        </button>
        <eg-accordion-content>
          <p>
            We offer worldwide shipping through trusted courier partners. Standard delivery takes 3-5 business days,
            while express shipping ensures delivery within 1-2 business days.
          </p>

          <p>
            All orders are carefully packaged and fully insured. Track your shipment in real-time through our dedicated
            tracking portal.
          </p>
        </eg-accordion-content>
      </div>

      <div egAccordionItem>
        <button egAccordionTrigger>
          Return Policy
          <ng-icon name="lucideChevronDown" eg egAccIcon />
        </button>
        <eg-accordion-content>
          <p>
            We stand behind our products with a comprehensive 30-day return policy. If you're not completely satisfied,
            simply return the item in its original condition.
          </p>

          <p>
            Our hassle-free return process includes free return shipping and full refunds processed within 48 hours of
            receiving the returned item.
          </p>
        </eg-accordion-content>
      </div>
    </div>
  `,
})
export class AccordionPage {}
