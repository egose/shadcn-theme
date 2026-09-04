import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@egose/shadcn-theme/components/ui/tooltip';
import { DialogManagerProvider } from '@egose/shadcn-theme/components/widgets/dialog-manager';
import { Toaster } from '@egose/shadcn-theme/components/ui/sonner';
import { SiteNav } from '../components/site-nav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Egose Shadcn Theme Examples',
  description: 'Copyable examples and product flows built with the @egose/shadcn-theme components.',
  manifest: '/manifest.json',
};

// Intentionally no maximumScale / userScalable: pinch and browser zoom stay
// enabled per WCAG 1.4.4 (resize text up to 200%).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TooltipProvider>
          <SiteNav>
            <DialogManagerProvider>{children}</DialogManagerProvider>
          </SiteNav>
        </TooltipProvider>
        {/* The app follows the system color scheme (SidebarLayout's next-themes
            provider defaults to "system"), so the toaster does too. There is no
            manual theme toggle in this example. */}
        <Toaster theme="system" position="top-right" closeButton richColors />
      </body>
    </html>
  );
}
