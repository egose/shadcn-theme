'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../../../../../components/ui/combobox';
import { ExampleInline, ExamplePage, ExampleSection } from '@/components/showcase-shell';

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'] as const;

export default function Page() {
  return (
    <ExamplePage
      title="Combobox"
      description="Combobox combines a text input with a filterable list, useful for typeahead selection at scale."
    >
      <ExampleSection
        title="Framework picker"
        description="Typing filters the available options; an empty state replaces the list when nothing matches."
      >
        <ExampleInline>
          <Combobox items={frameworks}>
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}
