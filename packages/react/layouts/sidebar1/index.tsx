import * as React from 'react';
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
export type { ISidebarData };
export type { INavUser };

export default function SidebarLayout({
  children,
  aslink,
  data,
}: Readonly<{
  children: React.ReactNode;
  aslink: React.ElementType;
  data: ISidebarData;
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
    <SidebarProvider>
      <AppSidebar aslink={aslink} data={data} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 w-[1px] bg-secondary" />
            <Breadcrumb>
              <BreadcrumbList className="text-dark">
                {activeItems.map((bread, index) => {
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
          </div>
        </header>
        <main className="px-4 pb-2 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
