'use client';

import * as React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@egose/shadcn-theme/components/ui/navigation-menu';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/components/alert-dialog',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/components/hover-card',
    description: 'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/components/progress',
    description: 'Displays an indicator showing the completion progress of a task.',
  },
  {
    title: 'Scroll Area',
    href: '/components/scroll-area',
    description: 'Augments native scroll functionality with custom, cross-browser styling.',
  },
  {
    title: 'Tabs',
    href: '/components/tabs',
    description: 'A set of layered sections of content — known as tab panels — displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/components/tooltip',
    description: 'A popup that displays information when an element receives keyboard focus or hover.',
  },
];

export default function Page() {
  return (
    <ExamplePage title="Navigation Menu" description="A horizontal menu of links with expandable content panels.">
      <ExampleSection
        title="Menu with Panels"
        description="Catalog links use local routes; the Docs link points to the external shadcn/ui documentation."
      >
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-96">
                  <ListItem href="/" title="Catalog home">
                    Browse every example in the catalog.
                  </ListItem>
                  <ListItem href="/components" title="Components">
                    Primitive components with copyable demos.
                  </ListItem>
                  <ListItem href="/widgets" title="Widgets">
                    Composed building blocks such as dialogs and action menus.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:flex">
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem key={component.title} title={component.title} href={component.href}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="https://ui.shadcn.com/docs" target="_blank" rel="noreferrer">
                  <span className="inline-flex items-center gap-1">
                    Docs <ExternalLink className="size-3" aria-hidden />
                    <span className="sr-only">(opens the external shadcn/ui documentation in a new tab)</span>
                  </span>
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </ExampleSection>
    </ExamplePage>
  );
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
