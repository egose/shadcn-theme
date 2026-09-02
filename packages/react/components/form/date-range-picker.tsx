'use client';

import { useState } from 'react';
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
  /** Called when a pending range is confirmed, with endpoints normalized to local midnight. */
  onChange: (value: DateRange | undefined) => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    button?: string;
  };
}

/**
 * Controlled date-range picker. Calendar changes remain pending until
 * confirmed with Select; dismissing the popover leaves `value` unchanged.
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
  const [isOpen, setIsOpen] = useState(false);
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>();
  const selectedRange = normalizeRange(value);

  function openPicker() {
    setPendingRange(selectedRange);
    setIsOpen(true);
  }

  function selectPendingDate(date: Date) {
    const selectedDate = normalizeDate(date);
    if (!selectedDate) return;

    setPendingRange((currentRange) => {
      if (!currentRange?.from || currentRange.to) return { from: selectedDate };

      return selectedDate < currentRange.from
        ? { from: selectedDate, to: currentRange.from }
        : { from: currentRange.from, to: selectedDate };
    });
  }

  if (!id) id = _kebabCase(name);

  return (
    <div className={cn('$form-date-range-picker space-y-1', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <div className={cn('grid gap-2')}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={selectedRange ? 'secondary' : 'muted'}
              appearance="outline"
              className={cn('min-w-[240px] justify-start text-left font-normal', classNames?.button)}
              onClick={openPicker}
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
              selected={pendingRange}
              // Keep DayPicker's visual selection driven by the pending range.
              onSelect={() => undefined}
              onDayClick={selectPendingDate}
              modifiers={{
                pending_start: pendingRange?.from && !pendingRange.to ? pendingRange.from : undefined,
              }}
              numberOfMonths={2}
            />

            <div className="flex items-center justify-between gap-3 border-t p-2">
              <p className="min-w-0 text-sm text-muted-foreground" aria-live="polite">
                {pendingRange?.from ? (
                  pendingRange.to ? (
                    <>
                      {formatDate(pendingRange.from)} - {formatDate(pendingRange.to)}
                    </>
                  ) : (
                    `${formatDate(pendingRange.from)} - Select an end date`
                  )
                ) : (
                  'Select a start date'
                )}
              </p>

              <div className="flex shrink-0 gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onChange(pendingRange);
                    setIsOpen(false);
                  }}
                >
                  Select
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
