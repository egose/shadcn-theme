'use client';

import { useState } from 'react';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../../packages/react/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../../packages/react/components/ui/dialog';

import { Input } from '../../../../../packages/react/components/ui/input';
import { Label } from '../../../../../packages/react/components/ui/label';
import { FormSelect } from '../../../../../packages/react/components/form/select';

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you are done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
          <FormSelect
            label="First name"
            name="firstName"
            data={['John', 'Jane', 'Doe']}
            defaultValue="Doe"
            required
            classNames={{ wrapper: 'col-span-1 mt-2' }}
            onChange={(val) => console.log(val)}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
          <Button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            BTN2
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
