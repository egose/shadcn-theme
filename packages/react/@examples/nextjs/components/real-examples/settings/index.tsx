'use client';

import { useRef, useState } from 'react';
import { Bell, CreditCard, TriangleAlert, User, Users } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Skeleton } from '@egose/shadcn-theme/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@egose/shadcn-theme/components/ui/toggle-group';
import { ContentSidebar, type ContentSidebarItem } from '@egose/shadcn-theme/components/widgets/content-sidebar';

import { ExamplePage } from '@/components/showcase-shell';
import { ExampleStateToolbar, type ExampleState } from '../_shared/example-state-toolbar';
import type { SimulatedOutcome } from '../_shared/async-simulation';
import { OutcomePicker } from '../_shared/outcome-picker';

import { BillingSection } from './components/billing-section';
import { DangerZoneSection } from './components/danger-zone-section';
import { NotificationsSection } from './components/notifications-section';
import { ProfileSection } from './components/profile-section';
import { WorkspaceSection } from './components/workspace-section';
import type { ClipboardBehavior } from './types';
import { useSettingsSession } from './use-settings-session';

export default function SettingsExample() {
  const [viewState, setViewState] = useState<ExampleState>('loaded');
  // Catalog tooling: which deterministic outcome simulated saves return.
  const [saveOutcome, setSaveOutcome] = useState<SimulatedOutcome>('success');
  // Catalog tooling: force the workspace-ID copy to fail deterministically.
  const [clipboardBehavior, setClipboardBehavior] = useState<ClipboardBehavior>('real');
  const session = useSettingsSession(saveOutcome, clipboardBehavior);
  const settingsHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const items: readonly ContentSidebarItem[] = [
    {
      value: 'profile',
      label: 'Profile',
      icon: User,
      breadcrumbs: ['Settings', 'Profile'],
      content: (
        <ProfileSection
          state={session.profile}
          avatarFileName={session.avatarFileName}
          onAvatarChange={session.setAvatarFileName}
        />
      ),
    },
    {
      value: 'workspace',
      label: 'Workspace',
      icon: Users,
      breadcrumbs: ['Settings', 'Workspace'],
      content: <WorkspaceSection state={session.workspace} clipboard={session.clipboard} />,
    },
    {
      // Deliberately long label: the sidebar keeps labels on one line
      // (`whitespace-nowrap`) and the nav scrolls horizontally when narrow.
      value: 'notifications',
      label: 'Notifications and digest preferences',
      icon: Bell,
      breadcrumbs: ['Settings', 'Notifications'],
      content: <NotificationsSection state={session.notifications} />,
    },
    {
      value: 'billing',
      label: 'Billing',
      icon: CreditCard,
      breadcrumbs: ['Settings', 'Billing'],
      content: <BillingSection state={session.billing} />,
    },
    {
      value: 'danger',
      label: 'Danger zone',
      icon: TriangleAlert,
      breadcrumbs: ['Settings', 'Danger zone'],
      content: (
        <DangerZoneSection state={session.deletion} onFocusFallback={() => settingsHeadingRef.current?.focus()} />
      ),
    },
  ];

  return (
    <ExamplePage
      title="Account and Workspace Settings"
      description="The product area below is the example: a ContentSidebar-driven settings area with deterministic save states, permission and plan gating, clipboard feedback, and a destructive action. The surrounding catalog chrome is not part of it."
    >
      <ExampleStateToolbar value={viewState} onValueChange={setViewState} states={['loading', 'error', 'loaded']} />
      {/* Catalog tooling: deterministic outcomes, clearly labeled as preview controls. */}

      <div
        role="group"
        aria-label="Simulated settings outcomes (catalog tooling, not part of the product surface)"
        className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-dashed p-2 text-sm"
      >
        <OutcomePicker
          label="Simulated save outcome"
          operation="save"
          value={saveOutcome}
          onValueChange={setSaveOutcome}
        />

        <span className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Clipboard behavior:</span>

          <ToggleGroup
            type="single"
            value={clipboardBehavior}
            onValueChange={(value) => value && setClipboardBehavior(value as ClipboardBehavior)}
          >
            <ToggleGroupItem value="real" aria-label="Use the real clipboard">
              Real clipboard
            </ToggleGroupItem>

            <ToggleGroupItem value="force-failure" aria-label="Force clipboard failure">
              Force failure
            </ToggleGroupItem>
          </ToggleGroup>
        </span>
      </div>

      <h2 ref={settingsHeadingRef} tabIndex={-1} className="text-lg font-medium">
        Workspace settings
      </h2>

      {viewState === 'loading' && (
        <div className="space-y-3" role="status" aria-label="Loading settings">
          <Skeleton className="h-8 w-2/3" />

          <Skeleton className="h-24 w-full" />

          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {viewState === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Settings could not be loaded</AlertTitle>

          <AlertDescription>
            <p>Something went wrong while loading the workspace settings. Retry to load them again.</p>

            <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => setViewState('loaded')}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {viewState === 'loaded' && (
        <ContentSidebar
          value={session.section}
          onValueChange={session.setSection}
          items={items}
          classNames={{
            // Narrow widths: the package keeps nav labels on one line
            // (`whitespace-nowrap`), so we deliberately allow the horizontal
            // strip to scroll instead of clipping long labels.
            nav: 'max-w-full overflow-x-auto',
            content: 'p-4 md:p-6',
          }}
        />
      )}
    </ExamplePage>
  );
}
