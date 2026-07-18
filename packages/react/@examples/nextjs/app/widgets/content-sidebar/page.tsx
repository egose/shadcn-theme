'use client';

import * as React from 'react';
import { BellIcon, MoonIcon, PaletteIcon, UserIcon } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Switch } from '../../../../../components/ui/switch';
import { Label } from '../../../../../components/ui/label';
import { ContentSidebar } from '../../../../../components/widgets/content-sidebar';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  return (
    <ExamplePage
      title="Content Sidebar"
      description="ContentSidebar pairs a settings-style sidebar with content panels, breadcrumbs, and optional actions."
    >
      <ExampleSection
        title="Settings surface"
        description="Each item maps to its own content and breadcrumbs; the active section drives the main panel."
      >
        <div className="h-[420px] overflow-hidden rounded-xl border">
          <ContentSidebar
            defaultValue="profile"
            actions={<Button variant="secondary">Save changes</Button>}
            items={[
              {
                value: 'profile',
                label: 'Profile',
                icon: UserIcon,
                breadcrumbs: ['Settings', 'Profile'],
                content: (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Profile preferences</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage how your identity appears across the workspace and on shared surfaces.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Display name</Label>
                      <input
                        id="display-name"
                        defaultValue="Ava Stone"
                        className="h-9 w-full max-w-sm rounded-md border bg-background px-3 text-sm"
                      />
                    </div>
                  </div>
                ),
              },
              {
                value: 'appearance',
                label: 'Appearance',
                icon: PaletteIcon,
                breadcrumbs: ['Settings', 'Appearance'],
                content: (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Appearance</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjust visual density and contrast for accessibility.
                    </p>
                    <div className="flex items-center gap-3">
                      <Switch id="density" defaultChecked />
                      <Label htmlFor="density">Compact density</Label>
                    </div>
                  </div>
                ),
              },
              {
                value: 'notifications',
                label: 'Notifications',
                icon: BellIcon,
                breadcrumbs: ['Settings', 'Notifications'],
                content: (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <div className="flex items-center gap-3">
                      <Switch id="notif-email" defaultChecked />
                      <Label htmlFor="notif-email">Email summaries</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch id="notif-push" />
                      <Label htmlFor="notif-push">Mobile push</Label>
                    </div>
                  </div>
                ),
              },
              {
                value: 'schedule',
                label: 'Schedule',
                icon: MoonIcon,
                disabled: true,
                breadcrumbs: ['Settings', 'Schedule'],
                content: (
                  <p className="text-sm text-muted-foreground">Scheduling features unlock on the Growth plan.</p>
                ),
              },
            ]}
          />
        </div>
      </ExampleSection>
    </ExamplePage>
  );
}
