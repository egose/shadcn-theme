import * as React from 'react';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@egose/shadcn-theme/components/ui/dialog';
import { useDialog, createTypedDialog } from '@egose/shadcn-theme/components/widgets/dialog-manager';
import type { DialogProps } from '@egose/shadcn-theme/components/widgets/dialog-manager';
import { FormTextInput } from '@egose/shadcn-theme/components/form/text-input';
import { TeamSizeDialogTyped } from './team-size-dialog';

function ConfirmContactDialog({ open, args, onClose }: DialogProps<{ name: string }, { confirmed: boolean }>) {
  const { openDialog } = useDialog();
  const [teamSize, setTeamSize] = React.useState<number | null>(null);

  return (
    <Dialog open={open} onOpenChange={() => onClose({ confirmed: false })}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm contact</DialogTitle>
          <DialogDescription>
            Confirm the delivery address for {args.name}. You can also adjust the team size in a nested dialog before
            confirming.
          </DialogDescription>
        </DialogHeader>
        <FormTextInput
          name="address"
          label={`Delivery address for ${args.name}`}
          placeholder="Enter address..."
          classNames={{ wrapper: 'block' }}
        />
        {teamSize !== null ? (
          <p role="status" className="text-sm text-muted-foreground">
            Team size updated to {teamSize}.
          </p>
        ) : null}
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              const size = await openDialog(TeamSizeDialogTyped, { size: teamSize ?? 4 });
              setTeamSize(size);
            }}
          >
            Adjust team size
          </Button>
          <Button type="button" variant="success" onClick={() => onClose({ confirmed: true })}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ConfirmContactDialogTyped = createTypedDialog(ConfirmContactDialog);
