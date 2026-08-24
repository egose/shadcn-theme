'use client';

import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DialogContext } from './context';
import { TypedDialogComponent } from './types';

type DialogEntry = {
  id: number;
  render: (onClose: (result: unknown) => void) => React.ReactNode;
};

type PendingDialog = {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

/** Error used to reject pending dialogs when their owning provider unmounts. */
export class DialogCancellationError extends Error {
  readonly code = 'DIALOG_PROVIDER_UNMOUNTED';

  constructor() {
    super('Dialog provider unmounted before the dialog was closed');
    this.name = 'DialogCancellationError';
  }
}

/**
 * Render-context provider enabling promise-based dialog flows. Wrap your app
 * (or a subtree) and use {@link useDialog} to open dialogs imperatively:
 *
 * ```tsx
 * <DialogProvider>
 *   <App />
 * </DialogProvider>
 * ```
 *
 * Each call to `openDialog(Component, args)` mounts the component once and
 * returns a `Promise` that resolves when the dialog calls `onClose(result)`.
 * If this provider unmounts first, every pending promise rejects with a
 * {@link DialogCancellationError}.
 */
export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogEntry[]>([]);
  const nextId = useRef(0);
  const pendingDialogs = useRef(new Map<number, PendingDialog>());
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      const pending = Array.from(pendingDialogs.current.values());
      pendingDialogs.current.clear();
      pending.forEach(({ reject }) => reject(new DialogCancellationError()));
    };
  }, []);

  const openDialog = useCallback(<A, R>(Component: TypedDialogComponent<A, R>, args: A): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      if (!mounted.current) {
        reject(new DialogCancellationError());
        return;
      }

      const id = ++nextId.current;
      pendingDialogs.current.set(id, {
        resolve: (value) => resolve(value as R),
        reject,
      });
      setDialogs((prev) => [
        ...prev,
        {
          id,
          render: (onClose) => <Component open={true} args={args} onClose={(result) => onClose(result)} />,
        },
      ]);
    });
  }, []);

  const handleClose = useCallback((id: number, result: unknown) => {
    const pending = pendingDialogs.current.get(id);
    if (!pending) return;

    pendingDialogs.current.delete(id);
    setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
    pending.resolve(result);
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog }}>
      {children}

      {dialogs.map(({ id, render }) => (
        <React.Fragment key={id}>{render((result) => handleClose(id, result))}</React.Fragment>
      ))}
    </DialogContext.Provider>
  );
}
