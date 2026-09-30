import { createRef, StrictMode, useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { HookFormSelect } from '../components/form/hook-select';
import { HookFormSearchableSelect } from '../components/form/hook-searchable-select';
import { HookFormMultiSelect } from '../components/form/hook-multi-select';
import { FormSelect } from '../components/form/select';
import { FormSearchableSelect } from '../components/form/searchable-select';
import { FormMultiSelect } from '../components/form/multi-select';
import { MultiSelector, MultiSelectorInput, MultiSelectorTrigger } from '../components/ui/multi-select';

const customers = [
  { value: 'cust_42', label: 'Acme Industries' },
  { value: 'cust_73', label: 'Northwind' },
];
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

type Kind = 'select' | 'searchable' | 'multi';
function Fixture({ kind, onBlur }: { kind: Kind; onBlur?: () => void }) {
  const form = useForm<{ customer: string | string[] }>({
    mode: 'onBlur',
    defaultValues: { customer: kind === 'multi' ? [] : '' },
  });
  const Control =
    kind === 'select' ? HookFormSelect : kind === 'searchable' ? HookFormSearchableSelect : HookFormMultiSelect;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)} noValidate>
        <Control
          name="customer"
          label="Customer"
          data={customers}
          rules={{ required: 'Choose a customer' }}
          onBlur={onBlur}
        />

        <button type="button" onClick={() => form.setFocus('customer')}>
          Focus customer
        </button>
        <button type="submit">Submit</button>
        <output data-testid="touched">{String(!!form.formState.touchedFields.customer)}</output>
        <output data-testid="error">{form.formState.errors.customer?.message ?? ''}</output>
        <output data-testid="value">{JSON.stringify(form.watch('customer'))}</output>
      </form>
    </FormProvider>
  );
}

function focus(element: HTMLElement) {
  act(() => element.focus());
}

function getControl(kind: Kind) {
  return kind === 'multi' ? screen.getByRole('combobox', { name: 'Customer' }) : screen.getByLabelText('Customer');
}

// Allow Radix's deferred close autofocus and composite blur processing to settle.
async function settleFocus() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
}

async function open(kind: Kind, trigger: HTMLElement) {
  focus(trigger);
  if (kind === 'select') fireEvent.keyDown(trigger, { key: 'ArrowDown' });
  else fireEvent.click(trigger);
  await screen.findByRole('option', { name: 'Acme Industries' });
  await settleFocus();
}

describe.each<Kind>(['select', 'searchable', 'multi'])('%s RHF focus lifecycle (real controls)', (kind) => {
  it('setFocus reaches the actual trigger/input', async () => {
    render(<Fixture kind={kind} />);
    const control = getControl(kind);
    const button = screen.getByRole('button', { name: 'Focus customer' });
    focus(button);
    fireEvent.click(button);
    await waitFor(() => expect(control).toHaveFocus());
    expect(control.tagName).toBe(kind === 'multi' ? 'INPUT' : 'BUTTON');
  });

  it('focuses the invalid selection on submit', async () => {
    render(<Fixture kind={kind} />);
    const submit = screen.getByRole('button', { name: 'Submit' });
    focus(submit);
    fireEvent.click(submit);
    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('Choose a customer'));
    await waitFor(() => expect(getControl(kind)).toHaveFocus());
  });

  it('validates and marks touched only when focus leaves the empty field', async () => {
    const onBlur = vi.fn();
    render(<Fixture kind={kind} onBlur={onBlur} />);
    focus(getControl(kind));
    expect(screen.getByTestId('touched')).toHaveTextContent('false');
    focus(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.getByTestId('touched')).toHaveTextContent('true'));
    expect(screen.getByTestId('error')).toHaveTextContent('Choose a customer');
    expect(onBlur).toHaveBeenCalledExactlyOnceWith();
  });

  it('keeps portal opening, selection, and focus restoration internal until exit', async () => {
    const onBlur = vi.fn();
    render(<Fixture kind={kind} onBlur={onBlur} />);
    const control = getControl(kind);
    await open(kind, control);
    expect(screen.getByTestId('touched')).toHaveTextContent('false');
    expect(onBlur).not.toHaveBeenCalled();
    expect(screen.getByTestId('error')).toBeEmptyDOMElement();

    if (kind === 'searchable') {
      const search = screen.getByPlaceholderText('Search Customer...');
      expect(search).toHaveFocus();
      fireEvent.change(search, { target: { value: 'Acme' } });
    }
    fireEvent.click(screen.getByRole('option', { name: 'Acme Industries' }));
    await settleFocus();
    expect(screen.getByTestId('value')).toHaveTextContent(kind === 'multi' ? '["cust_42"]' : '"cust_42"');
    expect(screen.getByTestId('touched')).toHaveTextContent('false');
    if (kind === 'multi') {
      fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      await settleFocus();
    }
    expect(control).toHaveFocus();
    focus(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.getByTestId('touched')).toHaveTextContent('true'));
    expect(screen.getByTestId('error')).toBeEmptyDOMElement();
    expect(onBlur).toHaveBeenCalledExactlyOnceWith();
  });

  it('Escape without a selection restores internal focus without touching the field', async () => {
    render(<Fixture kind={kind} />);
    const control = getControl(kind);
    await open(kind, control);
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    await settleFocus();
    expect(control).toHaveFocus();
    expect(screen.getByTestId('touched')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toBeEmptyDOMElement();
    focus(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('Choose a customer'));
  });
});

