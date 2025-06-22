import { FC } from 'react';

export type DialogProps<Args, Return> = {
  open: boolean;
  args: Args;
  onClose: (result: Return) => void;
};

export type TypedDialogComponent<Args, Return> = FC<DialogProps<Args, Return>>;
