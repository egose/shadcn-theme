'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '../../utils/ui';
import { UserMenus } from './user-menu';
import { MobileMenu } from './mobile-menu';
import type { MenuItem, UserMenuSection } from './types';

export type { MenuItem, UserMenuSection } from './types';

/**
 * Props for {@link SimpleLayout}. The layout renders a fixed header with
 * optional left/right nav menus, an optional user dropdown, an optional
 * mobile menu, an optional footer, and a main content slot for `children`.
 *
 * `aslink` is required: pass your router's `Link` component so internal
 * navigation works without re-implementing it. The same component is
 * rendered for both `to=` (React Router) and `href=` (Next.js) prop styles.
 */
export interface SimpleLayoutProps {
  logo?: {
    src?: string;
    link?: string;
  };
  user?: {
    menuSections: UserMenuSection[];
    trigger?: React.ReactNode;
  };
  left?: {
    menus: MenuItem[];
  };
  right?: {
    menus: MenuItem[];
  };
  footer?: {
    menus: MenuItem[];
    content?: string;
  };
  classNames?: {
    header?: {
      wrapper: string;
      logo?: string;
      left?: {
        nav?: string;
        link?: string;
      };
      right?: {
        nav?: string;
        link?: string;
      };
    };
    content?: {
      wrapper?: string;
      bottom?: string;
    };
    footer?: {
      wrapper?: string;
      nav?: string;
      link?: string;
    };
  };
  loading?: boolean;
  children?: React.ReactNode;
  aslink: React.ElementType;
}

/**
 * Header + main + footer layout for content-light pages. Mobile-aware
 * (collapsible menu under 768px). Compose the inner pieces with the
 * `classNames` slots rather than overriding internal markup.
 *
 * @example
 * <SimpleLayout
 *   aslink={Link}
 *   left={{ menus: [{ label: 'Home', link: '/' }] }}
 *   user={{ menuSections: [...] }}
 * >
 *   {children}
 * </SimpleLayout>
 */
export default function SimpleLayout(props: SimpleLayoutProps) {
  const { logo, user, left, right, footer, classNames, loading, children, aslink } = props;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const LinkComponent = aslink;

  const toggleMobileMenu = () => setMobileMenuOpen((open) => !open);

  const leftMenus = left?.menus ?? [];
  const rightMenus = right?.menus ?? [];
  const userMenuSections = user?.menuSections ?? [];
  const footerMenus = footer?.menus ?? [];
  const mobileMenuSections: UserMenuSection[] = [
    ...(leftMenus.some((item) => !item.title) ? [{ items: leftMenus.filter((item) => !item.title) }] : []),
    ...(rightMenus.length > 0 ? [{ items: rightMenus }] : []),
    ...userMenuSections,
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={cn(
          'px-4 py-2 flex items-center justify-between bg-gray-100 border-b border-gray-300',
          classNames?.header?.wrapper,
        )}
      >
        <div className="flex items-center space-x-4">
          {logo && (
            <div className={cn('_logo')}>
              <LinkComponent to={logo.link ?? '/'} href={logo.link ?? '/'}>
                <img src={logo.src} alt="Logo" className={cn('h-10', classNames?.header?.logo)} />
              </LinkComponent>
            </div>
          )}

          {/* Left Menus */}
          <nav
            aria-label="Primary navigation"
            className={cn('flex space-x-4 items-center', classNames?.header?.left?.nav)}
          >
            {leftMenus.map((item) =>
              item.link ? (
                <LinkComponent
                  key={item.label}
                  to={item.link}
                  href={item.link}
                  className={cn(
                    'text-left text-secondary visited:text-secondary hover:text-primary cursor-pointer no-underline',
                    classNames?.header?.left?.link,
                    item.className,
                    item.title ? 'inline-block' : 'hidden md:inline-block',
                  )}
                >
                  {item.label}
                </LinkComponent>
              ) : (
                <button
                  type="button"
                  key={item.label}
                  onClick={item.action}
                  className={cn(
                    'text-left text-secondary visited:text-secondary hover:text-primary cursor-pointer no-underline',
                    classNames?.header?.left?.link,
                    item.className,
                    item.title ? 'inline-block' : 'hidden md:inline-block',
                  )}
                >
                  {item.label}
                </button>
              ),
            )}
          </nav>
        </div>

        {/* Right menus */}
        <nav
          aria-label="Secondary navigation"
          className={cn('hidden md:flex space-x-4 items-center', classNames?.header?.right?.nav)}
        >
          {rightMenus.map((item) =>
            item.link ? (
              <LinkComponent
                key={item.label}
                to={item.link}
                href={item.link}
                className={cn(
                  'text-left text-secondary visited:text-secondary hover:text-primary cursor-pointer no-underline',
                  classNames?.header?.right?.link,
                  item.className,
                )}
              >
                {item.label}
              </LinkComponent>
            ) : (
              <button
                type="button"
                key={item.label}
                onClick={item.action}
                className={cn(
                  'text-left text-secondary visited:text-secondary hover:text-primary cursor-pointer no-underline',
                  classNames?.header?.right?.link,
                  item.className,
                )}
              >
                {item.label}
              </button>
            ),
          )}
          {userMenuSections.length > 0 && (
            <UserMenus sections={userMenuSections} trigger={user?.trigger} aslink={aslink} />
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-gray-700 hover:text-primary cursor-pointer"
        >
          <Menu className="" />
        </button>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="w-full md:hidden">
          <MobileMenu sections={mobileMenuSections} aslink={aslink} onClick={toggleMobileMenu} />
        </div>
      )}

      {/* Main content */}
      <main className={cn('p-4 flex flex-col flex-1', classNames?.content?.wrapper)}>
        {!loading && <div className="flex items-center justify-center h-full">{children}</div>}
        <div className={cn('flex-1', classNames?.content?.bottom)}></div>
      </main>

      {/* Footer */}
      {footer && (
        <footer
          className={cn(
            'px-4 py-4 bg-gray-100 border-t border-gray-300 text-sm text-gray-600',
            classNames?.footer?.wrapper,
          )}
        >
          <nav className={cn('flex flex-wrap justify-center space-x-4', classNames?.footer?.nav)}>
            {footerMenus.map((item) =>
              item.link ? (
                <LinkComponent
                  key={item.label}
                  to={item.link}
                  href={item.link}
                  className={cn(
                    'text-secondary hover:text-primary cursor-pointer no-underline',
                    classNames?.footer?.link,
                    item.className,
                  )}
                >
                  {item.label}
                </LinkComponent>
              ) : (
                <button
                  type="button"
                  key={item.label}
                  onClick={item.action}
                  className={cn(
                    'text-secondary hover:text-primary cursor-pointer no-underline',
                    classNames?.footer?.link,
                    item.className,
                  )}
                >
                  {item.label}
                </button>
              ),
            )}
          </nav>
          <div className="mt-2 text-center">{footer?.content}</div>
        </footer>
      )}
    </div>
  );
}
