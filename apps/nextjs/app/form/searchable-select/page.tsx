'use client';

import { FormProvider, useForm } from '../../../../../packages/react/node_modules/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../../packages/react/components/ui/button';
import { FormSearchableSelect } from '../../../../../packages/react/components/form/searchable-select';
import { HookFormSearchableSelect } from '../../../../../packages/react/components/form/hook-searchable-select';

const validationSchema = z.object({
  name: z.string(),
});

export default function Page() {
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: { name: 'jane' },
  });

  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-5">Select</h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(console.log)} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 md:py-2">
            <FormSearchableSelect
              label="First name"
              name="firstName"
              data={['John', 'Jane', 'Doe']}
              defaultValue="Doe"
              required
              classNames={{ wrapper: 'col-span-1 mt-2' }}
              onChange={(val) => console.log(val)}
            />
            <HookFormSearchableSelect
              label="Name"
              name="name"
              data={[
                { label: 'John', value: 'john' },
                { label: 'Jane', value: 'jane' },
                { label: 'Doe', value: 'doe' },
              ]}
              required
              classNames={{ wrapper: 'col-span-1 mt-2' }}
            />
          </div>

          <Button variant="primary" type="submit" className="mt-2">
            Submit
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
