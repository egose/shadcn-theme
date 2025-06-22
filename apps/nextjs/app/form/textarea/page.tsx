'use client';

import { FormProvider, useForm } from '../../../../../packages/react/node_modules/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../../packages/react/components/ui/button';
import { HookFormTextarea } from '../../../../../packages/react/components/form/hook-textarea';

const validationSchema = z.object({
  name: z.string().min(1).max(100),
  sentence: z.string().min(1).max(100),
  address: z.string().optional(),
});
export default function Page() {
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      sentence:
        'The morning air was crisp, carrying the scent of damp earth and fresh pine as the sun peeked over the horizon. Birds stirred in the branches, their songs blending into a gentle symphony that signaled the start of a new day.',
    },
  });

  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-5">Textarea</h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(console.log)} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 md:py-2">
            <HookFormTextarea
              label="Name"
              name="name"
              placeholder="Enter name..."
              required
              classNames={{ wrapper: 'col-span-1 mt-2' }}
            />
            <HookFormTextarea
              label="Sentence"
              name="sentence"
              placeholder="Enter sentence..."
              required
              disabled
              classNames={{ wrapper: 'col-span-1 mt-2' }}
            />
            <HookFormTextarea
              name="address"
              placeholder="Enter address..."
              classNames={{ wrapper: 'col-span-1 mt-2' }}
              rows={10}
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
