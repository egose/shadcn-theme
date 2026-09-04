'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormDatePicker } from '@egose/shadcn-theme/components/form/hook-date-picker';
import { Button } from '@egose/shadcn-theme/components/ui/button';

export default function HookDatePickerFormShowcase() {
  const methods = useForm<{ launchDate?: Date }>({ defaultValues: { launchDate: new Date() } });

  return (
    <ExamplePage
      title="Hook Date Picker"
      description="Hook form wrappers keep controlled date pickers aligned with validation and submission."
    >
      <ExampleSection title="Launch date">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: String(data.launchDate) }))}
          >
            <HookFormDatePicker name="launchDate" label="Launch date" />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
