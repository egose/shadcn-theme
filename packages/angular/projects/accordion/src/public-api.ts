/*
 * Public API Surface of accordion
 */

import { NgModule } from '@angular/core';

import { EgAccordion } from './lib/accordion';
import { EgAccordionContent } from './lib/accordion-content';
import { EgAccordionIcon } from './lib/accordion-icon';
import { EgAccordionItem } from './lib/accordion-item';
import { EgAccordionTrigger } from './lib/accordion-trigger';

export * from './lib/accordion';
export * from './lib/accordion-content';
export * from './lib/accordion-icon';
export * from './lib/accordion-item';
export * from './lib/accordion-trigger';

export const EgAccordionImports = [
  EgAccordion,
  EgAccordionItem,
  EgAccordionTrigger,
  EgAccordionIcon,
  EgAccordionContent,
] as const;

@NgModule({
  imports: [...EgAccordionImports],
  exports: [...EgAccordionImports],
})
export class EgAccordionModule {}
