import * as React from 'react';
import { useState, useCallback } from 'react';
import { DialogContext } from './context';
import { TypedDialogComponent } from './types';

type DialogEntry = {
  id: number;
  Component: TypedDialogComponent<any, any>;
  args: any;
  resolve: (value: any) => void;
};

let dialogId = 0;

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
 */
export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogEntry[]>([]);

  const openDialog = useCallback(<A, R>(Component: TypedDialogComponent<A, R>, args: A): Promise<R> => {
    return new Promise<R>((resolve) => {
      const id = ++dialogId;
      setDialogs((prev) => [...prev, { id, Component, args, resolve }]);
    });
  }, []);

  const handleClose = useCallback((id: number, result: any) => {
    setDialogs((prev) => {
      const entry = prev.find((d) => d.id === id);
      if (entry) entry.resolve(result);
      return prev.filter((d) => d.id !== id);
    });
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog }}>
      {children}

      {dialogs.map(({ id, Component, args }) => (
        <Component key={id} open={true} args={args} onClose={(result: any) => handleClose(id, result)} />
      ))}
    </DialogContext.Provider>
  );
}
