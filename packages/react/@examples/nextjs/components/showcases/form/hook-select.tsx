'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormSelect } from '@egose/shadcn-theme/components/form/hook-select';
import { Button } from '@egose/shadcn-theme/components/ui/button';

import { selectOptions } from '../fixtures';

export default function HookSelectFormShowcase() {
  const methods = useForm<{ tier: string }>({ defaultValues: { tier: 'starter' } });

  return (
    <ExamplePage
      title="Hook Select"
      description="The hook-form select wrapper keeps value changes and validation centralized in form state."
    >
      <ExampleSection title="Tier selector">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.tier }))}
          >
            <HookFormSelect name="tier" label="Tier" data={selectOptions} placeholder="Choose a tier" />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
