'use client';

import { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../../components/ui/dialog';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { FormSelect } from '../../../../../components/form/select';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <ExamplePage
      title="Dialog"
      description="Dialogs are modal surfaces that focus attention on a single task or confirmation."
    >
      <ExampleSection
        title="Edit profile"
        description="Combine titled content, form fields, and primary actions inside the dialog body."
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="primary">Edit profile</Button>
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
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ExampleSection>
    </ExamplePage>
  );
}
