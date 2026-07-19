'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDays } from 'date-fns/addDays';
import { Button } from '../../../../../components/ui/button';
import { FormDatePicker } from '../../../../../components/form/date-picker';
import { HookFormDatePicker } from '../../../../../components/form/hook-date-picker';
import { FormDateRangePicker } from '../../../../../components/form/date-range-picker';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

const validationSchema = z.object({
  date2: z.date().optional(),
});

export default function Page() {
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: { date2: addDays(new Date(), 2) },
  });

  return (
    <ExamplePage
      title="Date Picker"
      description="Demonstrates the form-field date picker variants bound to react-hook-form."
    >
      <ExampleSection
        title="Date Inputs"
        description="Standalone, hook-form, and date-range picker fields with a Today action."
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(console.log)} autoComplete="off">
            <div className="flex gap-x-2">
              <FormDatePicker
                name="date"
                label="Select Date"
                required
                onChange={(dateRange) => {
                  console.log('onChange', dateRange);
                }}
                disabled={{ before: new Date() }}
              />

              <HookFormDatePicker name="date2" label="Select Date2" required />

              <FormDateRangePicker
                name="dates"
                label="Select Date Range"
                required
                onChange={(dateRange) => {
                  console.log('dateRange', dateRange);
                }}
              />
            </div>

            <Button
              variant="primary"
              className="mt-2"
              onClick={() => {
                methods.setValue('date2', new Date());
              }}
            >
              Today
            </Button>

            <Button variant="primary" type="submit" className="mt-2">
              Submit
            </Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
