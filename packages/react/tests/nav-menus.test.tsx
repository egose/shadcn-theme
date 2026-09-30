import * as React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Sidebar, SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import { TooltipProvider } from '../components/ui/tooltip';
import { NavMenus, type IMenuItem } from '../layouts/sidebar1/nav-menus';

type Activation = 'pointer' | 'Enter' | 'Space';
const activations: Activation[] = ['pointer', 'Enter', 'Space'];

beforeEach(() => {
  vi.stubGlobal('innerWidth', 1024);
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

// jsdom has no keyboard default-action engine. Dispatch the native activation
// click explicitly (detail=0) after uncancelled keys on a focused semantic host.
// No NavMenus, sidebar, Slot, Collapsible, or Sheet implementation is mocked.
function activate(element: HTMLElement, method: Activation) {
  if (method === 'pointer') {
    fireEvent.pointerDown(element, { button: 0, pointerType: 'mouse' });
    fireEvent.mouseDown(element, { button: 0 });
    act(() => element.focus());
    fireEvent.pointerUp(element, { button: 0, pointerType: 'mouse' });
    fireEvent.mouseUp(element, { button: 0 });
    fireEvent.click(element, { detail: 1 });
    return;
  }

  expect(['BUTTON', 'A']).toContain(element.tagName);
  expect(element.tabIndex).toBe(0);
  act(() => element.focus());
  expect(element).toHaveFocus();
  const key = method === 'Space' ? ' ' : 'Enter';
  const code = method === 'Space' ? 'Space' : 'Enter';
  const allowed = fireEvent.keyDown(element, { key, code });
  if (allowed && method === 'Enter') fireEvent.click(element, { detail: 0 });
  const released = fireEvent.keyUp(element, { key, code });
  if (allowed && released && method === 'Space') {
    expect(element.tagName).toBe('BUTTON');
    fireEvent.click(element, { detail: 0 });
  }
}

function Fixture({
  items,
  aslink = 'a',
  onSubmit = vi.fn(),
  mobile = false,
}: {
  items: IMenuItem[];
  aslink?: React.ElementType;
  onSubmit?: () => void;
  mobile?: boolean;
}) {
  const content = (
    <form
      aria-label="Business form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <NavMenus menus={[{ title: 'Operations', items }]} aslink={aslink} />
      <button type="submit">Save form</button>
    </form>
  );
  return (
    <React.StrictMode>
      <TooltipProvider>
        <SidebarProvider>
          {mobile ? (
            <>
              <SidebarTrigger type="button" />
              <Sidebar>{content}</Sidebar>
            </>
          ) : (
            content
          )}
        </SidebarProvider>
      </TooltipProvider>
    </React.StrictMode>
  );
}

describe.each(activations)('NavMenus %s activation', (method) => {
  it.each(['both', 'child only', 'parent only', 'neither'] as const)(
    'dispatches exactly one correct callback with %s handlers',
    (handlers) => {
      const parent = vi.fn();
      const child = vi.fn();
      const hasChild = handlers === 'both' || handlers === 'child only';
      const hasParent = handlers === 'both' || handlers === 'parent only';
      render(
        <Fixture
          items={[
            {
              title: 'Customers',
              onClick: hasParent ? parent : undefined,
              subItems: [{ title: 'Create customer', onClick: hasChild ? child : undefined }],
            },
          ]}
        />,
      );

      const toggle = screen.getByRole('button', { name: 'Customers' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      activate(toggle, method);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(parent).not.toHaveBeenCalled();
      expect(child).not.toHaveBeenCalled();

      activate(screen.getByRole('button', { name: 'Create customer' }), method);
      expect(child.mock.calls).toEqual(hasChild ? [['Create customer']] : []);
      expect(parent.mock.calls).toEqual(!hasChild && hasParent ? [['Create customer']] : []);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
    },
  );

  it.each(['top-level action', 'nested action', 'group toggle'] as const)(
    'does not submit an enclosing form for a %s',
    (kind) => {
      const onSubmit = vi.fn();
      const action = vi.fn();
      render(
        <Fixture
          onSubmit={onSubmit}
          items={[
            { title: 'Refresh', onClick: action },
            { title: 'Customers', isActive: true, subItems: [{ title: 'Create customer', onClick: action }] },
          ]}
        />,
      );
      const name = kind === 'top-level action' ? 'Refresh' : kind === 'nested action' ? 'Create customer' : 'Customers';
      const button = screen.getByRole('button', { name });
      activate(button, method);
      // Assert observable submission first so the old code demonstrates the bug.
      expect(onSubmit).not.toHaveBeenCalled();
      expect(button).toHaveAttribute('type', 'button');
      expect(action.mock.calls).toEqual(kind === 'group toggle' ? [] : [[name]]);
      if (kind === 'group toggle') expect(button).toHaveAttribute('aria-expanded', 'false');
      // Positive control: this really is a submitting form, with no blanket prevention.
      fireEvent.click(screen.getByRole('button', { name: 'Save form' }));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    },
  );

  it('closes the real mobile sheet for actions, fallbacks, no-handler items and links, but not group toggles', () => {
    vi.stubGlobal('innerWidth', 375);
    const child = vi.fn();
    const parent = vi.fn();
    const top = vi.fn();
    const onSubmit = vi.fn();
    render(
      <Fixture
        mobile
        onSubmit={onSubmit}
        items={[
          { title: 'Refresh', onClick: top },
          { title: 'Overview', url: '#overview', onClick: top },
          {
            title: 'Customers',
            onClick: parent,
            subItems: [
              { title: 'Create customer', onClick: child },
              { title: 'Parent action' },
              { title: 'Customer list', url: '#customers', onClick: child },
            ],
          },
          { title: 'Settings', subItems: [{ title: 'No handler' }] },
        ]}
      />,
    );

    for (const [name, group, role] of [
      ['Refresh', null, 'button'],
      ['Overview', null, 'link'],
      ['Create customer', 'Customers', 'button'],
      ['Parent action', 'Customers', 'button'],
      ['Customer list', 'Customers', 'link'],
      ['No handler', 'Settings', 'button'],
    ] as const) {
      activate(screen.getByRole('button', { name: 'Toggle Sidebar' }), method);
      const dialog = screen.getByRole('dialog', { name: 'Sidebar' });
      if (group) {
        const toggle = within(dialog).getByRole('button', { name: group });
        activate(toggle, method);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(dialog).toBeInTheDocument();
      }
      // Native links activate with Enter, not Space.
      activate(within(dialog).getByRole(role, { name }), role === 'link' && method === 'Space' ? 'Enter' : method);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    }
    expect(top.mock.calls).toEqual([['Refresh'], ['Overview']]);
    expect(child.mock.calls).toEqual([['Create customer'], ['Customer list']]);
    expect(parent.mock.calls).toEqual([['Parent action']]);
  });
});

describe.each(['href', 'to'] as const)('NavMenus %s router links', (destinationProp) => {
  it.each(['pointer', 'Enter'] as const)('preserves routing, callback precedence and fallback via %s', (method) => {
    const navigate = vi.fn();
    const child = vi.fn();
    const parent = vi.fn();
    const onSubmit = vi.fn();
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<'a'> & { to?: string }>(
      function RouterLink({ to, href, onClick, ...props }, ref) {
        return (
          <a
            {...props}
            ref={ref}
            href={destinationProp === 'to' ? to : href}
            data-to={to}
            onClick={(event) => {
              onClick?.(event);
              if (!event.defaultPrevented) navigate(destinationProp === 'to' ? to : href);
              event.preventDefault();
            }}
          />
        );
      },
    );
    render(
      <Fixture
        aslink={RouterLink}
        onSubmit={onSubmit}
        items={[
          { title: 'Overview', url: '/overview', onClick: child },
          {
            title: 'Customers',
            isActive: true,
            onClick: parent,
            subItems: [
              { title: 'Customer list', url: '/customers', onClick: child, isActive: true },
              { title: 'Archive', url: '/archive' },
            ],
          },
          { title: 'Settings', isActive: true, subItems: [{ title: 'Help', url: '/help' }] },
        ]}
      />,
    );

    for (const [name, url] of [
      ['Overview', '/overview'],
      ['Customer list', '/customers'],
      ['Archive', '/archive'],
      ['Help', '/help'],
    ]) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', url);
      expect(link).toHaveAttribute('data-to', url);
      expect(link).not.toHaveAttribute('type');
      activate(link, method);
    }
    expect(screen.getByRole('link', { name: 'Customer list' })).toHaveAttribute('data-active', 'true');
    expect(navigate.mock.calls).toEqual([['/overview'], ['/customers'], ['/archive'], ['/help']]);
    expect(child.mock.calls).toEqual([['Overview'], ['Customer list']]);
    expect(parent.mock.calls).toEqual([['Archive']]);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
