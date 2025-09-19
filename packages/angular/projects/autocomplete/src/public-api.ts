/*
 * Public API Surface of autocomplete
 */

import { NgModule } from '@angular/core';
import { HlmAutocomplete } from './lib/autocomplete';
import { HlmAutocompleteEmpty } from './lib/autocomplete-empty';
import { HlmAutocompleteGroup } from './lib/autocomplete-group';
import { HlmAutocompleteItem } from './lib/autocomplete-item';
import { HlmAutocompleteList } from './lib/autocomplete-list';
import { HlmAutocompleteSearch } from './lib/autocomplete-search';
import { HlmAutocompleteSearchInput } from './lib/autocomplete-search-input';
import { HlmAutocompleteTrigger } from './lib/autocomplete-trigger';

export * from './lib/autocomplete';
export * from './lib/autocomplete-empty';
export * from './lib/autocomplete-group';
export * from './lib/autocomplete-item';
export * from './lib/autocomplete-list';
export * from './lib/autocomplete-search';
export * from './lib/autocomplete-search-input';
export * from './lib/autocomplete-trigger';
export * from './lib/autocomplete.token';

export const HlmAutocompleteImports = [
  HlmAutocomplete,
  HlmAutocompleteEmpty,
  HlmAutocompleteGroup,
  HlmAutocompleteItem,
  HlmAutocompleteList,
  HlmAutocompleteSearch,
  HlmAutocompleteSearchInput,
  HlmAutocompleteTrigger,
] as const;

@NgModule({
  imports: [...HlmAutocompleteImports],
  exports: [...HlmAutocompleteImports],
})
export class HlmAutocompleteModule {}
