import * as React from 'react';
import { proxy, ref, useSnapshot } from 'valtio';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
              <LayoutHeader items={activeItems} />
            </div>
          </header>
          <main className={cn('px-4 pb-2 overflow-auto', classNames?.main)}>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

interface HeaderState {
  content: React.ReactNode | ReturnType<typeof ref<object>>;
}

export const headerStore = proxy<HeaderState>({
  content: null,
});

export const setLayoutHeader = (node: React.ReactNode) => {
  if (node !== null && typeof node === 'object') {
    // We cast to any here to satisfy the internal Valtio ref assignment
    // or use a utility type
    headerStore.content = ref(node as object);
  } else {
    headerStore.content = node;
  }
};

function LayoutHeader({ items }: { items: string[] }) {
  const snap = useSnapshot(headerStore);
  if (snap.content) {
    return <>{snap.content}</>;
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
