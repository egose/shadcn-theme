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
import { createTypedDialog } from '@egose/shadcn-theme/components/widgets/dialog-manager';
import type { DialogProps } from '@egose/shadcn-theme/components/widgets/dialog-manager';
import type { DateRange } from 'react-day-picker';
import { FormDateRangePicker } from '@egose/shadcn-theme/components/form/date-range-picker';

function TeamSizeDialog({ open, args, onClose }: DialogProps<{ size: number }, number>) {
  const [visitWindow, setVisitWindow] = React.useState<DateRange | undefined>(undefined);

  return (
    <Dialog open={open} onOpenChange={() => onClose(args.size)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust team size</DialogTitle>
          <DialogDescription>
            Review the visit window for the booking, then double or keep the current team size of {args.size}.
          </DialogDescription>
        </DialogHeader>
        <FormDateRangePicker name="visitWindow" label="Visit window" value={visitWindow} onChange={setVisitWindow} />
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onClose(args.size)}>
            Keep {args.size}
          </Button>
          <Button type="button" onClick={() => onClose(args.size * 2)}>
            Double to {args.size * 2}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const TeamSizeDialogTyped = createTypedDialog(TeamSizeDialog);
