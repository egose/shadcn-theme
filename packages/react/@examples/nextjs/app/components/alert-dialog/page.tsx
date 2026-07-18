'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../../../components/ui/alert-dialog';
import { Button } from '../../../../../components/ui/button';
import { ExampleInline, ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  return (
    <ExamplePage
      title="Alert Dialog"
      description="Alert dialogs confirm destructive or blocking actions before committing them."
    >
      <ExampleSection
        title="Destructive confirmation"
        description="Pair a primary destructive action with a low-emphasis cancel so users can back out."
      >
        <ExampleInline>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="primary">Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel size="sm" variant="secondary">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction size="sm" variant="primary">
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}