describe.each<Kind>(['searchable', 'multi'])('%s portal exit', (kind) => {
  it('does not steal focus back after pointer dismissal onto a non-focusable outside area', async () => {
    const onBlur = vi.fn();
    render(<Fixture kind={kind} onBlur={onBlur} />);
    await open(kind, getControl(kind));
    fireEvent.pointerDown(document.body, { pointerType: 'mouse', button: 0 });
    fireEvent.click(document.body);
    // jsdom does not perform pointer default-action focus changes.
    act(() => (document.activeElement as HTMLElement).blur());
    await settleFocus();
    expect(document.body).toHaveFocus();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent('Choose a customer');
    expect(onBlur).toHaveBeenCalledExactlyOnceWith();
  });

  it('marks touched when focus moves directly from the open field to an outside button', async () => {
    const onBlur = vi.fn();
    render(<Fixture kind={kind} onBlur={onBlur} />);
    await open(kind, getControl(kind));
    const outside = screen.getByRole('button', { name: 'Submit' });
    // Programmatic focus exercises the same focusout/focusin sequence as Tab.
    focus(outside);
    await settleFocus();
    expect(outside).toHaveFocus();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.getByTestId('touched')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toHaveTextContent('Choose a customer');
    expect(onBlur).toHaveBeenCalledExactlyOnceWith();
  });
});

