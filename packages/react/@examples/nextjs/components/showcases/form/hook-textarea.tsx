'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormTextarea } from '@egose/shadcn-theme/components/form/hook-textarea';
import { Button } from '@egose/shadcn-theme/components/ui/button';

export default function HookTextareaFormShowcase() {
  const methods = useForm<{ notes: string }>({
    defaultValues: { notes: 'Summarize the customer call before handoff.' },
  });

  return (
    <ExamplePage
      title="Hook Textarea"
      description="Textarea fields can be registered directly when you do not need a custom controller."
    >
      <ExampleSection title="Internal notes">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.notes }))}
          >
            <HookFormTextarea
              name="notes"
              label="Internal notes"
              rows={5}
              rules={{ required: 'Notes are required.' }}
            />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
