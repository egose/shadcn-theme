import { createContext, useContext } from 'react';
import { TypedDialogComponent } from './types';

type DialogContextType = {
  openDialog: <A, R>(Component: TypedDialogComponent<A, R>, args: A) => Promise<R>;
};

export const DialogContext = createContext<DialogContextType | null>(null);

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within a DialogProvider');
  return ctx;
}

export function createTypedDialog<Args, Return>(
  component: TypedDialogComponent<Args, Return>,
): TypedDialogComponent<Args, Return> {
  return component;
}
