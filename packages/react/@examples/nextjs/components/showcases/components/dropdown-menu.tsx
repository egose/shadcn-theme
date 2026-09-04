'use client';

import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@egose/shadcn-theme/components/ui/dropdown-menu';

export default function DropdownMenuShowcase() {
  const [showUnreadOnly, setShowUnreadOnly] = React.useState(true);
  const [showArchived, setShowArchived] = React.useState(false);
  const [density, setDensity] = React.useState('comfortable');

  return (
    <ExamplePage title="Dropdown Menu" description="Dropdown menus group contextual actions behind a compact trigger.">
      <ExampleSection title="Contextual actions">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" appearance="outline">
              View options
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Inbox</DropdownMenuLabel>
            <DropdownMenuItem>
              New view
              <DropdownMenuShortcut>V</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Share
              <DropdownMenuShortcut>S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showUnreadOnly}
              onCheckedChange={(checked) => setShowUnreadOnly(Boolean(checked))}
            >
              Unread only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showArchived}
              onCheckedChange={(checked) => setShowArchived(Boolean(checked))}
            >
              Include archived
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Density</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
                  <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="spacious">Spacious</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </ExampleSection>
    </ExamplePage>
  );
}
