'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormCheckbox } from '@egose/shadcn-theme/components/form/hook-checkbox';
import { Button } from '@egose/shadcn-theme/components/ui/button';

export default function HookCheckboxFormShowcase() {
  const methods = useForm<{ approved: boolean }>({ defaultValues: { approved: true } });

  return (
    <ExamplePage
      title="Hook Checkbox"
      description="Connect checkbox fields to react-hook-form with validation and form context."
    >
      <ExampleSection title="Submit with form context">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Submitted', { description: JSON.stringify(data) }))}
          >
            <HookFormCheckbox name="approved" label="I approve this rollout" />
            <Button type="submit">Submit</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
