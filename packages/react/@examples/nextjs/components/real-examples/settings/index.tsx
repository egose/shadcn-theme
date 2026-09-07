'use client';

import { useState } from 'react';
import { Bell, CreditCard, TriangleAlert, User, Users } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Skeleton } from '@egose/shadcn-theme/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@egose/shadcn-theme/components/ui/toggle-group';
import { ContentSidebar, type ContentSidebarItem } from '@egose/shadcn-theme/components/widgets/content-sidebar';

import { ExamplePage } from '@/components/showcase-shell';
import { ExampleStateToolbar, type ExampleState } from '../_shared/example-state-toolbar';

import { BillingSection } from './components/billing-section';
import { DangerZoneSection } from './components/danger-zone-section';
import { NotificationsSection } from './components/notifications-section';
import { ProfileSection } from './components/profile-section';
import { WorkspaceSection } from './components/workspace-section';
import type { ClipboardBehavior, SimulatedOutcomeChoice } from './types';

export default function SettingsExample() {
  const [viewState, setViewState] = useState<ExampleState>('loaded');
  // Catalog tooling: which deterministic outcome simulated saves return.
  const [saveOutcome, setSaveOutcome] = useState<SimulatedOutcomeChoice>('success');
  // Catalog tooling: force the workspace-ID copy to fail deterministically.
  const [clipboardBehavior, setClipboardBehavior] = useState<ClipboardBehavior>('real');

  const items: readonly ContentSidebarItem[] = [
    {
      value: 'profile',
      label: 'Profile',
      icon: User,
      breadcrumbs: ['Settings', 'Profile'],
      content: <ProfileSection saveOutcome={saveOutcome} />,
    },
    {
      value: 'workspace',
      label: 'Workspace',
      icon: Users,
      breadcrumbs: ['Settings', 'Workspace'],
      content: <WorkspaceSection saveOutcome={saveOutcome} clipboardBehavior={clipboardBehavior} />,
    },
    {
      // Deliberately long label: the sidebar keeps labels on one line
      // (`whitespace-nowrap`) and the nav scrolls horizontally when narrow.
      value: 'notifications',
      label: 'Notifications and digest preferences',
      icon: Bell,
      breadcrumbs: ['Settings', 'Notifications'],
      content: <NotificationsSection saveOutcome={saveOutcome} />,
    },
    {
      value: 'billing',
      label: 'Billing',
      icon: CreditCard,
      breadcrumbs: ['Settings', 'Billing'],
      content: <BillingSection saveOutcome={saveOutcome} />,
    },
    {
      value: 'danger',
      label: 'Danger zone',
      icon: TriangleAlert,
      breadcrumbs: ['Settings', 'Danger zone'],
      content: <DangerZoneSection saveOutcome={saveOutcome} />,
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
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Simulated save outcome:</span>
          <ToggleGroup
            type="single"
            value={saveOutcome}
            onValueChange={(value) => value && setSaveOutcome(value as SimulatedOutcomeChoice)}
          >
            <ToggleGroupItem value="success" aria-label="Simulate save success">
              Success
            </ToggleGroupItem>
            <ToggleGroupItem value="failure" aria-label="Simulate save failure">
              Failure
            </ToggleGroupItem>
          </ToggleGroup>
        </span>
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
          defaultValue="profile"
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
