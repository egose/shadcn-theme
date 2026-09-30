import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { FormSelect } from '../components/form/select';
import { FormSearchableSelect } from '../components/form/searchable-select';

const customers = [
  { value: 'cust_42', label: 'Acme Industries' },
  { value: 'cust_73', label: 'Northwind' },
];

// jsdom has no layout/scrolling APIs. Keep the real Radix and cmdk controls.
const scrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterAll(() => {
  if (scrollIntoView) Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', scrollIntoView);
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
  vi.unstubAllGlobals();
});

describe.each([
  ['FormSelect', FormSelect],
  ['FormSearchableSelect', FormSearchableSelect],
] as const)('%s label association', (_name, Control) => {
  it.each([
    [undefined, 'customer-account'],
    ['billing-customer', 'billing-customer'],
  ])('targets the focusable trigger with id %s', (id, expectedId) => {
    render(<Control id={id} name="customerAccount" label="Customer" data={customers} onChange={vi.fn()} />);

    const trigger = screen.getByRole('combobox');
    expect(screen.getByLabelText('Customer')).toBe(trigger);
    expect(trigger).toHaveAttribute('id', expectedId);
    trigger.focus();
    expect(trigger).toHaveFocus();
  });
});

describe('FormSelect contracts', () => {
  it('prevents opening and changes while disabled, then permits selection when enabled', async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <FormSelect name="customer" data={customers} defaultValue="cust_42" disabled onChange={onChange} />,
    );
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();

    rerender(<FormSelect name="customer" data={customers} defaultValue="cust_42" onChange={onChange} />);
    expect(trigger).toBeEnabled();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.click(await screen.findByRole('option', { name: 'Northwind' }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('cust_73');
    expect(trigger).toHaveTextContent('Northwind');
  });

  it('submits the default and newly selected stable IDs under its name', async () => {
    const onChange = vi.fn();
    render(
      <form aria-label="Customer form">

        <FormSelect name="customer" data={customers} defaultValue="cust_42" onChange={onChange} />

      </form>,
    );
    const form = screen.getByRole('form') as HTMLFormElement;
    expect(new FormData(form).get('customer')).toBe('cust_42');

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    fireEvent.click(await screen.findByRole('option', { name: 'Northwind' }));
    await waitFor(() => expect(new FormData(form).get('customer')).toBe('cust_73'));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('cust_73');
  });

  it('passes required state through to the trigger and native form control', () => {
    const { container, rerender } = render(
      <form>

        <FormSelect name="customer" data={customers} required onChange={vi.fn()} />

      </form>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true');
    const nativeSelect = container.querySelector('select');
    expect(nativeSelect).toBeRequired();
    expect(nativeSelect).toBeInvalid();

    rerender(
      <form>

        <FormSelect name="customer" data={customers} required={false} onChange={vi.fn()} />

      </form>,
    );
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-required', 'true');
    expect(nativeSelect).not.toBeRequired();
    expect(nativeSelect).toBeValid();
  });

  it('keeps controlled values authoritative and updates display and FormData on external changes', async () => {
    const onChange = vi.fn();
    const field = (value: string) => (
      <form aria-label="Customer form">

        <FormSelect name="customer" data={customers} defaultValue="cust_73" value={value} onChange={onChange} />

      </form>
    );
    const { rerender } = render(field('cust_42'));
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('Acme Industries');
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.click(await screen.findByRole('option', { name: 'Northwind' }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('cust_73');
    expect(trigger).toHaveTextContent('Acme Industries');

    rerender(field('cust_73'));
    expect(trigger).toHaveTextContent('Northwind');
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('customer')).toBe('cust_73');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('supports string options as both labels and values', async () => {
    const onChange = vi.fn();
    render(<FormSelect name="status" data={['Active', 'Archived']} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    fireEvent.click(await screen.findByRole('option', { name: 'Active' }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('Active');
    expect(screen.getByRole('combobox')).toHaveTextContent('Active');
  });
});

describe('FormSearchableSelect search contracts', () => {
  it.each(['Acme', 'cust_42'])('finds a customer by %s and emits its stable ID', async (query) => {
    const onChange = vi.fn();
    render(<FormSearchableSelect name="customer" label="Customer" data={customers} onChange={onChange} />);
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    fireEvent.change(screen.getByPlaceholderText('Search Customer...'), { target: { value: query } });

    fireEvent.click(await screen.findByRole('option', { name: 'Acme Industries' }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('cust_42');
    expect(trigger).toHaveTextContent('Acme Industries');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps duplicate labels independently selectable by ID and clears only the selected ID', async () => {
    const onChange = vi.fn();
    const data = [
      { value: 'cust_42', label: 'Acme Industries' },
      { value: 'cust_99', label: 'Acme Industries' },
    ];
    render(
      <FormSearchableSelect
        name="customer"
        data={data}
        defaultValue="cust_42"
        placeholder="Choose"
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    fireEvent.change(screen.getByPlaceholderText('Search option...'), { target: { value: 'Acme' } });
    const options = await screen.findAllByRole('option', { name: 'Acme Industries' });
    expect(options).toHaveLength(2);
    fireEvent.click(options[1]);
    expect(onChange).toHaveBeenLastCalledWith('cust_99');

    fireEvent.click(trigger);
    fireEvent.change(screen.getByPlaceholderText('Search option...'), { target: { value: 'cust_99' } });
    fireEvent.click(await screen.findByRole('option', { name: 'Acme Industries' }));
    expect(onChange.mock.calls).toEqual([['cust_99'], ['']]);
    expect(trigger).toHaveTextContent('Choose');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports string search and recovers from no results without changing selection', async () => {
    const onChange = vi.fn();
    render(
      <FormSearchableSelect name="status" data={['Active', 'Archived']} defaultValue="Archived" onChange={onChange} />,
    );
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    const input = screen.getByPlaceholderText('Search option...');
    fireEvent.change(input, { target: { value: 'zzzz' } });
    expect(await screen.findByText('No option found.')).toBeVisible();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('Archived');
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'Active' } });
    fireEvent.click(await screen.findByRole('option', { name: 'Active' }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('Active');
    expect(trigger).toHaveTextContent('Active');
  });
});
