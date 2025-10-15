import React from 'react';
import { UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { cn } from '../../lib/utils';
import type { MenuItem, UserMenuSection } from './types';

export function UserMenus({
  sections,
  trigger,
  aslink,
}: {
  sections: UserMenuSection[];
  trigger?: React.ReactNode;
  aslink: React.ElementType;
}) {
  const LinkComponent = aslink ?? 'button';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <button className="flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full cursor-pointer">
            <UserCircle />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {sections.map((section, index) => {
          return (
            <div key={section.label ?? index}>
              {section.label && <DropdownMenuLabel>{section.label}</DropdownMenuLabel>}
              {section.items && section.items.length > 0 && (
                <DropdownMenuGroup>
                  {section.items.map((item) => {
                    return (
                      <DropdownMenuItem key={item.label}>
                        {item.link ? (
                          <LinkComponent
                            to={item.link ?? '/'}
                            href={item.link ?? '/'}
                            className={cn('w-full text-left cursor-pointer', item.className)}
                          >
                            {item.label}
                          </LinkComponent>
                        ) : (
                          <button
                            onClick={item.action}
                            className={cn('w-full text-left cursor-pointer', item.className)}
                          >
                            {item.label}
                          </button>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
              )}
              {section.separator && <DropdownMenuSeparator />}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
