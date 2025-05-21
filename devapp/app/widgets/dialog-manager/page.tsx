'use client';

import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../package/components/ui/button';
import { useDialog } from '../../../../package/components/widgets/dialog-manager';
import { Dialog1Typed } from './Dialog1';

export default function Page() {
  const { openDialog } = useDialog();

  return (
    <>
      <Button
        variant="primary"
        onClick={async () => {
          const { confirmed } = await openDialog(Dialog1Typed, { name: 'James' });
          alert(confirmed ? 'Confirmed' : 'Not confirmed');
        }}
      >
        Open Dialog Lv1
      </Button>
    </>
  );
}
