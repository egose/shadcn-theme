import { StrictMode } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { FormMultiSelect, type FormMultiSelectProps } from '../components/form/multi-select';

const acme = { value: 'cust_42', label: 'Acme Industries' };
const northwind = { value: 'cust_73', label: 'Northwind' };
const contoso = { value: 'cust_99', label: 'Contoso' };

// jsdom has no layout/scrolling APIs. Exercise the real Radix and cmdk controls.
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

function selectedLabels() {
  return screen
    .queryAllByRole('button', { name: /^Remove .* option$/ })
    .map((button) => button.getAttribute('aria-label'));
}

describe('FormMultiSelect visible labels', () => {
  it.each([undefined, 'customer-picker'])(
    'associates the visible label with the input for requested id %s',
    async (id) => {
      const onChange = vi.fn();
      const field = (label: string) => (
        <StrictMode>
          <FormMultiSelect
            id={id}
            name="Customer choices"
            label={label}
            data={[acme, northwind]}
            value={[]}
            onChange={onChange}
          />
        </StrictMode>
      );
      const { container, rerender } = render(field('Customers'));
      const input = screen.getByRole('combobox');
      const label = screen.getByText('Customers', { selector: 'label:not([cmdk-label])' }) as HTMLLabelElement;
      // cmdk owns the final ID, even when the caller requests an explicit/default ID.
      expect(label.htmlFor).toBe(input.id);
      expect(label.control).toBe(input);
      expect(screen.getByRole('combobox', { name: 'Customers' })).toBe(input);
      expect(screen.getByLabelText('Customers')).toBe(input);
      expect(label).toBeVisible();

      const activate = vi.fn();
      input.addEventListener('click', activate);
      fireEvent.click(label);
      expect(activate).toHaveBeenCalledTimes(1);
      // jsdom forwards native label clicks but does not implement their focus default action.
      act(() => (label.control as HTMLInputElement).focus());
      expect(input).toHaveFocus();
      await screen.findByRole('option', { name: 'Acme Industries' });
      const list = screen.getByRole('listbox');
      expect(input).toHaveAttribute('aria-controls', list.id);
      const internalLabel = container.querySelector('label[cmdk-label]') as HTMLLabelElement;
      expect(internalLabel.control).toBe(input);
      expect(input).toHaveAttribute('aria-labelledby', internalLabel.id);
      fireEvent.keyDown(input, { key: 'End' });
      await waitFor(() =>
        expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Northwind' }).id),
      );
      expect(input).toHaveFocus();
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onChange).toHaveBeenCalledExactlyOnceWith([northwind.value]);

      const inputId = input.id;
      rerender(field('Updated customers'));
      expect(screen.getByRole('combobox', { name: 'Updated customers' })).toBe(input);
      expect(screen.getByLabelText('Updated customers')).toBe(input);
      expect(label.htmlFor).toBe(inputId);
      expect(input.id).toBe(inputId);
    },
  );

  it('keeps separately mounted controls with the same name independently labelled', () => {
    const first = render(
      <FormMultiSelect name="customers" label="Primary customers" data={[]} value={[]} onChange={vi.fn()} />,
    );
    const second = render(
      <FormMultiSelect name="customers" label="Backup customers" data={[]} value={[]} onChange={vi.fn()} />,
    );
    const third = render(
      <FormMultiSelect
        id="explicit-customers"
        name="customers"
        label="Other customers"
        data={[]}
        value={[]}
        onChange={vi.fn()}
      />,
    );
    const inputs = ['Primary customers', 'Backup customers', 'Other customers'].map((name) => {
      const input = screen.getByRole('combobox', { name });
      expect(screen.getByLabelText(name)).toBe(input);
      const label = screen.getByText(name, { selector: 'label:not([cmdk-label])' }) as HTMLLabelElement;
      expect(label.control).toBe(input);
      const activate = vi.fn();
      input.addEventListener('click', activate);
      fireEvent.click(label);
      expect(activate).toHaveBeenCalledTimes(1);
      act(() => (label.control as HTMLInputElement).focus());
      expect(input).toHaveFocus();
      return input;
    });
    expect(new Set(inputs.map((input) => input.id)).size).toBe(3);
    first.unmount();
    expect(screen.getByLabelText('Backup customers')).toBe(inputs[1]);
    expect(screen.getByLabelText('Other customers')).toBe(inputs[2]);
    second.unmount();
    third.unmount();
  });
});

