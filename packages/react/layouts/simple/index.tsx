import React, { useState, useMemo, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { UserMenus } from './user-menu';
import { MobileMenu } from './mobile-menu';
import type { MenuItem, UserMenuSection } from './types';

interface LayoutProps {
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
  sidebar?: {
    title: string;
    content: React.ReactNode;
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

export default function SimpleLayout(props: LayoutProps) {
  const { logo, user, left, right, sidebar, footer, classNames, loading, children, aslink } = props;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const LinkComponent = aslink ?? 'button';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const leftMenus = left?.menus ?? [];
  const rightMenus = right?.menus ?? [];
  const topMenus = [...leftMenus, ...rightMenus];
  const userMenuSections = user?.menuSections ?? [];
  const footerMenus = footer?.menus ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={cn(
          'px-4 py-2 flex items-center justify-between bg-gray-100 border-b border-gray-300',
          classNames?.header,
        )}
      >
        <div className="flex items-center space-x-4">
          {sidebar && (
            <button
              className="bg-transparent border-gray-400 hover:border-gray-500"
              onClick={() => {
                /* open sidebar */
              }}
            >
              {/* icon */}
            </button>
          )}
          {logo && (
            <div className={cn('_logo')}>
              <LinkComponent to={logo.link ?? '/'} href={logo.link ?? '/'}>
                <img src={logo.src} alt="Logo" className={cn('h-10', classNames?.header?.logo)} />
              </LinkComponent>
            </div>
          )}

          {/* Left Menus */}
          <nav className={cn('flex space-x-4 items-center', classNames?.header?.left?.nav)}>
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
                    item.title || !isMobile ? 'inline-block' : 'hidden',
                  )}
                >
                  {item.label}
                </LinkComponent>
              ) : (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={cn(
                    'text-left text-secondary visited:text-secondary hover:text-primary cursor-pointer no-underline',
                    classNames?.header?.left?.link,
                    item.className,
                    item.title || !isMobile ? 'inline-block' : 'hidden',
                  )}
                >
                  {item.label}
                </button>
              ),
            )}
          </nav>
        </div>

        {/* Right menus */}
        <nav className={cn('hidden md:flex space-x-4 items-center', classNames?.header?.right?.nav)}>
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
        <button onClick={toggleMobileMenu} className="md:hidden p-2 text-gray-700 hover:text-primary cursor-pointer">
          <Menu className="" />
        </button>
      </header>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="w-full">
          <MobileMenu sections={userMenuSections} aslink={aslink} onClick={toggleMobileMenu} />
        </div>
      )}

      {/* Main content */}
      <main className={cn('p-4 flex flex-col flex-1', classNames?.content)}>
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
