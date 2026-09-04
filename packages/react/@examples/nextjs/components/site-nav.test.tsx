import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// jsdom lacks matchMedia, which the sidebar's mobile hook uses.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
}

let mockPathname = '/';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

import { TooltipProvider } from '@egose/shadcn-theme/components/ui/tooltip';
import { SIDEBAR_DATA, SiteNav, withActiveNav } from './site-nav';

function activeTrail(data: ReturnType<typeof withActiveNav>) {
  const trail: string[] = [];
  data.menus.forEach((menu) =>
    menu.items.forEach((item) => {
      if (item.subItems) {
        item.subItems.forEach((subItem) => {
          if (subItem.isActive) trail.push(item.title, subItem.title);
        });
      } else if (item.isActive) {
        trail.push(item.title);
      }
    }),
  );
  return trail;
}

describe('withActiveNav', () => {
  it('activates nothing on the index route', () => {
    expect(activeTrail(withActiveNav(SIDEBAR_DATA, '/'))).toEqual([]);
  });

  it('activates the section item on a static section route without acting like a sub item', () => {
    // `/components` is a landing prefix shared by every sub item; no sub item should match exactly.
    expect(activeTrail(withActiveNav(SIDEBAR_DATA, '/components'))).toEqual([]);
    expect(activeTrail(withActiveNav(SIDEBAR_DATA, '/form'))).toEqual([]);
  });

  it('activates item and sub item on dynamic component routes', () => {
    expect(activeTrail(withActiveNav(SIDEBAR_DATA, '/components/button'))).toEqual(['Components', 'Button']);
  });

  it('activates nested form routes', () => {
    expect(activeTrail(withActiveNav(SIDEBAR_DATA, '/form/textarea'))).toEqual(['Form', 'Textarea']);
  });

  it('activates nothing on unknown routes', () => {
    expect(activeTrail(withActiveNav(SIDEBAR_DATA, '/does-not-exist'))).toEqual([]);
    expect(activeTrail(withActiveNav(SIDEBAR_DATA, '/components/not-a-real-slug'))).toEqual([]);
  });

  it('does not mutate the shared module-scope data', () => {
    withActiveNav(SIDEBAR_DATA, '/components/button');
    const hasActive = SIDEBAR_DATA.menus.some((menu) =>
      menu.items.some((item) => item.isActive || (item.subItems ?? []).some((subItem) => subItem.isActive)),
    );
    expect(hasActive).toBe(false);
    // Re-deriving for a different route starts clean.
    expect(activeTrail(withActiveNav(SIDEBAR_DATA, '/'))).toEqual([]);
  });
});

describe('SiteNav', () => {
  afterEach(() => cleanup());

  it('renders the active breadcrumb trail for a dynamic route', () => {
    mockPathname = '/components/button';
    render(
      <TooltipProvider>
        <SiteNav>
          <div />
        </SiteNav>
      </TooltipProvider>,
    );
    const nav = screen.getByRole('navigation', { name: 'breadcrumb' });
    expect(nav.textContent).toContain('Components');
    expect(nav.textContent).toContain('Button');
  });

  it('renders an empty breadcrumb on an unknown route', () => {
    mockPathname = '/nowhere';
    render(
      <TooltipProvider>
        <SiteNav>
          <div />
        </SiteNav>
      </TooltipProvider>,
    );
    const nav = screen.getByRole('navigation', { name: 'breadcrumb' });
    expect(nav.textContent ?? '').not.toContain('Components');
    expect(nav.textContent ?? '').not.toContain('Form');
  });
});
