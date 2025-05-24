'use client';

import React from 'react';
import { FormProvider, useForm } from '../../../../package/node_modules/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDays } from 'date-fns/addDays';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../package/components/ui/button';
import { FormDatePicker } from '../../../../package/components/form/date-picker';
import { HookFormDatePicker } from '../../../../package/components/form/hook-date-picker';
import { FormDateRangePicker } from '../../../../package/components/form/date-range-picker';

const validationSchema = z.object({
  date2: z.date().optional(),
});

export default function Page() {
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: { date2: addDays(new Date(), 2) },
  });

  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-5">Date Pickers</h1>

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
            />
            <HookFormDatePicker name="date2" label="Select Date2" required disabled />
            <FormDateRangePicker
              name="dates"
              label="Select Date Range"
              required
              onChange={(dateRange) => {
                console.log('onChange', dateRange);
              }}
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
