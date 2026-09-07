'use client';

import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';
import type { DateRange } from 'react-day-picker';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { HookFormDateRangePicker } from '@egose/shadcn-theme/components/form/hook-date-range-picker';
import { Button } from '@egose/shadcn-theme/components/ui/button';

export default function HookDateRangePickerFormShowcase() {
  const methods = useForm<{ reportingWindow?: DateRange }>({
    defaultValues: { reportingWindow: { from: new Date() } },
  });

  return (
    <ExamplePage
      title="Hook Date Range Picker"
      description="Connect date-range selection to react-hook-form with confirmation-based updates and submission."
    >
      <ExampleSection title="Reporting window">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) =>
              toast.success('Saved', { description: JSON.stringify(data.reportingWindow) }),
            )}
          >
            <HookFormDateRangePicker name="reportingWindow" label="Reporting window" />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}
