import { Button } from '../../../../../packages/react/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../../packages/react/components/ui/dialog';
import { createTypedDialog } from '../../../../../packages/react/components/widgets/dialog-manager';
import type { DialogProps } from '../../../../../packages/react/components/widgets/dialog-manager';
import { FormDateRangePicker } from '../../../../../packages/react/components/form/date-range-picker';

function Dialog2({ open, args, onClose }: DialogProps<{ age: number }, number>) {
  return (
    <Dialog open={open} onOpenChange={() => onClose(0)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog2</DialogTitle>
        </DialogHeader>
        <p>Age is: {args.age}</p>
        <FormDateRangePicker name="dates" onChange={console.log} />
        <DialogFooter>
          <Button onClick={() => onClose(args.age * 2)}>Multiply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Dialog2Typed = createTypedDialog(Dialog2);
