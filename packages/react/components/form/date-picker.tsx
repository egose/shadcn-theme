'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import _kebabCase from 'lodash-es/kebabCase.js';

import { cn } from '../../utils/ui';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import type { Matcher } from 'react-day-picker';

function formatDate(date: Date) {
  return format(date, 'LLL dd, y');
}

function parseLocalDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(0);
  date.setFullYear(year, month, day);
  date.setHours(0, 0, 0, 0);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return undefined;
  return date;
}

function normalizeDate(value: Date | string | undefined) {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return parseLocalDate(value);
  if (Number.isNaN(value.getTime())) return undefined;

  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

/** Props for the controlled {@link FormDatePicker}. */
export interface FormDatePickerProps {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
  disabled?: Matcher | Matcher[];
  closeOnSelect?: boolean;
  /**
   * The selected local date. Strings must be valid `YYYY-MM-DD` values and
   * are parsed as local calendar dates. Invalid values render an empty selection.
   */
  value?: Date | string;
  /** Called once per user selection or clear, with the date normalized to local midnight. */
  onChange: (value?: Date) => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    button?: string;
  };
}

/**
 * Controlled single-date picker. Selection is derived exclusively from
 * `value`; mounting and prop changes never invoke `onChange`.
 */
export function FormDatePicker({
  id,
  name,
  label,
  required = false,
  closeOnSelect = true,
  disabled,
  value,
  onChange,
  classNames,
}: FormDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const date = normalizeDate(value);

  if (!id) id = _kebabCase(name);

  const display = date ? <>{formatDate(date)}</> : <span>Pick a date</span>;

  return (
    <div className={cn('$form-date-picker space-y-1', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <div className={cn('grid gap-2')}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={date ? 'secondary' : 'muted'}
              appearance="outline"
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
                onChange(normalizeDate(newdate));
                if (closeOnSelect) setIsOpen(false);
              }}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
