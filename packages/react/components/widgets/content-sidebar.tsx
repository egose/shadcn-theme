import * as React from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '../ui/sidebar';
import { cn } from '../../utils/ui';

export interface ContentSidebarItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  breadcrumbs?: React.ReactNode[];
  content: React.ReactNode;
}

export interface ContentSidebarProps {
  items: readonly ContentSidebarItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  actions?: React.ReactNode;
  classNames?: {
    root?: string;
    nav?: string;
    header?: string;
    content?: string;
  };
}

function ContentSidebarNav({
  items,
  value,
  onValueChange,
  className,
}: {
  items: readonly ContentSidebarItem[];
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Sidebar
      collapsible="none"
      className={cn('flex h-auto w-full border-b md:h-full md:w-auto md:border-r md:border-b-0', className)}
    >
      <SidebarContent className="flex-row md:flex-col">
        <SidebarGroup className="w-full">
          <SidebarGroupContent>
            <SidebarMenu className="flex-row gap-2 p-2 md:flex-col md:gap-0 md:p-0">
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      type="button"
                      isActive={value === item.value}
                      disabled={item.disabled}
                      className={cn('whitespace-nowrap')}
                      onClick={() => {
                        if (!item.disabled) {
                          onValueChange(item.value);
                        }
                      }}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function ContentSidebar({
  items,
  value,
  defaultValue,
  onValueChange,
  actions,
  classNames,
}: ContentSidebarProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? items[0]?.value);

  const isControlled = value !== undefined;
  const currentValue = value ?? internalValue ?? items[0]?.value;

  React.useEffect(() => {
    if (isControlled || items.length === 0) {
      return;
    }

    if (!items.some((item) => item.value === internalValue)) {
      setInternalValue(defaultValue ?? items[0]?.value);
    }
  }, [defaultValue, internalValue, isControlled, items]);

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  const activeItem = items.find((item) => item.value === currentValue) ?? items[0];
  const breadcrumbItems = activeItem?.breadcrumbs?.length ? activeItem.breadcrumbs : [activeItem?.label ?? 'General'];

  return (
    <SidebarProvider className={cn('flex h-full flex-col items-stretch md:flex-row', classNames?.root)}>
      <ContentSidebarNav
        items={items}
        value={currentValue}
        onValueChange={handleValueChange}
        className={classNames?.nav}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
        <header className={cn('flex h-14 shrink-0 items-center justify-between border-b px-4', classNames?.header)}>
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{item}</BreadcrumbPage>
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 ? <BreadcrumbSeparator /> : null}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>

        <div className={cn('flex-1 overflow-y-auto p-6', classNames?.content)}>{activeItem?.content}</div>
      </main>
    </SidebarProvider>
  );
}
