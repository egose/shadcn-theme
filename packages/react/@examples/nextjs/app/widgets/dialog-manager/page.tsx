'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { useDialog } from '@egose/shadcn-theme/components/widgets/dialog-manager';
import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { ConfirmContactDialogTyped } from './confirm-contact-dialog';

export default function Page() {
  const { openDialog } = useDialog();
  const [outcome, setOutcome] = React.useState<string | null>(null);

  return (
    <ExamplePage
      title="Dialog Manager"
      description="Programmatic dialogs opened through a shared manager context, resolving with a typed result. Nested dialogs are supported."
    >
      <ExampleSection
        title="Confirm contact"
        description="Opens a confirmation dialog; an inline control opens a nested team-size dialog. Results surface as visible status text and a toast."
      >
        <ExampleStack>
          <div>
            <Button
              variant="primary"
              onClick={async () => {
                const { confirmed } = await openDialog(ConfirmContactDialogTyped, { name: 'James' });
                const message = confirmed ? 'Contact confirmed' : 'Contact confirmation cancelled';
                setOutcome(message);
                if (confirmed) {
                  toast.success(message);
                } else {
                  toast.info(message);
                }
              }}
            >
              Open confirm contact dialog
            </Button>
          </div>
          {outcome ? (
            <p role="status" className="text-sm text-muted-foreground">
              {outcome}
            </p>
          ) : null}
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
