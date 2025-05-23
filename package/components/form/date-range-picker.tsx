'use client';

import React, { HTMLAttributes, useEffect, useState } from 'react';
import { addDays, format, isEqual } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import _kebabCase from 'lodash-es/kebabCase';
import _isNil from 'lodash-es/isNil';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

function formatDate(date: Date) {
  return format(date, 'LLL dd, y');
}

export function isEqualDate(dt1: Date | undefined, dt2: Date | undefined) {
  const nildt1 = _isNil(dt1);
  const nildt2 = _isNil(dt2);

  if (nildt1) dt1 = undefined;
  if (nildt2) dt2 = undefined;

  if (nildt1 || nildt2) {
    return nildt1 === nildt2;
  }

  return isEqual(dt1 as Date, dt2 as Date);
}

export function isEqualDates(dts1: [Date | undefined, Date | undefined], dts2: [Date | undefined, Date | undefined]) {
  const dts11 = dts1[0];
  const dts12 = dts1[1];
  const dts21 = dts2[0];
  const dts22 = dts2[1];

  return isEqualDate(dts11, dts21) && isEqualDate(dts12, dts22);
}

export interface FormDateRangePickerProps {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
  onChange: (value: DateRange | undefined) => void;
  classNames?: {
    wrapper?: string;
    label?: string;
  };
}

export function FormDateRangePicker({
  id,
  name,
  label,
  required = false,
  onChange,
  classNames,
}: FormDateRangePickerProps) {
  const now = new Date();
  const [value, setValue] = useState<DateRange | undefined>({
    from: now,
    to: now,
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
              outline
              className={cn('w-[300px] justify-start text-left font-normal')}
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
