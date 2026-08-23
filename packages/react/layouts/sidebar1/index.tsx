'use client';

import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import { Separator } from '../../components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar';
import { AppSidebar, ISidebarData } from './app-sidebar';
import { INavUser } from './nav-user';
import { cn } from '../../utils/ui';
import { ThemeProvider } from 'next-themes';
export type { ISidebarData };
export type { INavUser };

/**
 * Collapsible sidebar layout built on `@egose/shadcn-theme/components/ui/sidebar`.
 * Wraps content with `SidebarProvider`, renders an `AppSidebar` from `data`,
 * and shows a breadcrumb of active items in the header. Pass `aslink` (your
 * router's `Link`) so internal links work; the header also accepts custom
 * content via {@link useLayoutHeader}.
 *
 * @example
 * <SidebarLayout aslink={Link} data={sidebarData}>
 *   {children}
 * </SidebarLayout>
 */
export default function SidebarLayout({
  children,
  aslink,
  data,
  classNames,
}: Readonly<{
  children: React.ReactNode;
  aslink: React.ElementType;
  data: ISidebarData;
  classNames?: {
    sidebar?: string;
    inset?: string;
    header?: string;
    main?: string;
  };
}>) {
  const [header, setHeader] = React.useState<React.ReactNode>(null);
  const activeItems: string[] = [];

  data.menus.forEach((menu) => {
    menu.items.forEach((item) => {
      if (item.subItems) {
        item.subItems.forEach((subItem) => {
          if (subItem.isActive) {
            activeItems.push(item.title, subItem.title);
          }
        });
      } else if (item.isActive) {
        activeItems.push(item.title);
      }
    });
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LayoutHeaderContext.Provider value={setHeader}>
        <SidebarProvider>
          <AppSidebar aslink={aslink} data={data} className={cn(classNames?.sidebar)} />
          <SidebarInset className={cn(classNames?.inset)}>
            <header
              className={cn(
                'flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12',
                classNames?.header,
              )}
            >
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="" />
                <LayoutHeader items={activeItems} content={header} />
              </div>
            </header>
            <main className={cn('px-4 pb-2 overflow-auto', classNames?.main)}>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </LayoutHeaderContext.Provider>
    </ThemeProvider>
  );
}

type SetLayoutHeader = (node: React.ReactNode) => void;

const LayoutHeaderContext = React.createContext<React.Dispatch<React.SetStateAction<React.ReactNode>> | null>(null);

/**
 * Returns a setter for the nearest sidebar layout's header slot. Pass a React
 * node to replace its breadcrumb or `null` to restore that layout's default.
 * Throws when used outside a {@link SidebarLayout}.
 */
export function useLayoutHeader(): SetLayoutHeader {
  const setHeader = React.useContext(LayoutHeaderContext);
  if (!setHeader) {
    throw new Error('useLayoutHeader must be used within a SidebarLayout');
  }
  return React.useCallback((node: React.ReactNode) => setHeader(() => node), [setHeader]);
}

function LayoutHeader({ items, content }: { items: string[]; content: React.ReactNode }) {
  if (content !== null) {
    return <>{content}</>;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-dark">
        {items.map((bread, index) => {
          return (
            <React.Fragment key={bread}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbPage className="">{bread}</BreadcrumbPage>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
