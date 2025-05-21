'use client';

import { FormProvider, useForm } from '../../../../package/node_modules/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../package/components/ui/button';
import { HookFormTextInput } from '../../../../package/components/form/hook-text-input';

const validationSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  address: z.string().min(1).max(100),
  age: z.preprocess((v) => Number(v), z.number().min(20)),
  height: z.preprocess((v) => Number(v), z.number().min(100)),
});

export default function Page() {
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {},
  });

  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-5">Text Input</h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(console.log)} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 md:py-2">
            <HookFormTextInput
              label="First name"
              name="firstName"
              placeholder="Enter first name..."
              required
              classNames={{ wrapper: 'col-span-1 mt-2' }}
            />
            <HookFormTextInput
              label="Last name"
              name="lastName"
              placeholder="Enter last name..."
              required
              classNames={{ wrapper: 'col-span-1 mt-2' }}
            />
            <HookFormTextInput
              label="Address"
              name="address"
              placeholder="Enter address..."
              classNames={{ wrapper: 'col-span-1 mt-2' }}
            />
            <HookFormTextInput
              name="age"
              type="number"
              placeholder="Enter age..."
              classNames={{ wrapper: 'col-span-1 mt-2' }}
            />
            <HookFormTextInput
              name="height"
              placeholder="Enter height..."
              disabled
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
