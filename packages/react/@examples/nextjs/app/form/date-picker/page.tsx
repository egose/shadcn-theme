'use client';

import React from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDays } from 'date-fns/addDays';
import { format } from 'date-fns/format';
import type { DateRange } from 'react-day-picker';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { FormDatePicker } from '@egose/shadcn-theme/components/form/date-picker';
import { HookFormDatePicker } from '@egose/shadcn-theme/components/form/hook-date-picker';
import { FormDateRangePicker } from '@egose/shadcn-theme/components/form/date-range-picker';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

const validationSchema = z
  .object({
    date: z.date().optional(),
    date2: z.date().optional(),
    dates: z.custom<DateRange>().optional(),
  })
  // Every field carries a visual required marker, so each one must be selected.
  .superRefine((values, ctx) => {
    if (!values.date) {
      ctx.addIssue({ code: 'custom', message: 'Select Date is required.', path: ['date'] });
    }
    if (!values.date2) {
      ctx.addIssue({ code: 'custom', message: 'Select Date2 is required.', path: ['date2'] });
    }
    if (!values.dates?.from || !values.dates.to) {
      ctx.addIssue({ code: 'custom', message: 'Select Date Range is required.', path: ['dates'] });
    }
  });

type FormValues = z.infer<typeof validationSchema>;

export default function Page() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: { date2: addDays(new Date(), 2) },
  });
  const date = useWatch({ control: methods.control, name: 'date' });
  const dates = useWatch({ control: methods.control, name: 'dates' });
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  const fieldErrors = [methods.formState.errors.date, methods.formState.errors.date2, methods.formState.errors.dates];

  return (
    <ExamplePage
      title="Date Picker"
      description="Demonstrates the form-field date picker variants bound to react-hook-form."
    >
      <ExampleSection
        title="Date Inputs"
        description="Standalone, hook-form, and date-range picker fields. All three dates are required and validated on submit; Today only sets the second date."
      >
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((values) => {
              setSubmitted(
                [
                  values.date && `date: ${format(values.date, 'yyyy-MM-dd')}`,
                  values.date2 && `date2: ${format(values.date2, 'yyyy-MM-dd')}`,
                  values.dates?.from &&
                    `range: ${format(values.dates.from, 'yyyy-MM-dd')} to ${values.dates.to ? format(values.dates.to, 'yyyy-MM-dd') : '...'}`,
                ]
                  .filter(Boolean)
                  .join(', '),
              );
            })}
            autoComplete="off"
            noValidate
          >
            <div className="flex gap-x-2">
              <FormDatePicker
                name="date"
                label="Select Date"
                required
                {...(date ? { value: date } : {})}
                onChange={(newDate) => {
                  methods.setValue('date', newDate, { shouldDirty: true });
                }}
                disabled={{ before: new Date() }}
              />

              <HookFormDatePicker
                name="date2"
                label="Select Date2"
                required
                rules={{ required: 'Select Date2 is required.' }}
              />

              <FormDateRangePicker
                name="dates"
                label="Select Date Range"
                required
                {...(dates ? { value: dates } : {})}
                onChange={(newDates) => {
                  methods.setValue('dates', newDates, { shouldDirty: true });
                }}
              />
            </div>

            {fieldErrors.some(Boolean) ? (
              <ul className="mt-2 space-y-1">
                {fieldErrors.map((error, index) =>
                  error?.message ? (
                    <li key={index} role="alert" className="text-sm text-destructive">
                      {String(error.message)}
                    </li>
                  ) : null,
                )}
              </ul>
            ) : null}

            {submitted ? (
              <p role="status" className="mt-2 text-sm text-muted-foreground">
                Submitted {submitted}
              </p>
            ) : null}

            <Button
              type="button"
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
