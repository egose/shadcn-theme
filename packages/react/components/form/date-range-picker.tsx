'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import _kebabCase from 'lodash-es/kebabCase.js';

import { cn } from '../../utils/ui';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

function formatDate(date: Date) {
  return format(date, 'LLL dd, y');
}

function normalizeDate(date: Date | undefined) {
  return date && new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function normalizeRange(value: DateRange | undefined): DateRange | undefined {
  if (value === undefined) return undefined;

  return {
    from: normalizeDate(value.from),
    to: normalizeDate(value.to),
  };
}

/** Props for the controlled {@link FormDateRangePicker}. */
export interface FormDateRangePickerProps {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
  /** The selected range. Partial ranges and `undefined` are rendered as supplied. */
  value?: DateRange;
  /** Called once per user selection or clear, with endpoints normalized to local midnight. */
  onChange: (value: DateRange | undefined) => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    button?: string;
  };
}

/**
 * Controlled date-range picker. Selection is derived exclusively from
 * `value`; mounting and prop changes never invoke `onChange`.
 */
export function FormDateRangePicker({
  id,
  name,
  label,
  required = false,
  value,
  onChange,
  classNames,
}: FormDateRangePickerProps) {
  const selectedRange = normalizeRange(value);

  if (!id) id = _kebabCase(name);

  return (
    <div className={cn('$form-date-range-picker space-y-1', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <div className={cn('grid gap-2')}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={selectedRange ? 'secondary' : 'muted'}
              appearance="outline"
              className={cn('min-w-[240px] justify-start text-left font-normal', classNames?.button)}
            >
              <CalendarIcon />

              {selectedRange?.from ? (
                selectedRange.to ? (
                  <>
                    {formatDate(selectedRange.from)} - {formatDate(selectedRange.to)}
                  </>
                ) : (
                  formatDate(selectedRange.from)
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={selectedRange?.from}
              selected={selectedRange}
              onSelect={(dateRange) => onChange(normalizeRange(dateRange))}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
