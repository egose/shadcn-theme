'use client';

import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { ExampleGrid, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Calendar } from '@egose/shadcn-theme/components/ui/calendar';

export default function CalendarShowcase() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [range, setRange] = React.useState<DateRange | undefined>({ from: new Date(), to: new Date() });

  return (
    <ExamplePage
      title="Calendar"
      description="Use the calendar primitive for single-date selection, ranges, and scheduling interfaces."
    >
      <ExampleGrid>
        <ExampleSection title="Single date" description="A simple single-date selection calendar.">
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl border" />
        </ExampleSection>
        <ExampleSection title="Date range" description="Two-month range selection for report and booking filters.">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={setRange}
            className="rounded-xl border"
          />
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
