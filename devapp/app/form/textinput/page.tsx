'use client';

import { FormProvider, useForm } from '../../../../package/node_modules/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../package/components/ui/button';
import { HookFormTextInput } from '../../../../package/components/form/hook-text-input';
import { FormTimeInput } from '../../../../package/components/form/time-input';
import { HookFormTimeInput } from '../../../../package/components/form/hook-time-input';
import { useToast } from '../../../../package/hooks/use-toast';
import { ToastAction } from '../../../../package/components/ui/toast';
import { FormCheckbox } from '../../../../package/components/form/checkbox';
import { HookFormCheckbox } from '../../../../package/components/form/hook-checkbox';
import { CopyableButton } from '../../../../package/components/ui/copy-button';

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
  const { toast } = useToast();
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
            toast({
              title: 'Submitted',
              description: 'Successfully submitted the form.',
              action: <ToastAction altText="undo">Undo</ToastAction>,
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
    </>
  );
}
