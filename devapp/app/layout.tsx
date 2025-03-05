'use client';

import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
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
import SidebarLayout from '../../package/layouts/sidebar1';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const data = {
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
          isActive: true,
        },
        {
          title: 'GitLab',
          url: '/gitlab',
          icon: CircleDollarSign,
          isActive: true,
        },
      ],
    },
    {
      title: 'Projects',
      items: [
        {
          title: 'Webapp',
          url: '#',
          icon: SquareTerminal,
          isActive: true,
          subItems: [
            {
              title: 'App1',
              url: '/Webapp/app1',
            },
            {
              title: 'App2',
              url: '/Webapp/app2',
            },
            {
              title: 'App3',
              url: '/Webapp/app3',
            },
          ],
        },
      ],
    },
  ],
  userMenus: [
    {
      title: 'Account',
      // url: '/github',
      icon: BadgeCheck,
      onClick: console.log,
    },
    {
      title: 'Billing',
      // url: '/gitlab',
      icon: CreditCard,
      onClick: console.log,
    },
    {
      title: 'Notifications',
      // url: '/gitlab',
      icon: Bell,
      onClick: console.log,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarLayout aslink={Link} data={data} onLogout={console.log}>
          {children}
        </SidebarLayout>
      </body>
    </html>
  );
}
