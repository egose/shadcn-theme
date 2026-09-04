'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormTimeInput } from '@egose/shadcn-theme/components/form/hook-time-input';
import { Button } from '@egose/shadcn-theme/components/ui/button';

export default function HookTimeInputFormShowcase() {
  const methods = useForm<{ estimate: number }>({ defaultValues: { estimate: 2 } });

  return (
    <ExamplePage
      title="Hook Time Input"
      description="The hook time input keeps normalized hour values in form state while users type flexible durations."
    >
      <ExampleSection title="Estimate">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: String(data.estimate) }))}
          >
            <HookFormTimeInput name="estimate" label="Estimate" rules={{ required: 'Estimate is required.' }} />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
