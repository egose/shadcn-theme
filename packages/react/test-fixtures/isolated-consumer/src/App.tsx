import type { AnchorHTMLAttributes } from 'react';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { FormTextInput } from '@egose/shadcn-theme/components/form/text-input';
import { useClipboard } from '@egose/shadcn-theme/hooks/use-clipboard';
import { cn } from '@egose/shadcn-theme/utils/ui';
import SimpleLayout from '@egose/shadcn-theme/layouts/simple';
import {
  createTypedDialog,
  DialogManagerProvider,
  useDialog,
} from '@egose/shadcn-theme/components/widgets/dialog-manager';

const ResultDialog = createTypedDialog<{ message: string }, string>(({ args, onClose }) => (
  <div role="dialog" aria-label="Result dialog">
    <p>{args.message}</p>
    <Button onClick={() => onClose('accepted')}>Accept</Button>
  </div>
));

function Link({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }) {
  return <a {...props} href={props.href ?? to} />;
}

function ConsumerPaths() {
  const { copied, copy } = useClipboard();
  const { openDialog } = useDialog();

  return (
    <SimpleLayout
      aslink={Link}
      left={{ menus: [{ label: 'Home', link: '/' }] }}
      classNames={{ content: { wrapper: cn('consumer-content', copied && 'copied') } }}
    >
      <section>
        <FormTextInput name="project" label="Project" required />
        <Button onClick={() => copy('consumer')}>{copied ? 'Copied' : 'Copy'}</Button>
        <Button onClick={() => void openDialog(ResultDialog, { message: 'Installed tarball dialog' })}>
          Open dialog
        </Button>
      </section>
    </SimpleLayout>
  );
}

export function App() {
  return (
    <DialogManagerProvider>
      <ConsumerPaths />
    </DialogManagerProvider>
  );
}
