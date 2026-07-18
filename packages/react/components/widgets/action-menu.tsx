import * as React from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { cn } from '../../utils/ui';
import { MoreHorizontalIcon } from 'lucide-react';

export interface ActionMenuItem {
  label: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
}

export interface ActionMenuProps {
  items: readonly ActionMenuItem[];
  trigger?: React.ReactElement;
  align?: 'start' | 'center' | 'end';
  classNames?: {
    trigger?: string;
    content?: string;
  };
}

function DefaultTrigger({ className }: { className?: string }) {
  return (
    <Button variant="secondary" appearance="outline-filled" size="icon-sm" className={className}>
      <MoreHorizontalIcon />
      <span className="sr-only">Open menu</span>
    </Button>
  );
}

export function ActionMenu({ items, trigger, align = 'end', classNames }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger ?? <DefaultTrigger className={classNames?.trigger} />}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn('w-32', classNames?.content)}>
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            disabled={item.disabled}
            variant={item.variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => item.onSelect?.()}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
