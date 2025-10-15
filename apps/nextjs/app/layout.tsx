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
import SimpleLayout from '../../../packages/react/layouts/simple';
import { DialogManagerProvider } from '../../../packages/react/components/widgets/dialog-manager';
import { TooltipProvider } from '../../../packages/react/components/ui/tooltip';
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
  const leftMenus = [
    { label: 'Button', link: '/components/button', className: 'font-bold', title: true },
    { label: 'Badge', link: '/components/badge', className: 'font-bold' },
    { label: 'Alert', link: '/components/alert', className: 'font-bold' },
    { label: 'Accordion', link: '/components/accordion', className: 'font-bold' },
    { label: 'Spinner', link: '/components/spinner', className: 'font-bold' },
    { label: 'Form Field', link: '/components/form-field', className: 'font-bold' },
  ];

  const rightMenus = [{ label: 'Sign Out', action: () => alert('Signed out'), className: 'bg-yellow-200' }];

  const userMenus = [
    {
      label: 'My Account',
      items: [
        { label: 'Profile', icon: <GalleryVerticalEnd />, link: '/profile' },
        { label: 'Billing', icon: <GalleryVerticalEnd />, action: () => alert('Billing') },
        { label: 'Settings', icon: <GalleryVerticalEnd />, className: 'text-blue-500' },
        { label: 'Keyboard shortcuts', icon: <GalleryVerticalEnd /> },
      ],
      separator: true,
    },
    {
      label: 'Team',
      items: [
        { label: 'Team', icon: <GalleryVerticalEnd />, link: '/team' },
        { label: 'New Team', icon: <GalleryVerticalEnd /> },
      ],
      separator: true,
    },
    {
      label: 'Links',
      items: [
        { label: 'GitHub', icon: <GalleryVerticalEnd />, link: '/github' },
        { label: 'Support', icon: <GalleryVerticalEnd />, action: () => alert('Support') },
      ],
      separator: true,
    },
    {
      items: [{ label: 'Log out', icon: <GalleryVerticalEnd />, action: () => alert('Log out') }],
    },
  ];

  const footerMenus = [
    { label: 'Privacy Policy', link: '/privacy' },
    { label: 'Terms of Service', link: '/terms' },
    { label: 'Contact', action: () => {} },
  ];

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SimpleLayout
          aslink={Link}
          logo={{ src: 'favicon.ico' }}
          left={{ menus: leftMenus }}
          right={{ menus: rightMenus }}
          user={{ menuSections: userMenus, trigger: <span>James Web</span> }}
          footer={{ content: 'Sample App', menus: footerMenus }}
        >
          <TooltipProvider>
            <DialogManagerProvider>{children}</DialogManagerProvider>
          </TooltipProvider>
        </SimpleLayout>
        <Toaster theme="light" position="top-right" closeButton richColors />
      </body>
    </html>
  );
}
