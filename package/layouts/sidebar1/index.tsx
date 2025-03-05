import React from 'react';
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
  onLogout,
  data,
}: Readonly<{
  children: React.ReactNode;
  aslink: React.ElementType;
  onLogout?: (user: INavUser) => void;
  data: ISidebarData;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar aslink={aslink} data={data} onLogout={onLogout} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {/* {snap.breadcrumb.map((bread, index) => {
                return (
                  <React.Fragment key={bread.label}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {bread.link ? (
                        <Link href={bread.link} className="transition-colors hover:text-foreground">
                          {bread.label}
                        </Link>
                      ) : (
                        <BreadcrumbPage>{bread.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })} */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="px-4 pb-2">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
