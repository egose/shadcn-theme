'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../../components/ui/sidebar';
import { useSidebar } from '../../components/ui/sidebar';
import { cn } from '../../utils/ui';

export interface IMenuSubItem {
  title: string;
  /** Destination passed as both href and to to the supplied router/link component. */
  url?: string;
  icon?: React.ElementType;
  isActive?: boolean;
  /**
   * Called with this item's title on activation, including URL links.
   * A child handler takes precedence over its parent handler. If absent, the
   * parent handler receives the child's title as a fallback; never both.
   */
  onClick?: (title: string) => void;
}

export interface IMenuItem extends IMenuSubItem {
  /** Nonempty children render a group toggle, which does not invoke onClick. */
  subItems?: IMenuSubItem[];
}

export interface INavMenu {
  title: string;
  items: IMenuItem[];
  hideTitle?: boolean;
  className?: string;
}

function SidebarMenuLink({ item, as: LinkComponent }: { item: IMenuSubItem; as: React.ElementType }) {
  const { setOpenMobile } = useSidebar();
  const Comp = LinkComponent && item.url ? LinkComponent : 'button';

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title} onClick={() => setOpenMobile(false)}>
        <Comp
          type={Comp === 'button' ? 'button' : undefined}
          to={item.url}
          href={item.url}
          onClick={() => item.onClick?.(item.title)}
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Comp>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarMenuCollapsible({ item, as: LinkComponent }: { item: IMenuItem; as: React.ElementType }) {
  const { setOpenMobile } = useSidebar();
  if (!item.subItems) return null;

  return (
    <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton type="button" tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>

            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems.map((subItem) => {
              const Comp = LinkComponent && subItem.url ? LinkComponent : 'button';

              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild isActive={subItem.isActive} onClick={() => setOpenMobile(false)}>
                    <Comp
                      type={Comp === 'button' ? 'button' : undefined}
                      to={subItem.url}
                      href={subItem.url}
                      onClick={() => (subItem.onClick ?? item.onClick)?.(subItem.title)}
                      className="block w-full"
                    >
                      {subItem.icon && <subItem.icon />}
                      <span>{subItem.title}</span>
                    </Comp>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/**
 * Sidebar navigation under SidebarProvider and TooltipProvider. URL items use
 * aslink; action-only items and group toggles use non-submit buttons. Leaf
 * activation closes the mobile sidebar even without a handler; toggling a
 * group leaves it open. Callbacks do not suppress link/router navigation.
 */
export function NavMenus({ menus, aslink }: { menus: INavMenu[]; aslink: React.ElementType }) {
  return menus.map((menu) => {
    return (
      <SidebarGroup key={menu.title} className={cn(menu.className)}>
        {!menu.hideTitle && <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>}

        <SidebarMenu>
          {menu.items.map((item) =>
            item.subItems && item.subItems.length > 0 ? (
              <SidebarMenuCollapsible key={item.title} item={item} as={aslink} />
            ) : (
              <SidebarMenuLink key={item.title} item={item} as={aslink} />
            ),
          )}
        </SidebarMenu>
      </SidebarGroup>
    );
  });
}
