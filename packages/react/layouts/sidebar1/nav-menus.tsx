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

export interface IMenuSubItem {
  title: string;
  url?: string;
  icon?: React.ElementType;
  isActive?: boolean;
  onClick?: (title: string) => void;
}

export interface IMenuItem extends IMenuSubItem {
  subItems?: IMenuSubItem[];
}

export interface INavMenu {
  title: string;
  items: IMenuItem[];
}

function SidebarMenuLink({ item, as: LinkComponent }: { item: IMenuSubItem; as: React.ElementType }) {
  const { setOpenMobile } = useSidebar();
  const Comp = LinkComponent && item.url ? LinkComponent : 'button';

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title} onClick={() => setOpenMobile(false)}>
        <Comp to={item.url} href={item.url} onClick={() => item.onClick?.(item.title)}>
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
          <SidebarMenuButton tooltip={item.title}>
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
                      to={subItem.url}
                      href={subItem.url}
                      onClick={() => item.onClick?.(subItem.title)}
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

export function NavMenus({ menus, aslink }: { menus: INavMenu[]; aslink: React.ElementType }) {
  return menus.map((menu) => {
    return (
      <SidebarGroup key={menu.title}>
        <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
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
