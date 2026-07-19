'use client';

import { FormProvider, useForm } from '../../../../../node_modules/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../../../components/ui/button';
import { FormNativeSelect } from '../../../../../components/form/native-select';
import { HookFormNativeSelect } from '../../../../../components/form/hook-native-select';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

const validationSchema = z.object({
  name: z.string(),
});

export default function Page() {
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {},
  });

  return (
    <ExamplePage
      title="Native Select"
      description="Demonstrates the form-field native select variants bound to react-hook-form."
    >
      <ExampleSection
        title="Select inputs"
        description="Standalone and hook-form native selects rendered in a responsive grid."
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(console.log)} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 md:py-2">
              <FormNativeSelect
                label="First name"
                name="firstName"
                data={['John', 'Jane', 'Doe']}
                selectProps={{ required: true }}
                required
                classNames={{ wrapper: 'col-span-1 mt-2' }}
                onChange={(event) => console.log(event.target.value)}
              />
              <HookFormNativeSelect
                label="Name"
                name="name"
                data={['John', 'Jane', 'Doe']}
                required
                classNames={{ wrapper: 'col-span-1 mt-2' }}
              />
            </div>

            <Button variant="primary" type="submit" className="mt-2">
              Submit
            </Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
