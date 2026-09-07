import Image from 'next/image';
import { Bell } from 'lucide-react';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Badge } from '@egose/shadcn-theme/components/ui/badge';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@egose/shadcn-theme/components/ui/item';

import { teammates } from '../fixtures';

export default function ItemShowcase() {
  return (
    <ExamplePage title="Item" description="Items are flexible row primitives for feeds, lists, and settings summaries.">
      <ExampleSection title="List rows">
        <ItemGroup>
          {teammates.map((person) => (
            <Item key={person.name} variant="outline">
              <ItemMedia variant="image">
                {/* Static export serves images unoptimized; see next.config.ts. */}
                <Image
                  src={person.src}
                  alt={person.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </ItemMedia>
              <ItemContent>
                <ItemHeader>
                  <ItemTitle>{person.name}</ItemTitle>
                  <Badge variant="secondary">{person.role}</Badge>
                </ItemHeader>
                <ItemDescription>{person.name} owns the weekly planning ritual and release notes.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="secondary" size="sm">
                  Message
                </Button>
              </ItemActions>
            </Item>
          ))}
          <ItemSeparator />
          <Item variant="muted" size="xs">
            <ItemMedia variant="icon">
              <Bell className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Notifications are enabled</ItemTitle>
              <ItemDescription>Delivery summaries will arrive every Monday morning.</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </ExampleSection>
    </ExamplePage>
  );
}
