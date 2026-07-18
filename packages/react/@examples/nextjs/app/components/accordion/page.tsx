'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../../../components/ui/accordion';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  return (
    <ExamplePage
      title="Accordion"
      description="A vertically stacked set of collapsible sections for showing and hiding related content."
    >
      <ExampleSection title="Collapsible Items" description="Single-open accordion with a default expanded item.">
        <Accordion type="single" collapsible defaultValue="shipping" className="max-w-lg">
          <AccordionItem value="shipping">
            <AccordionTrigger>What are your shipping options?</AccordionTrigger>
            <AccordionContent>
              We offer standard (5-7 days), express (2-3 days), and overnight shipping. Free shipping on international
              orders.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>What is your return policy?</AccordionTrigger>
            <AccordionContent>
              Returns accepted within 30 days. Items must be unused and in original packaging. Refunds processed within
              5-7 business days.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="support">
            <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
            <AccordionContent>
              Reach us via email, live chat, or phone. We respond within 24 hours during business days.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ExampleSection>
    </ExamplePage>
  );
}
