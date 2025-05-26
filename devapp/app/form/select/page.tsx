'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../package/components/ui/button';
import { FormNativeSelect } from '../../../../package/components/form/native-select';
import { HookFormNativeSelect } from '../../../../package/components/form/hook-native-select';

const validationSchema = z.object({
  name: z.string(),
});

export default function Page() {
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {},
  });

  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-5">Select</h1>

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
    </>
  );
}
