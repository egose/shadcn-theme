'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormTagPicker } from '@egose/shadcn-theme/components/form/hook-tag-picker';
import { Button } from '@egose/shadcn-theme/components/ui/button';

import { tagSuggestions } from '../fixtures';

export default function HookTagPickerFormShowcase() {
  const methods = useForm<{ tags: string[] }>({ defaultValues: { tags: ['Docs'] } });

  return (
    <ExamplePage
      title="Hook Tag Picker"
      description="Bind tag creation and suggestion picking directly to react-hook-form field arrays of strings."
    >
      <ExampleSection title="Release tags">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.tags.join(', ') }))}
          >
            <HookFormTagPicker name="tags" label="Tags" suggestions={tagSuggestions} placeholder="Add a tag" />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
