'use client';

import * as React from 'react';
import { ChevronsUpDown, LogOut, type LucideIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../../components/ui/sidebar';

export interface INavUser {
  name: string;
  email: string;
  avatar: string;
}

export interface INavUserMenuItem {
  title: string;
  url?: string;
  icon?: React.ElementType;
  onClick?: (title: string) => void;
}

export function NavUser({
  user,
  menus = [],
  aslink: LinkComponent,
  onLogout,
}: {
  user: INavUser;
  menus: INavUserMenuItem[];
  aslink?: React.ElementType;
  onLogout?: (user: INavUser) => void;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {menus.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              {menus.map((menu) => {
                const Comp = LinkComponent && menu.url ? LinkComponent : 'button';

                return (
                  <Comp
                    key={menu.title}
                    to={menu.url}
                    href={menu.url}
                    onClick={() => menu.onClick?.(menu.title)}
                    className="block w-full"
                  >
                    <DropdownMenuItem>
                      {menu.icon && <menu.icon />}
                      {menu.title}
                    </DropdownMenuItem>
                  </Comp>
                );
              })}
            </DropdownMenuGroup>

            {onLogout && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onLogout(user)}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
