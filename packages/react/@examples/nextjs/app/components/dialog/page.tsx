'use client';

import { useState } from 'react';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@egose/shadcn-theme/components/ui/dialog';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Label } from '@egose/shadcn-theme/components/ui/label';
import { FormSelect } from '@egose/shadcn-theme/components/form/select';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Pedro Duarte');
  const [username, setUsername] = useState('@peduarte');
  const [savedProfile, setSavedProfile] = useState<string | null>(null);

  return (
    <ExamplePage
      title="Dialog"
      description="Dialogs are modal surfaces that focus attention on a single task or confirmation."
    >
      <ExampleSection
        title="Edit profile"
        description="Combine titled content, form fields, and primary actions inside the dialog body. Saving submits the form, closes the dialog, and confirms the result."
      >
        <div className="space-y-2">
          {savedProfile ? (
            <p role="status" className="text-sm text-muted-foreground">
              Saved profile for {savedProfile}
            </p>
          ) : null}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="primary">Edit profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Make changes to your profile here. Click save when you are done.</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setSavedProfile(`${name} (${username})`);
                  setOpen(false);
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="col-span-3"
                    />
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
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </ExampleSection>
    </ExamplePage>
  );
}
