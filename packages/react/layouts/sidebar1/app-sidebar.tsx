'use client';

import * as React from 'react';
import { NavMenus } from './nav-menus';
import { NavUser, INavUser, INavUserMenuItem } from './nav-user';
import { ContextSwitcher, INavContext } from './context-switcher';
import { INavMenu } from './nav-menus';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '../../components/ui/sidebar';

export interface ISidebarData {
  user: INavUser;
  contexts: INavContext[];
  menus: INavMenu[];
  userMenus: INavUserMenuItem[];
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  data: ISidebarData;
  aslink: React.ElementType;
  onLogout?: (user: INavUser) => void;
}) {
  const { data, aslink, onLogout, ...rest } = props;

  return (
    <Sidebar collapsible="icon" {...rest}>
      <SidebarHeader>
        <ContextSwitcher items={data.contexts} />
      </SidebarHeader>
      <SidebarContent>
        <NavMenus menus={data.menus} aslink={aslink} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} menus={data.userMenus} aslink={aslink} onLogout={onLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
