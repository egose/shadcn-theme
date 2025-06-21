'use client';

import React, { useEffect, useState } from 'react';
import { addDays, format, isEqual } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import _kebabCase from 'lodash-es/kebabCase';
import _isNil from 'lodash-es/isNil';
import _isUndefined from 'lodash-es/isUndefined';
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

function getStartOfDay(date: Date) {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return startOfDay;
}

export interface FormDatePickerProps {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  initialValue?: Date | string;
  value?: Date | string;
  onChange: (value?: Date) => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    button?: string;
  };
}

export function FormDatePicker({
  id,
  name,
  label,
  required = false,
  disabled = false,
  initialValue,
  value,
  onChange,
  classNames,
}: FormDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      const dt = initialValue ? getStartOfDay(new Date(initialValue)) : getStartOfDay(new Date());

      setDate(dt);
      setInitialized(true);
    }
  }, [initialized, initialValue]);

  useEffect(() => {
    if (_isUndefined(value)) {
      if (!_isUndefined(date)) {
        setDate(undefined);
      }
    } else {
      const dt = _isString(value) ? new Date(value) : value;
      if (!isEqualDate(date, dt)) {
        setDate(getStartOfDay(dt));
      }
    }
  }, [value]);

  useEffect(() => {
    if (initialized) {
      onChange(date);
    }
  }, [date, initialized]);

  if (!id) id = _kebabCase(name);

  const display = !initialized ? <span></span> : date ? <>{formatDate(date)}</> : <span>Pick a date</span>;

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
              variant={date ? 'secondary' : 'muted'}
              outline
              className={cn('min-w-[145px] justify-start text-left font-normal', classNames?.button)}
            >
              <CalendarIcon />
              {display}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              onSelect={(newdate) => {
                if (!isEqualDate(date, newdate)) {
                  setDate(newdate);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
