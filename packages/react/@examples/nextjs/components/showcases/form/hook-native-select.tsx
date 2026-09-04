'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormNativeSelect } from '@egose/shadcn-theme/components/form/hook-native-select';
import { Button } from '@egose/shadcn-theme/components/ui/button';

import { selectOptions } from '../fixtures';

export default function HookNativeSelectFormShowcase() {
  const methods = useForm<{ plan: string }>({ defaultValues: { plan: 'growth' } });

  return (
    <ExamplePage
      title="Hook Native Select"
      description="Register a native select directly through the form context wrapper."
    >
      <ExampleSection title="Plan selector">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.plan }))}
          >
            <HookFormNativeSelect name="plan" label="Plan" data={selectOptions} />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
