import * as React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { SidebarProvider } from '../components/ui/sidebar';
import { ContextSwitcher, type INavContext } from '../layouts/sidebar1/context-switcher';

const alpha: INavContext = { name: 'Alpha', text: 'Customer operations', logoUrl: '/alpha.svg' };
const beta: INavContext = { name: 'Beta', text: 'Launch requests', logoUrl: '/beta.svg' };
const gamma: INavContext = { name: 'Gamma', text: 'Settings', logoUrl: '/gamma.svg' };

// Only shim the browser viewport API; use the real sidebar and Radix dropdown.
beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});
afterAll(() => vi.unstubAllGlobals());

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
      <SidebarProvider>{children}</SidebarProvider>
    </React.StrictMode>
  );
}

function expectContext(context: INavContext) {
  const trigger = screen.getByRole('button');
  expect(within(trigger).getByText(context.name)).toBeInTheDocument();
  expect(within(trigger).getByText(context.text)).toBeInTheDocument();
  return trigger;
}

async function selectContext(name: string) {
  fireEvent.keyDown(screen.getByRole('button'), { key: 'ArrowDown' });
  fireEvent.click(await screen.findByRole('menuitem', { name: new RegExp(name) }));
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
}

describe('ContextSwitcher authoritative selection', () => {
  it('displays an initial non-first active item and follows external A-to-B changes without callbacks', () => {
    const onContextSelected = vi.fn();
    const { rerender } = render(
      <ContextSwitcher items={[alpha, { ...beta, active: true }]} onContextSelected={onContextSelected} />,
      { wrapper: Wrapper },
    );
    expectContext(beta);

    rerender(<ContextSwitcher items={[{ ...alpha, active: true }, beta]} onContextSelected={onContextSelected} />);
    expectContext(alpha);
    rerender(<ContextSwitcher items={[alpha, { ...beta, active: true }]} onContextSelected={onContextSelected} />);
    expectContext(beta);
    expect(onContextSelected).not.toHaveBeenCalled();
  });

  it('uses the first active item in current list order, including after reordering', () => {
    const onContextSelected = vi.fn();
    const activeBeta = { ...beta, active: true };
    const activeGamma = { ...gamma, active: true };
    const { rerender } = render(
      <ContextSwitcher items={[alpha, activeBeta, activeGamma]} onContextSelected={onContextSelected} />,
      { wrapper: Wrapper },
    );
    expectContext(beta);
    rerender(<ContextSwitcher items={[alpha, activeGamma, activeBeta]} onContextSelected={onContextSelected} />);
    expectContext(gamma);
    expect(onContextSelected).not.toHaveBeenCalled();
  });

  it('renders nothing when empty and honors non-first active items on load and reload', () => {
    const onContextSelected = vi.fn();
    const onContextAdd = vi.fn();
    const props = { onContextSelected, onContextAdd, canAdd: true };
    const { rerender } = render(<ContextSwitcher items={[]} {...props} />, { wrapper: Wrapper });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<ContextSwitcher items={[alpha, { ...beta, active: true }]} {...props} />);
    expectContext(beta);
    rerender(<ContextSwitcher items={[]} {...props} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<ContextSwitcher items={[beta, { ...alpha, active: true }]} {...props} />);
    expectContext(alpha);
    expect(onContextSelected).not.toHaveBeenCalled();
    expect(onContextAdd).not.toHaveBeenCalled();
  });

  it('requests a switch exactly once and keeps the authoritative label until the parent accepts', async () => {
    const onContextSelected = vi.fn();
    const items = [{ ...alpha, active: true }, beta];
    const { rerender } = render(<ContextSwitcher items={items} onContextSelected={onContextSelected} />, {
      wrapper: Wrapper,
    });
    await selectContext('Beta');
    expect(onContextSelected).toHaveBeenCalledExactlyOnceWith(beta);
    expectContext(alpha);

    // A rejected/deferred request and an unrelated metadata refresh cannot change selection.
    rerender(<ContextSwitcher items={items.map((item) => ({ ...item }))} onContextSelected={onContextSelected} />);
    expectContext(alpha);
    rerender(<ContextSwitcher items={[alpha, { ...beta, active: true }]} onContextSelected={onContextSelected} />);
    expectContext(beta);
    expect(onContextSelected).toHaveBeenCalledTimes(1);
  });

  it('keeps active selection authoritative even without a selection callback', async () => {
    render(<ContextSwitcher items={[{ ...alpha, active: true }, beta]} />, { wrapper: Wrapper });
    await selectContext('Beta');
    expectContext(alpha);
  });

  it('uses a remaining active item or the first-item fallback when the active name is removed', () => {
    const onContextSelected = vi.fn();
    const { rerender } = render(
      <ContextSwitcher items={[alpha, { ...beta, active: true }, gamma]} onContextSelected={onContextSelected} />,
      { wrapper: Wrapper },
    );
    expectContext(beta);
    rerender(<ContextSwitcher items={[alpha, { ...gamma, active: true }]} onContextSelected={onContextSelected} />);
    expectContext(gamma);
    rerender(<ContextSwitcher items={[beta, alpha]} onContextSelected={onContextSelected} />);
    expectContext(beta);
    rerender(<ContextSwitcher items={[alpha, gamma, beta]} onContextSelected={onContextSelected} />);
    expectContext(beta);
    expect(onContextSelected).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    'refreshes text, image, logo and classes from current items (controlled: %s)',
    async (controlled) => {
      const onContextSelected = vi.fn();
      const { rerender } = render(
        <ContextSwitcher items={[{ ...alpha, active: controlled }, beta]} onContextSelected={onContextSelected} />,
        { wrapper: Wrapper },
      );
      const refreshed = {
        ...alpha,
        active: controlled,
        text: 'Updated operations',
        logoUrl: '/new.svg',
        className: 'bg-red-500',
      };
      rerender(<ContextSwitcher items={[refreshed, beta]} onContextSelected={onContextSelected} />);
      const image = within(expectContext(refreshed)).getByRole('img', { name: 'Alpha' });
      expect(image).toHaveAttribute('src', '/new.svg');
      expect(image.parentElement).toHaveClass('bg-red-500');

      const Logo = ({ className }: { className?: string }) => (
        <svg aria-label="Updated logo" role="img" className={className} />
      );
      const latest = { ...refreshed, logo: Logo, className: 'bg-blue-500' };
      rerender(<ContextSwitcher items={[latest, beta]} onContextSelected={onContextSelected} />);
      const logo = within(expectContext(latest)).getByRole('img', { name: 'Updated logo' });
      expect(logo.parentElement).toHaveClass('bg-blue-500');
      expect(logo.parentElement).not.toHaveClass('bg-red-500');
      expect(onContextSelected).not.toHaveBeenCalled();
      await selectContext('Alpha');
      expect(onContextSelected).toHaveBeenCalledExactlyOnceWith(latest);
      expect(onContextSelected.mock.calls[0][0]).toBe(latest);
    },
  );
});

