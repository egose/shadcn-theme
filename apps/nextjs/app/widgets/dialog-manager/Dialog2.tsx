import { Button } from '../../../../../package/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../../package/components/ui/dialog';
import { createTypedDialog } from '../../../../../package/components/widgets/dialog-manager';
import type { DialogProps } from '../../../../../package/components/widgets/dialog-manager';
import { FormDateRangePicker } from '../../../../../package/components/form/date-range-picker';

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
