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
import SidebarLayout, { ISidebarData } from '../../../packages/react/layouts/sidebar1';
import { DialogManagerProvider } from '../../../packages/react/components/widgets/dialog-manager';
import { Toaster } from '../../../packages/react/components/ui/sonner';
import { useEffect, useState } from 'react';

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
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCount((prev) => prev + 1);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const data: ISidebarData = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    contexts: [
      {
        name: 'Egose Inc',
        text: `Enterprise - ${count}`,
        logo: GalleryVerticalEnd,
        className: 'bg-purple-500 text-white',
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
                title: 'Badge',
                url: '/components/badge',
              },
              {
                title: 'Alert',
                url: '/components/alert',
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
              {
                title: 'Date Picker',
                url: '/form/date-picker',
              },
              {
                title: 'Native Select',
                url: '/form/native-select',
              },
              {
                title: 'Select',
                url: '/form/select',
              },
              {
                title: 'Searchable Select',
                url: '/form/searchable-select',
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
    events: {
      login: () => {
        console.log('Sign in clicked');
      },
    },
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

  console.log(count);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarLayout aslink={Link} data={data}>
          <DialogManagerProvider>{children}</DialogManagerProvider>
        </SidebarLayout>
        <Toaster theme="light" position="top-right" closeButton richColors />
      </body>
    </html>
  );
}
