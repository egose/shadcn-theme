'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormTextInput } from '@egose/shadcn-theme/components/form/hook-text-input';
import { Button } from '@egose/shadcn-theme/components/ui/button';

export default function HookTextInputFormShowcase() {
  const methods = useForm<{ projectName: string; ownerEmail: string }>({
    defaultValues: { projectName: 'Release review', ownerEmail: '' },
  });

  return (
    <ExamplePage
      title="Hook Text Input"
      description="Hook text inputs are useful for plain registered fields with field-level validation."
    >
      <ExampleSection title="Project details">
        <FormProvider {...methods}>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: JSON.stringify(data) }))}
          >
            <HookFormTextInput
              name="projectName"
              label="Project name"
              rules={{ required: 'Project name is required.' }}
            />
            <HookFormTextInput name="ownerEmail" label="Owner email" rules={{ required: 'Email is required.' }} />
            <div className="md:col-span-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
