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
  /** Stable, unique selection identity; also displayed as the context name. */
  name: string;
  logo?: React.ElementType;
  logoUrl?: string;
  text: string;
  /** Controls selection when true. The first active item in list order wins. */
  active?: boolean;
  className?: string;
}

/**
 * Displays a workspace, organization, or tenant inside a SidebarProvider.
 * The first item with `active: true` is authoritative on every render;
 * selection callbacks request a change without optimistically changing it.
 * With no active item, selection is local by unique, stable `name`, initially
 * the first item. Removing the selected name selects the first remaining item;
 * an empty list renders nothing and resets selection. Removing all active flags
 * retains the last displayed name if present. Metadata always comes from current
 * items. Mount, refresh, and fallback never emit selection callbacks.
 * This keeps context labels aligned with application state; consumers own data
 * switching, persistence, and authorization.
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
  /** Receives the current item on user selection (including reselecting it).
   * With an active item, update items' active flags to accept the request.
   */
  onContextSelected?: (context: INavContext) => void;
}) {
  const { isMobile } = useSidebar();
  const [selectedName, setSelectedName] = React.useState<string>();
  const controlledContext = items.find((item) => item.active);
  const activeContext = controlledContext ?? items.find((item) => item.name === selectedName) ?? items[0];

  // Remember the displayed identity before children render, without copying
  // metadata or an effect. Removed/cleared names must not reappear as selections.
  if (selectedName !== activeContext?.name) {
    setSelectedName(activeContext?.name);
  }

  if (!activeContext) return null;

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
                  if (!controlledContext) setSelectedName(item.name);
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
