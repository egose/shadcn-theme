'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { CalendarIcon } from 'lucide-react';
import { useController, type Control } from 'react-hook-form';

import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Calendar } from '@egose/shadcn-theme/components/ui/calendar';
import { Label } from '@egose/shadcn-theme/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@egose/shadcn-theme/components/ui/popover';

import type { LaunchRequestValues } from '../types';

/** Launch-only date binding: RHF stores a calendar date, never a UTC instant. */
export function LaunchDateField({ control }: { control: Control<LaunchRequestValues> }) {
  const { field, fieldState } = useController({
    control,
    name: 'launchDate',
    rules: { required: 'Launch date is required.' },
  });
  const { ref, name, value, onChange, onBlur } = field;
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const focused = useRef(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(blurTimer.current), []);

  function checkBlur() {
    clearTimeout(blurTimer.current);
    // Wait for Radix's portal focus restoration before deciding that focus left.
    blurTimer.current = setTimeout(() => {
      const wrapper = wrapperRef.current;
      const active = wrapper?.ownerDocument.activeElement;
      if (
        wrapper &&
        focused.current &&
        !wrapper.contains(active ?? null) &&
        !contentRef.current?.contains(active ?? null)
      ) {
        focused.current = false;
        onBlur();
      }
    }, 0);
  }

  // parseISO interprets date-only strings in local calendar time, unlike new Date(string).
  const date = value ? parseISO(value) : undefined;

  return (
    <div
      ref={wrapperRef}
      className="space-y-1"
      onFocusCapture={() => {
        clearTimeout(blurTimer.current);
        focused.current = true;
      }}
      onBlurCapture={checkBlur}
    >
      <Label htmlFor={id}>
        <span id={`${id}-label`}>Launch date</span>

        <span aria-hidden="true" className="text-danger">
          *
        </span>
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        {/* Select-only combobox with a calendar dialog; this role supports aria-required. */}

        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id={id}
            name={name}
            type="button"
            role="combobox"
            aria-required="true"
            aria-labelledby={`${id}-label ${id}-value`}
            aria-invalid={fieldState.invalid}
            aria-describedby={fieldState.error ? `${id}-error` : undefined}
            variant={date ? 'secondary' : 'muted'}
            appearance="outline"
            className="min-w-[145px] justify-start text-left font-normal"
          >
            <CalendarIcon aria-hidden="true" />
            <span id={`${id}-value`}>{date ? format(date, 'LLL dd, y') : 'Pick a date'}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          ref={contentRef}
          aria-label="Choose launch date"
          className="w-auto p-0"
          align="start"
          onCloseAutoFocus={checkBlur}
        >
          <Calendar
            mode="single"
            autoFocus
            defaultMonth={date}
            selected={date}
            onSelect={(selected) => {
              onChange(selected ? format(selected, 'yyyy-MM-dd') : null);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {fieldState.error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {fieldState.error.message}
        </p>
      )}
    </div>
  );
}