describe('ContextSwitcher local selection and fallback', () => {
  it('selects locally by name and retains selection across recreated, reordered and refreshed items', async () => {
    const onContextSelected = vi.fn();
    const { rerender } = render(
      <ContextSwitcher items={[alpha, { ...beta, active: false }]} onContextSelected={onContextSelected} />,
      { wrapper: Wrapper },
    );
    expectContext(alpha);
    await selectContext('Beta');
    expectContext(beta);
    expect(onContextSelected).toHaveBeenCalledExactlyOnceWith({ ...beta, active: false });

    const updatedBeta = { ...beta, text: 'Updated launches' };
    rerender(<ContextSwitcher items={[gamma, updatedBeta, { ...alpha }]} onContextSelected={onContextSelected} />);
    expectContext(updatedBeta);
    rerender(
      <ContextSwitcher items={[{ ...alpha }, gamma, { ...updatedBeta }]} onContextSelected={onContextSelected} />,
    );
    expectContext(updatedBeta);
    expect(onContextSelected).toHaveBeenCalledTimes(1);
  });

  it('commits the first-item fallback on removal and clears selection when empty', async () => {
    const onContextSelected = vi.fn();
    const { rerender } = render(<ContextSwitcher items={[]} onContextSelected={onContextSelected} />, {
      wrapper: Wrapper,
    });
    rerender(<ContextSwitcher items={[alpha, beta, gamma]} onContextSelected={onContextSelected} />);
    expectContext(alpha);
    await selectContext('Beta');
    expectContext(beta);

    rerender(<ContextSwitcher items={[gamma, alpha]} onContextSelected={onContextSelected} />);
    expectContext(gamma);
    // Reappearing removed items and reordering must not resurrect the old selection.
    rerender(<ContextSwitcher items={[beta, alpha, gamma]} onContextSelected={onContextSelected} />);
    expectContext(gamma);
    rerender(<ContextSwitcher items={[]} onContextSelected={onContextSelected} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<ContextSwitcher items={[alpha, gamma, beta]} onContextSelected={onContextSelected} />);
    expectContext(alpha);
    expect(onContextSelected).toHaveBeenCalledTimes(1);
  });

  it('hands control back to the last displayed name, then falls back if it is removed', async () => {
    const onContextSelected = vi.fn();
    const { rerender } = render(
      <ContextSwitcher items={[alpha, beta, gamma]} onContextSelected={onContextSelected} />,
      {
        wrapper: Wrapper,
      },
    );
    await selectContext('Beta');
    expectContext(beta);
    rerender(
      <ContextSwitcher items={[alpha, beta, { ...gamma, active: true }]} onContextSelected={onContextSelected} />,
    );
    expectContext(gamma);
    await selectContext('Alpha');
    expectContext(gamma);
    rerender(<ContextSwitcher items={[alpha, beta, gamma]} onContextSelected={onContextSelected} />);
    expectContext(gamma);
    rerender(<ContextSwitcher items={[alpha, beta]} onContextSelected={onContextSelected} />);
    expectContext(alpha);
    expect(onContextSelected.mock.calls).toEqual([[beta], [alpha]]);
  });

  it('allows local selection without callbacks and keeps add-context separate', async () => {
    const onContextAdd = vi.fn();
    render(<ContextSwitcher items={[alpha, beta]} canAdd onContextAdd={onContextAdd} />, { wrapper: Wrapper });
    await selectContext('Beta');
    expectContext(beta);
    expect(onContextAdd).not.toHaveBeenCalled();
    await selectContext('Add context');
    expectContext(beta);
    expect(onContextAdd).toHaveBeenCalledTimes(1);
  });
});
