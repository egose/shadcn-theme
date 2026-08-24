'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../../components/ui/sidebar';
import { cn } from '../../utils/ui';

export interface INavContext {
  name: string;
  logo?: React.ElementType;
  logoUrl?: string;
  text: string;
  active?: boolean;
  className?: string;
}

/**
 * Selects the active workspace, organization, or tenant. An empty `items`
 * array is supported and renders nothing until contexts are available.
 */
export function ContextSwitcher({
  items,
  title = 'Contexts',
  newContextText = 'Add context',
  canAdd = false,
  onContextAdd,
  onContextSelected,
}: {
  items: INavContext[];
  title?: string;
  newContextText?: string;
  canAdd?: boolean;
  onContextAdd?: () => void;
  onContextSelected?: (context: INavContext) => void;
}) {
  const { isMobile } = useSidebar();
  const [activeContext, setActiveContext] = React.useState<INavContext | undefined>(
    items.find((item) => item.active) || items[0],
  );

  React.useEffect(() => {
    if (items.length === 0) {
      setActiveContext(undefined);
      return;
    }
    setActiveContext((prev) => {
      const stillExists = items.find((item) => item.name === prev?.name);
      return stillExists ?? items[0];
    });
  }, [items]);

  if (items.length === 0 || !activeContext) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              type="button"
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={cn(
                  'flex aspect-square size-8 items-center justify-center rounded-lg bg-dark text-dark-foreground',
                  activeContext.className,
                )}
              >
                {activeContext.logo ? (
                  <activeContext.logo className="size-4" />
                ) : (
                  <img src={activeContext.logoUrl} alt={activeContext.name} className="size-4 rounded-sm" />
                )}
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeContext.name}</span>
                <span className="truncate text-xs">{activeContext.text}</span>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">{title}</DropdownMenuLabel>

            {items.map((item) => (
              <DropdownMenuItem
                key={item.name}
                onClick={() => {
                  setActiveContext(item);
                  if (onContextSelected) {
                    onContextSelected(item);
                  }
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {item.logo ? (
                    <item.logo className="size-4 shrink-0" />
                  ) : (
                    <img src={item.logoUrl} alt={item.name} className="size-4 shrink-0 rounded-sm" />
                  )}
                </div>
                {item.name}
              </DropdownMenuItem>
            ))}

            {canAdd && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => {
                    if (onContextAdd) {
                      onContextAdd();
                    }
                  }}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">{newContextText}</div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
