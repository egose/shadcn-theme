'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormSearchableSelect } from '@egose/shadcn-theme/components/form/hook-searchable-select';
import { Button } from '@egose/shadcn-theme/components/ui/button';

import { searchableOptions } from '../fixtures';

export default function HookSearchableSelectFormShowcase() {
  const methods = useForm<{ city: string }>({ defaultValues: { city: 'lisbon' } });

  return (
    <ExamplePage
      title="Hook Searchable Select"
      description="Use the searchable select wrapper when options are easier to scan through typeahead."
    >
      <ExampleSection title="Preferred city">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.city }))}
          >
            <HookFormSearchableSelect
              name="city"
              label="Preferred city"
              data={searchableOptions}
              placeholder="Select a city"
            />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
