import React, { HTMLAttributes, useEffect, useState } from 'react';
import { addDays, format, isEqual } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import _kebabCase from 'lodash-es/kebabCase';
import _isNil from 'lodash-es/isNil';

import { isEqualDates } from '../../lib/date';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

function formatDate(date: Date) {
  return format(date, 'LLL dd, y');
}

export interface FormDateRangePickerProps {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    button?: string;
  };
}

export function FormDateRangePicker({
  id,
  name,
  label,
  required = false,
  value: initialValue,
  onChange,
  classNames,
}: FormDateRangePickerProps) {
  let initialFrom!: Date;
  let initialTo!: Date;

  if (initialValue) {
    const from = initialValue.from ?? new Date();
    const to = initialValue.to ?? new Date();
    initialFrom = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    initialTo = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  } else {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    initialFrom = startOfDay;
    initialTo = startOfDay;
  }

  const [value, setValue] = useState<DateRange | undefined>({
    from: initialFrom,
    to: initialTo,
  });

  useEffect(() => {
    onChange(value);
  }, [value]);

  if (!id) id = _kebabCase(name);

  return (
    <div className={cn('date-range-picker', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <div className={cn('grid gap-2')}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={value ? 'secondary' : 'muted'}
              appearance="outline"
              className={cn('min-w-[240px] justify-start text-left font-normal', classNames?.button)}
            >
              <CalendarIcon />

              {value?.from ? (
                value.to ? (
                  <>
                    {formatDate(value.from)} - {formatDate(value.to)}
                  </>
                ) : (
                  formatDate(value.from)
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={value?.from}
              selected={value}
              onSelect={(dateRange) => {
                if (!isEqualDates([value?.from, value?.to], [dateRange?.from, dateRange?.to])) {
                  setValue(dateRange);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
