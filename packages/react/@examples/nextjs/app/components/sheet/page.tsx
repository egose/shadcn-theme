'use client';

import { useState } from 'react';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Label } from '@egose/shadcn-theme/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@egose/shadcn-theme/components/ui/sheet';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Pedro Duarte');
  const [username, setUsername] = useState('@peduarte');
  const [savedProfile, setSavedProfile] = useState<string | null>(null);

  return (
    <ExamplePage
      title="Sheet"
      description="Sheets slide in off-canvas panels for supporting workflows without leaving the current page."
    >
      <ExampleSection
        title="Edit profile"
        description="Use a right-anchored sheet for a focused editing flow. Saving submits the sheet's form, closes it, and confirms the result."
      >
        <div className="space-y-2">
          {savedProfile ? (
            <p role="status" className="text-sm text-muted-foreground">
              Saved profile for {savedProfile}
            </p>
          ) : null}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="action">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>Make changes to your profile here and click save when finished.</SheetDescription>
              </SheetHeader>
              <form
                className="flex min-h-0 flex-1 flex-col"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSavedProfile(`${name} (${username})`);
                  setOpen(false);
                }}
              >
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                  <div className="grid gap-3">
                    <Label htmlFor="sheet-demo-name">Name</Label>
                    <Input id="sheet-demo-name" value={name} onChange={(event) => setName(event.target.value)} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="sheet-demo-username">Username</Label>
                    <Input
                      id="sheet-demo-username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </div>
                </div>
                <SheetFooter>
                  <Button type="submit">Save changes</Button>
                  <SheetClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </ExampleSection>
    </ExamplePage>
  );
}
