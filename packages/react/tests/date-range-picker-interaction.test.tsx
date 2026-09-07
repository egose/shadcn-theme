import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FormDateRangePicker } from '../components/form/date-range-picker';
import { Calendar } from '../components/ui/calendar';

describe('FormDateRangePicker interactions', () => {
  it('emits a range when a calendar day is selected', () => {
    const onSelect = vi.fn();
    render(<Calendar mode="range" onSelect={onSelect} numberOfMonths={2} />);

    const calendarDay = screen
      .getAllByRole('button')
      .find(
        (button) => button.dataset.day && !(button as HTMLButtonElement).disabled && !button.closest('[data-outside]'),
      );
    expect(calendarDay).toBeDefined();

    fireEvent.click(calendarDay!);

    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('shows a pending start date after selecting a calendar day', async () => {
    render(<FormDateRangePicker name="reporting-window" value={undefined} onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Pick a date' }));

    const calendarDay = within(screen.getByRole('dialog'))
      .getAllByRole('button')
      .find(
        (button) => button.dataset.day && !(button as HTMLButtonElement).disabled && !button.closest('[data-outside]'),
      );
    expect(calendarDay).toBeDefined();

    fireEvent.click(calendarDay!);

    await waitFor(() => expect(screen.getByText(/Select an end date/)).toBeInTheDocument());
    await waitFor(() =>
      expect(
        within(screen.getByRole('dialog'))
          .getAllByRole('button')
          .find((button) => button.dataset.day === calendarDay!.dataset.day),
      ).toHaveAttribute('data-pending-start', 'true'),
    );
  });
});
