'use client';

import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { FormDateRangePicker } from '@egose/shadcn-theme/components/form/date-range-picker';

export default function DateRangePickerFormShowcase() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: new Date(), to: new Date() });

  return (
    <ExamplePage
      title="Date Range Picker"
      description="Use the date range picker for filters, reports, and booking windows."
    >
      <ExampleSection title="Controlled range selection">
        <ExampleStack>
          <FormDateRangePicker name="reporting-window" label="Reporting window" value={range} onChange={setRange} />
          <p className="text-sm text-muted-foreground">
            Selected: {range?.from?.toLocaleDateString() ?? 'n/a'} - {range?.to?.toLocaleDateString() ?? 'n/a'}
          </p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