describe('FormMultiSelect option refreshes', () => {
  it('removing a known selection retains the missing ID and waits for controlled acceptance', () => {
    const onChange = vi.fn();
    const field = (value: string[]) => (
      <FormMultiSelect name="customers" data={[acme]} value={value} onChange={onChange} />
    );
    const { rerender } = render(field([acme.value, northwind.value]));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Remove Acme Industries option' }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith([northwind.value]);
    expect(selectedLabels()).toEqual(['Remove Acme Industries option', 'Remove cust_73 option']);

    rerender(field([northwind.value]));
    expect(selectedLabels()).toEqual(['Remove cust_73 option']);
    rerender(field([contoso.value, acme.value]));
    expect(selectedLabels()).toEqual(['Remove cust_99 option', 'Remove Acme Industries option']);
    rerender(field([]));
    expect(selectedLabels()).toEqual([]);
    expect(screen.getByPlaceholderText('Select options...')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('retains ordered IDs through empty, partial, hydrated, updated, and cleared metadata without callbacks', () => {
    const onChange = vi.fn();
    const value = [northwind.value, acme.value];
    const field = (data: FormMultiSelectProps['data']) => (
      <StrictMode>
        <FormMultiSelect name="customers" data={data} value={value} onChange={onChange} />
      </StrictMode>
    );
    const { rerender } = render(field([]));
    expect(selectedLabels()).toEqual(['Remove cust_73 option', 'Remove cust_42 option']);
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', '');

    rerender(field([acme]));
    expect(selectedLabels()).toEqual(['Remove cust_73 option', 'Remove Acme Industries option']);
    rerender(field([acme, northwind]));
    expect(selectedLabels()).toEqual(['Remove Northwind option', 'Remove Acme Industries option']);
    rerender(field([{ ...northwind, label: 'Northwind Traders' }, acme]));
    expect(selectedLabels()).toEqual(['Remove Northwind Traders option', 'Remove Acme Industries option']);
    rerender(field([]));
    expect(selectedLabels()).toEqual(['Remove cust_73 option', 'Remove cust_42 option']);
    expect(onChange).not.toHaveBeenCalled();
  });

  it.each([
    ['objects', [acme, contoso], 'Contoso'],
    ['strings', [acme.value, contoso.value], contoso.value],
  ] satisfies [string, FormMultiSelectProps['data'], string][])(
    'adding and toggling %s options preserves missing IDs and selection order',
    async (_kind, data, label) => {
      const onChange = vi.fn();
      const field = (value: string[]) => (
        <FormMultiSelect name="customers" data={data} value={value} onChange={onChange} />
      );
      const value = [northwind.value, acme.value];
      const { rerender } = render(field(value));
      fireEvent.click(screen.getByRole('combobox'));
      fireEvent.click(await screen.findByRole('option', { name: label }));
      expect(onChange).toHaveBeenCalledExactlyOnceWith([...value, contoso.value]);
      expect(screen.queryByRole('button', { name: `Remove ${label} option` })).not.toBeInTheDocument();

      rerender(field([...value, contoso.value]));
      expect(screen.getByRole('button', { name: `Remove ${label} option` })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('option', { name: label }));
      expect(onChange.mock.calls).toEqual([[[...value, contoso.value]], [value]]);
    },
  );

  it.each(['badge', 'Backspace'] as const)('allows explicit removal from empty options using %s', (method) => {
    const onChange = vi.fn();
    render(<FormMultiSelect name="customers" data={[]} value={[acme.value, northwind.value]} onChange={onChange} />);

    if (method === 'badge') {
      fireEvent.click(screen.getByRole('button', { name: 'Remove cust_73 option' }));
    } else {
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace' });
    }
    expect(onChange).toHaveBeenCalledExactlyOnceWith([acme.value]);
    expect(selectedLabels()).toEqual(['Remove cust_42 option', 'Remove cust_73 option']);
  });
});
