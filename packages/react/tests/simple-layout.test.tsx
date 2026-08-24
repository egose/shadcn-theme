import type { AnchorHTMLAttributes } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SimpleLayout from '../layouts/simple';

function TestLink({ to: _to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }) {
  return <a {...props} />;
}

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
