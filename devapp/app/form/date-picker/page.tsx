'use client';

import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../package/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../../../../package/lib/utils';
import { Calendar } from '../../../../package/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../package/components/ui/popover';
import { DatePickerWithRange } from '../../../../package/components/form/date-range-picker';

const validationSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  address: z.string().min(1).max(100),
  age: z.preprocess((v) => Number(v), z.number().min(20)),
  height: z.preprocess((v) => Number(v), z.number().min(100)),
});

export default function Page() {
  const [date, setDate] = useState<Date>();

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {},
  });

  return (
    <>
      <DatePickerWithRange />
      {/* <Popover>
        <PopoverTrigger asChild>
          <Button
            outline
            className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="range" numberOfMonths={2} />
        </PopoverContent>
      </Popover> */}
    </>
  );
}
