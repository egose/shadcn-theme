import * as React from 'react';

import type { DialogProps } from './dialog-manager';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { createTypedDialog } from './dialog-manager';

export interface ImagePreviewDialogArgs {
  src: string;
  alt?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

function ImagePreviewDialogComponent({ open, args, onClose }: DialogProps<ImagePreviewDialogArgs, void>) {
  const { src, alt = 'Image preview', title, description } = args;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-screen-xl overflow-hidden bg-black/5 p-0">
        <div className="flex h-full flex-col">
          {(title || description) && (
            <DialogHeader className="border-b bg-background p-4">
              {title ? <DialogTitle>{title}</DialogTitle> : null}
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </DialogHeader>
          )}

          <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-950 p-2">
            <img src={src} alt={alt} className="max-h-full max-w-full object-contain shadow-2xl" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const ImagePreviewDialog = createTypedDialog<ImagePreviewDialogArgs, void>(ImagePreviewDialogComponent);
