'use client';

import React, { useEffect, useState } from 'react';
import { addDays, format, isEqual } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import _kebabCase from 'lodash-es/kebabCase';
import _isNil from 'lodash-es/isNil';
import _isString from 'lodash-es/isString';

import { isEqualDate } from '../../lib/date';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

function formatDate(date: Date) {
  return format(date, 'LLL dd, y');
}

export interface FormDatePickerProps {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  value?: Date | string;
  onChange: (value?: Date) => void;
  classNames?: {
    wrapper?: string;
    label?: string;
  };
}

export function FormDatePicker({
  id,
  name,
  label,
  required = false,
  disabled = false,
  value: initialValue,
  onChange,
  classNames,
}: FormDatePickerProps) {
  const dt = _isNil(initialValue) ? new Date() : _isString(initialValue) ? new Date(initialValue) : initialValue;
  const startOfDay = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  const [value, setValue] = useState<Date | undefined>(startOfDay);

  useEffect(() => {
    onChange(value);
  }, [value]);

  if (!id) id = _kebabCase(name);

  return (
    <div className={cn('date-picker', classNames?.wrapper)}>
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
              {value ? <>{formatDate(value)}</> : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              defaultMonth={value}
              selected={value}
              onSelect={(date) => {
                if (!isEqualDate(value, date)) {
                  setValue(date);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
