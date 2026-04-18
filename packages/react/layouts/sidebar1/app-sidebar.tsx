import * as React from 'react';
import { NavMenus } from './nav-menus';
import { NavUser, INavUser, INavUserMenuItem } from './nav-user';
import { ContextSwitcher, INavContext } from './context-switcher';
import { INavMenu } from './nav-menus';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '../../components/ui/sidebar';
import { Button } from '../../components/ui/button';

export interface ISidebarContext {
  title?: string;
  addText?: string;
  items?: INavContext[];
  canAdd?: boolean;
}

export interface ISidebarData {
  user?: INavUser;
  context?: ISidebarContext;
  menus: INavMenu[];
  userMenus: INavUserMenuItem[];
  events?: {
    login?: () => void;
    logout?: (user: INavUser) => void;
    newContext?: () => void;
    contextSelect?: (context: INavContext) => void;
  };
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  data: ISidebarData;
  aslink: React.ElementType;
}) {
  const { data, aslink, ...rest } = props;
  const { context } = data;

  return (
    <Sidebar collapsible="icon" {...rest}>
      {context?.items && context.items.length > 0 && (
        <SidebarHeader>
          <ContextSwitcher
            items={context.items}
            title={context.title}
            newContextText={context.addText}
            canAdd={context.canAdd}
            onContextAdd={() => {
              if (data.events?.newContext) {
                data.events.newContext();
              }
            }}
            onContextSelected={(context: INavContext) => {
              if (data.events?.contextSelect) {
                data.events.contextSelect(context);
              }
            }}
          />
        </SidebarHeader>
      )}

      <SidebarContent>
        <NavMenus menus={data.menus} aslink={aslink} />
      </SidebarContent>

      <SidebarFooter>
        {data.user ? (
          <NavUser user={data.user} menus={data.userMenus} aslink={aslink} onLogout={data.events?.logout} />
        ) : (
          <Button
            variant="action"
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
