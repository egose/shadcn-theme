'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '../../../../../components/ui/button';
import { TextInputDialog } from '../../../../../components/widgets/text-input-dialog';
import { useDialog } from '../../../../../components/widgets/dialog-manager';
import { ExampleInline, ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';

export default function Page() {
  const { openDialog } = useDialog();
  const [lastValue, setLastValue] = React.useState<string | null>(null);

  async function handleOpen(title: string, label: string) {
    const result = await openDialog(TextInputDialog, {
      title,
      description: 'Provide a short, unique name. You can rename it later from settings.',
      label,
      placeholder: `Enter ${label.toLowerCase()}`,
      defaultValue: '',
      confirmText: 'Create',
      cancelText: 'Cancel',
      minLength: 2,
      maxLength: 40,
    });

    if (result.cancelled) {
      toast.info('Cancelled');
      return;
    }

    setLastValue(result.value ?? '');
    toast.success(`Created "${result.value ?? ''}"`);
  }

  return (
    <ExamplePage
      title="Text Input Dialog"
      description="Promise-based text input dialog with built-in length validation through react-hook-form."
    >
      <ExampleSection
        title="Collect a single value"
        description="Await the result and inspect `cancelled` to decide whether to commit the change."
      >
        <ExampleInline>
          <Button onClick={() => handleOpen('New workspace', 'Workspace name')}>New workspace</Button>
          <Button variant="secondary" onClick={() => handleOpen('Rename dashboard', 'Dashboard title')}>
            Rename dashboard
          </Button>
          <Button variant="ghost" onClick={() => handleOpen('Add label', 'Label name')}>
            Add label
          </Button>
        </ExampleInline>
        <ExampleStack className="pt-4">
          {lastValue !== null && (
            <p className="text-sm text-muted-foreground">
              Last submitted value: <span className="font-medium">{lastValue}</span>
            </p>
          )}
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
