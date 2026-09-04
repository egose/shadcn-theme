'use client';

import { toast } from 'sonner';

import { ExampleInline, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Button } from '@egose/shadcn-theme/components/ui/button';

export default function SonnerShowcase() {
  return (
    <ExamplePage
      title="Sonner"
      description="The example app already mounts the shared toaster, so this page focuses on triggering common toast variants."
    >
      <ExampleSection title="Toast variants">
        <ExampleInline>
          <Button
            onClick={() => toast.success('Workspace synced', { description: 'All invoices are now up to date.' })}
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.info('Heads up', { description: 'Your export will be ready in a few seconds.' })}
          >
            Info
          </Button>
          <Button
            variant="warning"
            onClick={() => toast.warning('Action required', { description: 'A payment method expires this week.' })}
          >
            Warning
          </Button>
          <Button
            variant="danger"
            onClick={() => toast.error('Sync failed', { description: 'We could not connect to the billing provider.' })}
          >
            Error
          </Button>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}
