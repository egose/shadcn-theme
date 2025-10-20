'use client';

import { FormProvider, useForm } from '../../../../../node_modules/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../../components/ui/button';
import { HookFormTextInput } from '../../../../../components/form/hook-text-input';
import { FormTimeInput } from '../../../../../components/form/time-input';
import { HookFormTimeInput } from '../../../../../components/form/hook-time-input';
import { FormCheckbox } from '../../../../../components/form/checkbox';
import { HookFormCheckbox } from '../../../../../components/form/hook-checkbox';
import { CopyableButton } from '../../../../../components/ui/copy-button';
import { toast } from 'sonner';

const validationSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  address: z.string().min(1).max(100),
  age: z.preprocess((v) => Number(v), z.number().min(20)),
  height: z.string().optional(),
  duration: z.number(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
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
        <form
          onSubmit={methods.handleSubmit((formData) => {
            console.log('Form submitted:', formData);
            toast('Submitted', {
              description: 'Successfully submitted the form.',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
            });
          })}
          autoComplete="off"
        >
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
            <HookFormTimeInput
              label="Duration"
              name="duration"
              placeholder="Enter duration..."
              required
              classNames={{ wrapper: 'col-span-1 mt-2' }}
            />
          </div>
          <HookFormCheckbox name="terms" label="Accept terms and conditions" />

          <Button variant="primary" type="submit" className="mt-2">
            Submit
          </Button>
        </form>
      </FormProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 md:py-2">
        <FormTimeInput
          label="Duration"
          name="duration"
          placeholder="Enter duration..."
          required
          onChange={(value) => {
            console.log('Duration changed:', value);
          }}
          classNames={{ wrapper: 'col-span-1 mt-2' }}
        />
      </div>
      <FormCheckbox
        name="terms"
        label="Accept terms and conditions"
        onCheckedChange={(checked) => {
          console.log('Terms accepted:', checked);
        }}
      />
      <CopyableButton>{new Date().toISOString()}</CopyableButton>
      <Button
        onClick={() => {
          toast.success('Test', {
            description: 'Test Toast',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          });
        }}
      >
        Test
      </Button>
    </>
  );
}
