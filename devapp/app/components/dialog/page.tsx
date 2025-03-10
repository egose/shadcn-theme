'use client';

import { Button } from '../../../../package/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../package/components/ui/dialog';
import { Input } from '../../../../package/components/ui/input';
import { Label } from '../../../../package/components/ui/label';
import { useDialog222 } from '../../../../package/components/dialog-wrapper';

export default function Page() {
  const { openDialog, DialogComponent } = useDialog222();

  const handleClick = async () => {
    const result = await openDialog({ name: 'Pedro Duarte', username: '@peduarte' });
    console.log('Dialog result:', result);
  };

  return (
    <div>
      <Button onClick={handleClick}>Edit Profile</Button>
      <DialogComponent />
    </div>
  );
}
