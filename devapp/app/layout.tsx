'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  Component,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  CircleDollarSign,
  BadgeCheck,
  Bell,
  CreditCard,
} from 'lucide-react';
import './globals.css';
import SidebarLayout, { ISidebarData } from '../../package/layouts/sidebar1';
import { DialogManagerProvider } from '../../package/components/widgets/dialog-manager';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

function isPathMatch(pathname: string, url: string) {
  if (!url) return false;

  if (pathname === url) return true;
  return pathname.startsWith(url + '/');
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const data: ISidebarData = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    contexts: [
      {
        name: 'Egose Inc',
        text: 'Enterprise',
        logo: GalleryVerticalEnd,
      },
    ],
    menus: [
      {
        title: 'Platform',
        items: [
          {
            title: 'GitHub',
            url: '/github',
            icon: SquareTerminal,
            isActive: false,
          },
          {
            title: 'GitLab',
            url: '/gitlab',
            icon: CircleDollarSign,
            isActive: false,
          },
        ],
      },
      {
        title: 'Theme',
        items: [
          {
            title: 'Components',
            url: '/components',
            icon: Component,
            isActive: false,
            subItems: [
              {
                title: 'Button',
                url: '/components/button',
              },
              {
                title: 'Dialog',
                url: '/components/dialog',
              },
            ],
          },
          {
            title: 'Form',
            url: '/form',
            icon: Component,
            isActive: false,
            subItems: [
              {
                title: 'Text Input',
                url: '/form/textinput',
              },
              {
                title: 'Textarea',
                url: '/form/textarea',
              },
            ],
          },
          {
            title: 'Widgets',
            url: '/widgets',
            icon: Component,
            isActive: false,
            subItems: [
              {
                title: 'Dialog Manager',
                url: '/widgets/dialog-manager',
              },
            ],
          },
        ],
      },
    ],
    userMenus: [
      {
        title: 'Account',
        icon: BadgeCheck,
        onClick: console.log,
      },
      {
        title: 'Billing',
        icon: CreditCard,
        onClick: console.log,
      },
      {
        title: 'Notifications',
        icon: Bell,
        onClick: console.log,
      },
    ],
  };

  data.menus.forEach((menu) => {
    menu.items.forEach((item) => {
      if (item.subItems) {
        item.subItems.forEach((subItem) => {
          subItem.isActive = isPathMatch(pathname, subItem.url ?? '');
          if (subItem.isActive) item.isActive = true;
        });
      } else {
        item.isActive = isPathMatch(pathname, item.url ?? '');
      }
    });
  });

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarLayout aslink={Link} data={data} onLogout={console.log}>
          <DialogManagerProvider>{children}</DialogManagerProvider>
        </SidebarLayout>
      </body>
    </html>
  );
}
