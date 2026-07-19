'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '../../../../../components/ui/button';
import { ConfirmationDialog } from '../../../../../components/widgets/confirmation-dialog';
import { useDialog } from '../../../../../components/widgets/dialog-manager';
import { ExampleInline, ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';

export default function Page() {
  const { openDialog } = useDialog();
  const [lastResult, setLastResult] = React.useState<boolean | null>(null);

  async function handleConfirm(variant: React.ComponentProps<typeof Button>['variant']) {
    const { confirmed } = await openDialog(ConfirmationDialog, {
      title: 'Delete workspace?',
      description: 'This will permanently remove the workspace and all of its members. This cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      confirmVariant: (variant as 'danger' | 'warning') ?? 'danger',
    });
    setLastResult(confirmed);
    if (confirmed) {
      toast.error('Workspace deleted');
    } else {
      toast.info('Cancelled');
    }
  }

  return (
    <ExamplePage
      title="Confirmation Dialog"
      description="Promise-based confirmation dialog wired through the shared dialog manager context."
    >
      <ExampleSection
        title="Destructive confirmation"
        description="Await the result and branch on `confirmed` to commit the action."
      >
        <ExampleInline>
          <Button variant="danger" onClick={() => handleConfirm('danger')}>
            Delete workspace
          </Button>
          <Button variant="warning" onClick={() => handleConfirm('warning')}>
            Request archive
          </Button>
        </ExampleInline>
        <ExampleStack className="pt-4">
          {lastResult !== null && (
            <p className="text-sm text-muted-foreground">
              Last result: <span className="font-medium">{lastResult ? 'confirmed' : 'cancelled'}</span>
            </p>
          )}
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
