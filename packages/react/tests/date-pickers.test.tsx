import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import type { DateRange } from 'react-day-picker';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import { FormDatePicker } from '../components/form/date-picker';
import { FormDateRangePicker } from '../components/form/date-range-picker';
import { HookFormDateRangePicker } from '../components/form/hook-date-range-picker';

process.env.TZ = 'America/Los_Angeles';

const selectedSingle = new Date(2026, 4, 20, 18, 45);
const selectedRange: DateRange = {
  from: new Date(2026, 5, 10, 8, 15),
  to: new Date(2026, 5, 12, 22, 30),
};

vi.mock('../components/ui/popover', () => ({
  Popover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('../components/ui/calendar', () => ({
  Calendar: ({
    mode,
    onSelect,
    onDayClick,
  }: {
    mode: 'single' | 'range';
    onSelect?: (value: Date | undefined) => void;
    onDayClick?: (date: Date) => void;
  }) => (
    <div>
      <button
        type="button"
        onClick={() => {
          if (mode === 'single') onSelect?.(selectedSingle);
          else {
            onDayClick?.(selectedRange.from!);
            onDayClick?.(selectedRange.to!);
          }
        }}
      >
        Select {mode}
      </button>
      {mode === 'range' && (
        <button type="button" onClick={() => onDayClick?.(selectedSingle)}>
          Select range start
        </button>
      )}
      <button type="button" onClick={() => onSelect?.(undefined)}>
        Clear {mode}
      </button>
    </div>
  ),
}));

describe('FormDatePicker', () => {
  it('parses date-only strings as local dates outside UTC', () => {
    const onChange = vi.fn();

    expect(new Date(2026, 0, 15).getTimezoneOffset()).not.toBe(0);
    render(<FormDatePicker name="launch-date" value="2026-01-15" onChange={onChange} />);

    expect(screen.getByRole('button', { name: /Jan 15, 2026/ })).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('safely renders invalid and unsupported strings as empty without emitting', () => {
    const onChange = vi.fn();
    const { rerender } = render(<FormDatePicker name="launch-date" value="not-a-date" onChange={onChange} />);

    expect(screen.getByRole('button', { name: /Pick a date/ })).toBeInTheDocument();

    rerender(<FormDatePicker name="launch-date" value="2026-02-30" onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Pick a date/ })).toBeInTheDocument();

    rerender(<FormDatePicker name="launch-date" value="2026-01-15T00:00:00Z" onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Pick a date/ })).toBeInTheDocument();

    rerender(<FormDatePicker name="launch-date" value={new Date(Number.NaN)} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Pick a date/ })).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders parent value changes and resets without emitting', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <FormDatePicker name="launch-date" value={new Date(2026, 0, 15, 23, 30)} onChange={onChange} />,
    );

    expect(screen.getByRole('button', { name: /Jan 15, 2026/ })).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    rerender(<FormDatePicker name="launch-date" value={new Date(2026, 1, 9, 6, 15)} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Feb 09, 2026/ })).toBeInTheDocument();

    rerender(<FormDatePicker name="launch-date" value={undefined} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Pick a date/ })).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('emits each user selection and clear once at local midnight', () => {
    const onChange = vi.fn();
    render(<FormDatePicker name="launch-date" value={undefined} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Select single' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 4, 20));

    fireEvent.click(screen.getByRole('button', { name: 'Clear single' }));
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(undefined);
  });
});

describe('FormDateRangePicker', () => {
  it('renders complete, partial, and cleared parent values without emitting', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <FormDateRangePicker
        name="reporting-window"
        value={{ from: new Date(2026, 2, 3, 19), to: new Date(2026, 2, 8, 7) }}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole('button', { name: /Mar 03, 2026 - Mar 08, 2026/ })).toBeInTheDocument();

    rerender(
      <FormDateRangePicker
        name="reporting-window"
        value={{ from: new Date(2026, 3, 11, 21), to: undefined }}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('button', { name: /Apr 11, 2026/ })).toBeInTheDocument();

    rerender(<FormDateRangePicker name="reporting-window" value={undefined} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Pick a date/ })).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('emits a pending range only when confirmed', () => {
    const onChange = vi.fn();
    render(<FormDateRangePicker name="reporting-window" value={{ from: undefined }} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Select range' }));
    expect(screen.getByText('Jun 10, 2026 - Jun 12, 2026')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /^Select$/ }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 5, 10),
      to: new Date(2026, 5, 12),
    });
  });
});

describe('HookFormDateRangePicker', () => {
  it('commits the confirmed range to React Hook Form', () => {
    function TestForm() {
      const methods = useForm<{ dates?: DateRange }>({ defaultValues: { dates: undefined } });
      const dates = useWatch({ control: methods.control, name: 'dates' });

      return (
        <FormProvider {...methods}>
          <HookFormDateRangePicker name="dates" />
          <output>{dates?.from ? dates.from.toLocaleDateString('en-US') : 'No range'}</output>
        </FormProvider>
      );
    }

    render(<TestForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Select range' }));
    fireEvent.click(screen.getByRole('button', { name: /^Select$/ }));

    expect(screen.getByText('6/10/2026')).toBeInTheDocument();
  });
});
