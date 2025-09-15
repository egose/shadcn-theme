/*
 * Public API Surface of accordion
 */

import { NgModule } from '@angular/core';

import { HlmAccordion } from './lib/accordion';
import { HlmAccordionContent } from './lib/accordion-content';
import { HlmAccordionIcon } from './lib/accordion-icon';
import { HlmAccordionItem } from './lib/accordion-item';
import { HlmAccordionTrigger } from './lib/accordion-trigger';

export * from './lib/accordion';
export * from './lib/accordion-content';
export * from './lib/accordion-icon';
export * from './lib/accordion-item';
export * from './lib/accordion-trigger';

export const HlmAccordionImports = [
  HlmAccordion,
  HlmAccordionItem,
  HlmAccordionTrigger,
  HlmAccordionIcon,
  HlmAccordionContent,
] as const;

@NgModule({
  imports: [...HlmAccordionImports],
  exports: [...HlmAccordionImports],
})
export class HlmAccordionModule {}
