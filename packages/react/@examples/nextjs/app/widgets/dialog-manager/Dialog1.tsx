import { Button } from '../../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../../components/ui/dialog';
import { useDialog, createTypedDialog } from '../../../../../components/widgets/dialog-manager';
import type { DialogProps } from '../../../../../components/widgets/dialog-manager';
import { FormTextInput } from '../../../../../components/form/text-input';
import { Dialog2Typed } from './Dialog2';

function Dialog1({ open, args, onClose }: DialogProps<{ name: string }, { confirmed: boolean }>) {
  const { openDialog } = useDialog();

  return (
    <Dialog open={open} onOpenChange={() => onClose({ confirmed: false })}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog1</DialogTitle>
        </DialogHeader>
        <FormTextInput
          name="address"
          label={`Hi! ${args.name}`}
          placeholder="Enter address..."
          classNames={{ wrapper: 'block' }}
        />
        <DialogFooter>
          <Button
            onClick={async () => {
              const result = await openDialog(Dialog2Typed, { age: 9 });
              alert(`New age is ${result}`);
            }}
          >
            Open Dialog Lv2
          </Button>
          <Button variant="success" onClick={() => onClose({ confirmed: true })}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Dialog1Typed = createTypedDialog(Dialog1);
