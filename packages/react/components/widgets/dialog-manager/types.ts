import { FC } from 'react';

/**
 * Props every dialog component rendered by {@link DialogProvider} must accept.
 * The provider injects `open: true`, the caller-supplied `args`, and an
 * `onClose` callback that resolves the promise returned by `openDialog`.
 */
export type DialogProps<Args, Return> = {
  open: boolean;
  args: Args;
  onClose: (result: Return) => void;
};

/**
 * A function component parameterized by `Args` (the input the caller passes
 * in) and `Return` (the value the dialog resolves with). Use
 * {@link createTypedDialog} to declare one with full type inference.
 */
export type TypedDialogComponent<Args, Return> = FC<DialogProps<Args, Return>>;
