import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@egose/shadcn-theme/components/ui/alert-dialog';

type CustomerArchiveDialogProps = {
  customerName: string;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  onRestoreFocus: () => void;
};

export function CustomerArchiveDialog({
  customerName,
  submitting,
  onCancel,
  onConfirm,
  onRestoreFocus,
}: CustomerArchiveDialogProps) {
  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (submitting || open) return;
        onCancel();
      }}
    >
      <AlertDialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onRestoreFocus();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Archive {customerName}?</AlertDialogTitle>

          <AlertDialogDescription>
            Archived customers are removed from active views but their records are kept. This example simulates the
            archive request. Cancel keeps the customer unchanged.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {submitting && (
          <p role="status" className="text-sm">
            Archiving customer…
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting} onClick={onCancel}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            variant="danger"
            disabled={submitting}
            onClick={(event) => {
              event.preventDefault();
              void onConfirm();
            }}
          >
            Archive customer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
