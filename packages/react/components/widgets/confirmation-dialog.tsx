import * as React from 'react';

import type { VariantType } from '../ui/button';
import type { DialogProps } from './dialog-manager';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { createTypedDialog } from './dialog-manager';

export interface ConfirmationDialogArgs {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmVariant?: VariantType;
}

export interface ConfirmationDialogResult {
  confirmed: boolean;
}

function ConfirmationDialogComponent({
  open,
  args,
  onClose,
}: DialogProps<ConfirmationDialogArgs, ConfirmationDialogResult>) {
  const hasResolvedRef = React.useRef(false);
  const {
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'danger',
  } = args;

  const close = React.useCallback(
    (result: ConfirmationDialogResult) => {
      if (hasResolvedRef.current) {
        return;
      }

      hasResolvedRef.current = true;
      onClose(result);
    },
    [onClose],
  );

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && close({ confirmed: false })}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => close({ confirmed: false })}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction variant={confirmVariant} onClick={() => close({ confirmed: true })}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const ConfirmationDialog = createTypedDialog<ConfirmationDialogArgs, ConfirmationDialogResult>(
  ConfirmationDialogComponent,
);
