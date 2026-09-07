'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormMultiSelect } from '@egose/shadcn-theme/components/form/hook-multi-select';
import { Button } from '@egose/shadcn-theme/components/ui/button';

import { multiSelectOptions } from '../fixtures';

export default function HookMultiSelectFormShowcase() {
  const methods = useForm<{ teams: string[] }>({ defaultValues: { teams: ['ops', 'design'] } });

  return (
    <ExamplePage
      title="Hook Multi Select"
      description="Multi select integrates with react-hook-form when you need chip-based selection inside validated forms."
    >
      <ExampleSection title="Team ownership">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.teams.join(', ') }))}
          >
            <HookFormMultiSelect name="teams" label="Teams" data={multiSelectOptions} placeholder="Add a team" />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
