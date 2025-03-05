'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../../components/ui/sidebar';

export interface INavContext {
  name: string;
  logo: React.ElementType;
  text: string;
}

export function ContextSwitcher({
  items,
  title = 'Contexts',
  newContextText = 'Add context',
}: {
  items: INavContext[];
  title?: string;
  newContextText?: string;
}) {
  const { isMobile } = useSidebar();
  const [activeContext, setActiveContext] = React.useState(items[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-dark text-dark-foreground">
                <activeContext.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeContext.name}</span>
                <span className="truncate text-xs">{activeContext.text}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">{title}</DropdownMenuLabel>
            {items.map((item, index) => (
              <DropdownMenuItem key={item.name} onClick={() => setActiveContext(item)} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <item.logo className="size-4 shrink-0" />
                </div>
                {item.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">{newContextText}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
