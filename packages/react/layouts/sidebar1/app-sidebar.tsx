import * as React from 'react';
import { NavMenus } from './nav-menus';
import { NavUser, INavUser, INavUserMenuItem } from './nav-user';
import { ContextSwitcher, INavContext } from './context-switcher';
import { INavMenu } from './nav-menus';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '../../components/ui/sidebar';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

export interface ISidebarData {
  user?: INavUser;
  contexts: INavContext[];
  menus: INavMenu[];
  userMenus: INavUserMenuItem[];
  events?: {
    login?: () => void;
    logout?: (user: INavUser) => void;
  };
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  data: ISidebarData;
  aslink: React.ElementType;
}) {
  const { data, aslink, ...rest } = props;

  return (
    <Sidebar collapsible="icon" {...rest}>
      <SidebarHeader>
        <ContextSwitcher items={data.contexts} />
      </SidebarHeader>

      <SidebarContent>
        <NavMenus menus={data.menus} aslink={aslink} />
      </SidebarContent>

      <SidebarFooter>
        {data.user ? (
          <NavUser user={data.user} menus={data.userMenus} aslink={aslink} onLogout={data.events?.logout} />
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              if (data.events?.login) {
                data.events.login();
              }
            }}
          >
            Sign in
          </Button>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