describe('public selection refs and input composition', () => {
  it.each(['form', 'primitive'] as const)('honors React 19 callback-ref cleanup for the %s input', (kind) => {
    const cleanup = vi.fn();
    const firstRef = vi.fn((node: HTMLInputElement | null) => {
      expect(node).toBeInstanceOf(HTMLInputElement);
      return cleanup;
    });
    const replacementRef = createRef<HTMLInputElement>();
    const field = (ref: React.Ref<HTMLInputElement>) =>
      kind === 'form' ? (
        <FormMultiSelect name="multi" data={customers} value={[]} onChange={vi.fn()} ref={ref} />
      ) : (
        <MultiSelector values={[]} onValuesChange={vi.fn()}>
          <MultiSelectorTrigger>
            <MultiSelectorInput ref={ref} />
          </MultiSelectorTrigger>
        </MultiSelector>
      );
    const { rerender, unmount } = render(field(firstRef));
    const input = screen.getByRole('combobox');
    expect(firstRef).toHaveBeenCalledExactlyOnceWith(input);
    rerender(field(replacementRef));
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(firstRef).toHaveBeenCalledTimes(1);
    expect(replacementRef.current).toBe(input);
    unmount();
    expect(replacementRef.current).toBeNull();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it.each(['object', 'callback'] as const)('forwards %s refs to real controls and clears them on unmount', (kind) => {
    const select = createRef<HTMLButtonElement>();
    const searchable = createRef<HTMLButtonElement>();
    const multi = createRef<HTMLInputElement>();
    const selectCallback = vi.fn((node: HTMLButtonElement | null) => {
      select.current = node;
    });
    const searchableCallback = vi.fn((node: HTMLButtonElement | null) => {
      searchable.current = node;
    });
    const multiCallback = vi.fn((node: HTMLInputElement | null) => {
      multi.current = node;
    });
    const { unmount } = render(
      <StrictMode>
        <FormSelect
          name="select"
          data={customers}
          onChange={vi.fn()}
          ref={kind === 'object' ? select : selectCallback}
        />

        <FormSearchableSelect
          name="searchable"
          data={customers}
          onChange={vi.fn()}
          ref={kind === 'object' ? searchable : searchableCallback}
        />

        <FormMultiSelect
          name="multi"
          data={customers}
          value={[]}
          onChange={vi.fn()}
          ref={kind === 'object' ? multi : multiCallback}
        />
      </StrictMode>,
    );
    expect(select.current).toBe(screen.getAllByRole('combobox')[0]);
    expect(searchable.current).toBe(screen.getAllByRole('combobox')[1]);
    expect(multi.current).toBe(screen.getAllByRole('combobox')[2]);
    for (const ref of [select, searchable, multi]) {
      focus(ref.current!);
      expect(ref.current).toHaveFocus();
    }
    unmount();
    expect(select.current).toBeNull();
    expect(searchable.current).toBeNull();
    expect(multi.current).toBeNull();
  });

  it('preserves the input internal ref for keyboard removal and composes caller focus/blur/click handlers', () => {
    const ref = createRef<HTMLInputElement>();
    const onBlur = vi.fn();
    const onFocus = vi.fn();
    const onClick = vi.fn();
    const onValueChange = vi.fn();
    const onValuesChange = vi.fn();
    render(
      <>
        <MultiSelector values={customers} onValuesChange={onValuesChange}>
          <MultiSelectorTrigger>
            <MultiSelectorInput
              ref={ref}
              onBlur={onBlur}
              onFocus={onFocus}
              onClick={onClick}
              onValueChange={onValueChange}
            />
          </MultiSelectorTrigger>
        </MultiSelector>
        <button>Outside</button>
      </>,
    );
    const input = screen.getByRole('combobox');
    expect(ref.current).toBe(input);
    focus(ref.current!);
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(onValuesChange).toHaveBeenCalledExactlyOnceWith([customers[0]]);
    fireEvent.change(input, { target: { value: 'North' } });
    expect(input).toHaveValue('North');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('North');
    focus(screen.getByRole('button', { name: 'Outside' }));
    expect(input).toHaveValue('');
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur.mock.calls[0][0].target).toBe(input);
  });

  it('treats badge focus and pointer removal as internal and validates once on exit', async () => {
    const onBlur = vi.fn();
    function MultiFixture() {
      const [value, setValue] = useState(['cust_42', 'cust_73']);
      return <FormMultiSelect name="multi" data={customers} value={value} onChange={setValue} onBlur={onBlur} />;
    }
    render(
      <>
        <MultiFixture />
        <button>Outside</button>
      </>,
    );
    const input = screen.getByRole('combobox');
    focus(input);
    const badge = screen.getByRole('button', { name: 'Remove Acme Industries option' });
    focus(badge);
    await settleFocus();
    expect(onBlur).not.toHaveBeenCalled();
    focus(input);
    fireEvent.mouseDown(badge);
    fireEvent.click(badge);
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Remove Acme Industries option' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Northwind option' })).toBeInTheDocument();
    const remainingBadge = screen.getByRole('button', { name: 'Remove Northwind option' });
    focus(remainingBadge);
    // A keyboard-activated button dispatches click without mousedown.
    fireEvent.click(remainingBadge);
    expect(input).toHaveFocus();
    await settleFocus();
    expect(onBlur).not.toHaveBeenCalled();
    focus(screen.getByRole('button', { name: 'Outside' }));
    await waitFor(() => expect(onBlur).toHaveBeenCalledExactlyOnceWith());
  });

  it('cancels pending composite blur work when the field unmounts', async () => {
    const onBlur = vi.fn();
    const { unmount } = render(
      <StrictMode>
        <FormSearchableSelect name="customer" data={customers} onChange={vi.fn()} onBlur={onBlur} />
        <button>Outside</button>
      </StrictMode>,
    );
    focus(screen.getByRole('combobox'));
    focus(screen.getByRole('button', { name: 'Outside' }));
    unmount();
    await settleFocus();
    expect(onBlur).not.toHaveBeenCalled();
  });
});
