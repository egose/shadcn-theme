'use client';

import * as React from 'react';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@egose/shadcn-theme/components/ui/menubar';

export default function MenubarShowcase() {
  const [autoSave, setAutoSave] = React.useState(true);
  const [density, setDensity] = React.useState('comfortable');

  return (
    <ExamplePage
      title="Menubar"
      description="Menubars expose application-wide actions in a familiar desktop-style pattern."
    >
      <ExampleSection title="Workspace menu">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New document
                <MenubarShortcut>Ctrl+N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Duplicate
                <MenubarShortcut>Ctrl+D</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarCheckboxItem checked={autoSave} onCheckedChange={(checked) => setAutoSave(Boolean(checked))}>
                Auto-save
              </MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup value={density} onValueChange={setDensity}>
                <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
                <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
                <MenubarRadioItem value="spacious">Spacious</MenubarRadioItem>
              </MenubarRadioGroup>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Export</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>CSV</MenubarItem>
                  <MenubarItem>PDF</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </ExampleSection>
    </ExamplePage>
  );
}
