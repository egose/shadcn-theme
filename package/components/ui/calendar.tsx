'use client';

import * as React from 'react';
import type { ComponentProps } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '../../lib/utils';
import { buttonVariants } from '../../components/ui/button';

export type CalendarProps = ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const navigationButtonClass = cn(
    buttonVariants({ variant: 'light' }),
    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10',
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3 bg-white', className)}
      classNames={{
        month: 'space-y-4',
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-y-0 relative gap-2',
        month_caption: 'flex justify-center pt-1 relative items-center',
        month_grid: 'w-full border-collapse space-y-1',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center justify-between absolute inset-x-0',
        button_previous: navigationButtonClass,
        button_next: navigationButtonClass,
        weeks: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-none first:aria-selected:rounded-l-md last:aria-selected:rounded-r-md',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
        ),
        range_start:
          'day-range-start !bg-secondary rounded-l-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
        range_end:
          'day-range-end !bg-secondary rounded-r-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
        range_middle: 'aria-selected:bg-secondary aria-selected:text-secondary-foreground',
        selected: cn(
          props.mode === 'range'
            ? 'bg-primary hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'
            : 'rounded-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
        ),
        today: 'text-success italic [&>button]:underline [&>button]:font-semibold',
        outside:
          'day-outside text-muted-foreground opacity-50 !aria-selected:bg-secondary/50 !aria-selected:text-muted-foreground !aria-selected:opacity-30',
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) =>
          props.orientation === 'left' ? (
            <ChevronLeft {...props} className="h-4 w-4" />
          ) : (
            <ChevronRight {...props} className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
