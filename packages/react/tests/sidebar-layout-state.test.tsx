import type { HTMLAttributes, PropsWithChildren } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: PropsWithChildren) => <>{children}</>,
}));

vi.mock('../components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: PropsWithChildren) => <div>{children}</div>,
  SidebarInset: ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
    <div {...props}>{children}</div>
  ),
  SidebarTrigger: () => <button type="button">Toggle sidebar</button>,
}));

vi.mock('../components/ui/separator', () => ({
  Separator: () => <span aria-hidden="true" />,
}));

vi.mock('../components/ui/breadcrumb', () => ({
  Breadcrumb: ({ children }: PropsWithChildren) => <nav aria-label="breadcrumb">{children}</nav>,
  BreadcrumbList: ({ children }: PropsWithChildren) => <ol>{children}</ol>,
  BreadcrumbItem: ({ children }: PropsWithChildren) => <li>{children}</li>,
  BreadcrumbPage: ({ children }: PropsWithChildren) => <span>{children}</span>,
  BreadcrumbSeparator: () => <li aria-hidden="true">/</li>,
}));

vi.mock('../layouts/sidebar1/app-sidebar', () => ({
  AppSidebar: () => null,
}));

import SidebarLayout, { type ISidebarData, useLayoutHeader } from '../layouts/sidebar1';

const Link = (props: HTMLAttributes<HTMLAnchorElement>) => <a {...props} />;

function data(activeTitle: string): ISidebarData {
  return {
    menus: [{ title: 'Menu', items: [{ title: activeTitle, isActive: true }] }],
    userMenus: [],
  };
}

function HeaderControls({ label }: { label: string }) {
  const setLayoutHeader = useLayoutHeader();
  return (
    <>
      <button type="button" onClick={() => setLayoutHeader(<span>{label}</span>)}>
        Set {label}
      </button>
      <button type="button" onClick={() => setLayoutHeader(null)}>
        Reset {label}
      </button>
    </>
  );
}

describe('sidebar layout header state', () => {
  it('keeps header state isolated between mounted layouts', () => {
    render(
      <>
        <section data-testid="layout-a">
          <SidebarLayout aslink={Link} data={data('Default A')}>
            <HeaderControls label="Custom A" />
          </SidebarLayout>
        </section>
        <section data-testid="layout-b">
          <SidebarLayout aslink={Link} data={data('Default B')}>
            <HeaderControls label="Custom B" />
          </SidebarLayout>
        </section>
      </>,
    );

    const layoutA = within(screen.getByTestId('layout-a'));
    const layoutB = within(screen.getByTestId('layout-b'));
    fireEvent.click(layoutA.getByRole('button', { name: 'Set Custom A' }));

    expect(layoutA.getByText('Custom A')).toBeInTheDocument();
    expect(layoutA.queryByText('Default A')).not.toBeInTheDocument();
    expect(layoutB.getByText('Default B')).toBeInTheDocument();
    expect(layoutB.queryByText('Custom A')).not.toBeInTheDocument();

    fireEvent.click(layoutB.getByRole('button', { name: 'Set Custom B' }));
    fireEvent.click(layoutA.getByRole('button', { name: 'Reset Custom A' }));

    expect(layoutA.getByText('Default A')).toBeInTheDocument();
    expect(layoutB.getByText('Custom B')).toBeInTheDocument();
  });

  it('starts with the default header after unmount and remount', () => {
    const layout = (
      <SidebarLayout aslink={Link} data={data('Default header')}>
        <HeaderControls label="Temporary header" />
      </SidebarLayout>
    );
    const { rerender } = render(layout);

    fireEvent.click(screen.getByRole('button', { name: 'Set Temporary header' }));
    expect(screen.getByText('Temporary header')).toBeInTheDocument();

    rerender(<div>Unmounted</div>);
    rerender(layout);

    expect(screen.getByText('Default header')).toBeInTheDocument();
    expect(screen.queryByText('Temporary header')).not.toBeInTheDocument();
  });
});
