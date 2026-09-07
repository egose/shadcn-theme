'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BadgeCheck, Bell, CreditCard, LayoutPanelLeft, FolderKanban, TextCursorInput, Component } from 'lucide-react';
import SidebarLayout, { ISidebarData } from '@egose/shadcn-theme/layouts/sidebar1';
import { componentsSection, formSection, realExamplesSection, widgetsSection } from '../lib/sections';

function isPathMatch(pathname: string, url: string) {
  if (!url) return false;
  if (pathname === url) return true;
  return pathname.startsWith(url + '/');
}

/** Returns a new sidebar data object with active flags applied; never mutates
 * the module-scope {@link SIDEBAR_DATA} shared across renders. */
export function withActiveNav(data: ISidebarData, pathname: string): ISidebarData {
  return {
    ...data,
    menus: data.menus.map((menu) => ({
      ...menu,
      items: menu.items.map((item) => {
        if (item.subItems) {
          const subItems = item.subItems.map((subItem) => ({
            ...subItem,
            isActive: isPathMatch(pathname, subItem.url ?? ''),
          }));
          return { ...item, isActive: subItems.some((subItem) => subItem.isActive), subItems };
        }
        return { ...item, isActive: isPathMatch(pathname, item.url ?? '') };
      }),
    })),
  };
}

export const SIDEBAR_DATA: ISidebarData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/36021827?v=4&size=64',
  },
  context: {
    title: 'Projects',
    canAdd: false,
    items: [
      {
        name: 'Egose Inc',
        text: 'Enterprise',
        logoUrl: 'https://avatars.githubusercontent.com/u/36021827?v=4&size=64',
        className: 'bg-purple-500 text-white',
      },
    ],
  },
  menus: [
    {
      title: 'Theme',
      hideTitle: true,
      items: [
        {
          title: 'Components',
          url: '/components',
          icon: Component,
          isActive: false,
          subItems: componentsSection.entries.map((entry) => ({ title: entry.title, url: entry.url })),
        },
        {
          title: 'Form',
          url: '/form',
          icon: TextCursorInput,
          isActive: false,
          subItems: formSection.entries.map((entry) => ({ title: entry.title, url: entry.url })),
        },
        {
          title: 'Widgets',
          url: '/widgets',
          icon: LayoutPanelLeft,
          isActive: false,
          subItems: widgetsSection.entries.map((entry) => ({ title: entry.title, url: entry.url })),
        },
        {
          title: 'Real Examples',
          url: '/real-examples',
          icon: FolderKanban,
          isActive: false,
          subItems: realExamplesSection.entries.map((entry) => ({ title: entry.title, url: entry.url })),
        },
      ],
    },
  ],
  userMenus: [
    { title: 'Account', icon: BadgeCheck, onClick: console.log },
    { title: 'Billing', icon: CreditCard, onClick: console.log },
    { title: 'Notifications', icon: Bell, onClick: console.log },
  ],
  events: {
    login: () => {
      console.log('Sign in clicked');
    },
    newContext: () => {
      console.log('New context clicked');
    },
  },
};

/**
 * Client boundary that derives the active sidebar trail from the current
 * pathname and renders the catalog `SidebarLayout`. Kept deliberately small so
 * the root layout can stay a Server Component.
 */
export function SiteNav({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const data = withActiveNav(SIDEBAR_DATA, pathname ?? '');
  return (
    <SidebarLayout aslink={Link} data={data}>
      {children}
    </SidebarLayout>
  );
}
