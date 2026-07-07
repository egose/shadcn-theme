import { createContext, useContext } from 'react';
import { TypedDialogComponent } from './types';

type DialogContextType = {
  openDialog: <A, R>(Component: TypedDialogComponent<A, R>, args: A) => Promise<R>;
};

export const DialogContext = createContext<DialogContextType | null>(null);

/**
 * Access the dialog opener from anywhere inside a {@link DialogProvider}.
 * Throws if used outside a provider.
 *
 * @returns `{ openDialog }` — call `openDialog(MyDialog, args)` to render the
 *   dialog; the returned `Promise<R>` resolves with whatever the dialog
 *   passes to `onClose(result)`.
 *
 * @example
 * const { openDialog } = useDialog()
 * const ok = await openDialog(ConfirmDialog, { title: 'Delete?' })
 */
export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within a DialogProvider');
  return ctx;
}

/**
 * Identity helper for declaring a typed dialog component. Infers `Args` and
 * `Return` from the component's props so callers of `openDialog` get full
 * type-checking without manual generic arguments.
 *
 * @example
 * const ConfirmDialog = createTypedDialog<{ title: string }, boolean>(
 *   ({ open, args, onClose }) => (
 *     <Dialog open={open} onOpenChange={(o) => !o && onClose(false)}>
 *       -- args.title rendered here --
 *     </Dialog>
 *   ),
 * )
 */
export function createTypedDialog<Args, Return>(
  component: TypedDialogComponent<Args, Return>,
): TypedDialogComponent<Args, Return> {
  return component;
}
