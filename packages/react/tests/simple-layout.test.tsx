import { useEffect, useState, type AnchorHTMLAttributes } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SimpleLayout from '../layouts/simple';

function TestLink({ to: _to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }) {
  return <a {...props} />;
}

describe('SimpleLayout loading', () => {
  it.each([undefined, null])(
    'shows the default status for loadingContent=%s and restores content',
    (loadingContent) => {
      const page = (loading?: boolean) => (
        <SimpleLayout aslink={TestLink} loading={loading} loadingContent={loadingContent}>
          Page content
        </SimpleLayout>
      );
      const { rerender } = render(page(true));

      expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
      expect(within(screen.getByRole('main')).getByRole('status')).toHaveTextContent('Loading…');
      expect(screen.queryByText('Page content')).not.toBeInTheDocument();

      rerender(page(false));
      expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'false');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(within(screen.getByRole('main')).getByText('Page content')).toBeVisible();

      rerender(page());
      expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'false');
      expect(screen.getByText('Page content')).toBeVisible();
    },
  );

  it('renders a localized slot while header, footer, and mobile navigation remain usable', () => {
    const headerAction = vi.fn();
    const footerAction = vi.fn();
    const page = (loading: boolean) => (
      <SimpleLayout
        aslink={TestLink}
        loading={loading}
        loadingContent={
          <p role="status" aria-label="Chargement des clients">
            Chargement…
          </p>
        }
        left={{ menus: [{ label: 'Dashboard', action: headerAction, title: true }] }}
        right={{ menus: [{ label: 'Support', link: '/support' }] }}
        footer={{ menus: [{ label: 'Help', action: footerAction }], content: 'Footer content' }}
      >
        Customer list
      </SimpleLayout>
    );
    const { rerender } = render(page(true));

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-busy', 'true');
    expect(within(main).getByRole('status', { name: 'Chargement des clients' })).toHaveTextContent('Chargement…');
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
    expect(screen.queryByText('Customer list')).not.toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('banner')).getByRole('button', { name: 'Dashboard' }));
    fireEvent.click(within(screen.getByRole('contentinfo')).getByRole('button', { name: 'Help' }));
    expect(headerAction).toHaveBeenCalledOnce();
    expect(footerAction).toHaveBeenCalledOnce();
    expect(screen.getByText('Footer content')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(
      within(screen.getByRole('navigation', { name: 'Mobile navigation' })).getByRole('link', { name: 'Support' }),
    ).toHaveAttribute('href', '/support');

    rerender(page(false));
    expect(main).toHaveAttribute('aria-busy', 'false');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Customer list')).toBeVisible();
  });

  it('unmounts children during loading and starts fresh child state on completion', () => {
    const onMount = vi.fn();
    const onUnmount = vi.fn();
    function Draft() {
      const [value, setValue] = useState('Initial draft');
      useEffect(() => {
        onMount();
        return () => {
          onUnmount();
        };
      }, []);
      return <input aria-label="Draft" value={value} onChange={(event) => setValue(event.target.value)} />;
    }
    const page = (loading: boolean) => (
      <SimpleLayout aslink={TestLink} loading={loading}>
        <Draft />
      </SimpleLayout>
    );
    const { rerender } = render(page(true));
    expect(onMount).not.toHaveBeenCalled();

    rerender(page(false));
    expect(onMount).toHaveBeenCalledTimes(1);
    fireEvent.change(screen.getByRole('textbox', { name: 'Draft' }), { target: { value: 'Unsaved edit' } });
    expect(screen.getByRole('textbox', { name: 'Draft' })).toHaveValue('Unsaved edit');

    rerender(page(true));
    expect(onUnmount).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    rerender(page(false));
    expect(onMount).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('textbox', { name: 'Draft' })).toHaveValue('Initial draft');
  });
});

describe('SimpleLayout navigation', () => {
  it('renders desktop navigation, mobile navigation, and content class overrides', () => {
    render(
      <SimpleLayout
        aslink={TestLink}
        left={{
          menus: [
            { label: 'Products', link: '/products', title: true },
            { label: 'Pricing', link: '/pricing' },
          ],
        }}
        right={{ menus: [{ label: 'Support', link: '/support' }] }}
        user={{ menuSections: [{ label: 'Account', items: [{ label: 'Profile', link: '/profile' }] }] }}
        classNames={{ content: { wrapper: 'content-override', bottom: 'bottom-override' } }}
      >
        Page content
      </SimpleLayout>,
    );

    const primary = screen.getByRole('navigation', { name: 'Primary navigation' });
    const secondary = screen.getByRole('navigation', { name: 'Secondary navigation' });
    expect(within(primary).getByRole('link', { name: 'Products' })).toHaveClass('inline-block');
    expect(within(primary).getByRole('link', { name: 'Pricing' })).toHaveClass('hidden', 'md:inline-block');
    expect(within(secondary).getByRole('link', { name: 'Support' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveClass('content-override');
    expect(screen.getByRole('main')).not.toHaveClass('bottom-override');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    const mobile = screen.getByRole('navigation', { name: 'Mobile navigation' });
    expect(within(mobile).getByRole('link', { name: 'Pricing' })).toBeInTheDocument();
    expect(within(mobile).getByRole('link', { name: 'Support' })).toBeInTheDocument();
    expect(within(mobile).getByRole('link', { name: 'Profile' })).toBeInTheDocument();
    expect(within(mobile).queryByRole('link', { name: 'Products' })).not.toBeInTheDocument();
  });

  it('keeps layout controls from submitting an enclosing form', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const leftAction = vi.fn();
    const rightAction = vi.fn();
    const footerAction = vi.fn();
    const { container } = render(
      <form onSubmit={onSubmit}>
        <SimpleLayout
          aslink={TestLink}
          left={{ menus: [{ label: 'Dashboard', action: leftAction, title: true }] }}
          right={{ menus: [{ label: 'Sign out', action: rightAction }] }}
          footer={{ menus: [{ label: 'Help', action: footerAction }] }}
        />
      </form>,
    );

    expect([...container.querySelectorAll('button')]).not.toHaveLength(0);
    for (const button of container.querySelectorAll('button')) {
      expect(button).toHaveAttribute('type', 'button');
    }

    fireEvent.click(screen.getByRole('button', { name: 'Dashboard' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    fireEvent.click(screen.getByRole('button', { name: 'Help' }));
    fireEvent.click(screen.getByRole('button', { name: 'Toggle navigation' }));

    expect(leftAction).toHaveBeenCalledOnce();
    expect(rightAction).toHaveBeenCalledOnce();
    expect(footerAction).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
