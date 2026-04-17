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
import SidebarLayout, { ISidebarData } from '../../../layouts/sidebar1';
import { TooltipProvider } from '../../../components/ui/tooltip';
import { DialogManagerProvider } from '../../../components/widgets/dialog-manager';
import { Toaster } from '../../../components/ui/sonner';
import { useEffect, useState } from 'react';
import { componentExamples, formExamples, widgetExamples } from '../lib/example-registry';

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

function toSubItems(examples: Array<{ title: string; url: string }>) {
  return examples.map((example) => ({
    title: example.title,
    url: example.url,
  }));
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
      avatar: 'https://avatars.githubusercontent.com/u/36021827?v=4&size=64',
    },
    context: {
      title: 'Projects',
      canAdd: false,
      items: [
        {
          name: 'Egose Inc',
          text: `Enterprise - ${count}`,
          // logo: GalleryVerticalEnd,
          logoUrl: 'https://avatars.githubusercontent.com/u/36021827?v=4&size=64',
          className: 'bg-purple-500 text-white',
        },
      ],
    },
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
        hideTitle: true,
        items: [
          {
            title: 'Components',
            url: '/components',
            icon: Component,
            isActive: false,
            subItems: toSubItems(componentExamples),
          },
          {
            title: 'Form',
            url: '/form',
            icon: Component,
            isActive: false,
            subItems: toSubItems(formExamples),
          },
          {
            title: 'Widgets',
            url: '/widgets',
            icon: Component,
            isActive: false,
            subItems: toSubItems(widgetExamples),
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
      newContext: () => {
        console.log('New context clicked');
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
        <TooltipProvider>
          <SidebarLayout aslink={Link} data={data}>
            <DialogManagerProvider>{children}</DialogManagerProvider>
          </SidebarLayout>
        </TooltipProvider>
        <Toaster theme="light" position="top-right" closeButton richColors />
      </body>
    </html>
  );
}
