import { fireEvent, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  createTypedDialog,
  DialogCancellationError,
  DialogManagerProvider,
  useDialog,
} from '../components/widgets/dialog-manager';

const TestDialog = createTypedDialog<{ label: string }, string>(({ args, onClose }) => (
  <button
    type="button"
    onClick={() => {
      onClose(`${args.label} result`);
      onClose('ignored duplicate result');
    }}
  >
    Close {args.label}
  </button>
));

function DialogControls({ onPromise }: { onPromise: (promise: Promise<string>) => void }) {
  const { openDialog } = useDialog();
  return (
    <>
      <button type="button" onClick={() => onPromise(openDialog(TestDialog, { label: 'first' }))}>
        Open first
      </button>
      <button type="button" onClick={() => onPromise(openDialog(TestDialog, { label: 'second' }))}>
        Open second
      </button>
    </>
  );
}

function ExposeOpenDialog({ onReady }: { onReady: (open: ReturnType<typeof useDialog>['openDialog']) => void }) {
  const { openDialog } = useDialog();
  useEffect(() => onReady(openDialog), [onReady, openDialog]);
  return null;
}

describe('dialog manager promise ownership', () => {
  it('resolves a closed dialog once and removes it', async () => {
    const promises: Promise<string>[] = [];
    render(
      <DialogManagerProvider>
        <DialogControls onPromise={(promise) => promises.push(promise)} />
      </DialogManagerProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open first' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close first' }));

    await expect(promises[0]).resolves.toBe('first result');
    expect(screen.queryByRole('button', { name: 'Close first' })).not.toBeInTheDocument();
  });

  it('rejects every pending promise with a typed cancellation error on unmount', async () => {
    const promises: Promise<string>[] = [];
    const { unmount } = render(
      <DialogManagerProvider>
        <DialogControls onPromise={(promise) => promises.push(promise)} />
      </DialogManagerProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open first' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open second' }));
    const rejections = promises.map((promise) => promise.catch((error: unknown) => error));
    unmount();

    const errors = await Promise.all(rejections);
    expect(errors).toHaveLength(2);
    errors.forEach((error) => {
      expect(error).toBeInstanceOf(DialogCancellationError);
      expect(error).toMatchObject({ name: 'DialogCancellationError', code: 'DIALOG_PROVIDER_UNMOUNTED' });
    });
  });

  it('rejects stale openers after unmount and lets a remounted provider settle normally', async () => {
    let staleOpen: ReturnType<typeof useDialog>['openDialog'] | undefined;
    const onReady = vi.fn((open: ReturnType<typeof useDialog>['openDialog']) => {
      staleOpen = open;
    });
    const firstRender = (
      <DialogManagerProvider>
        <ExposeOpenDialog onReady={onReady} />
      </DialogManagerProvider>
    );
    const { rerender } = render(firstRender);

    rerender(<div>Unmounted</div>);
    await expect(staleOpen?.(TestDialog, { label: 'stale' })).rejects.toBeInstanceOf(DialogCancellationError);

    const promises: Promise<string>[] = [];
    rerender(
      <DialogManagerProvider>
        <DialogControls onPromise={(promise) => promises.push(promise)} />
      </DialogManagerProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open first' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close first' }));

    await expect(promises[0]).resolves.toBe('first result');
  });
});
