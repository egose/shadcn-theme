import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@egose/shadcn-theme/components/ui/drawer';

export default function DrawerShowcase() {
  return (
    <ExamplePage
      title="Drawer"
      description="Drawers are well suited for secondary flows, especially on mobile-sized viewports."
    >
      <ExampleSection title="Bottom drawer" description="Pair the drawer with a concise summary and primary actions.">
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open billing drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Confirm plan change</DrawerTitle>
              <DrawerDescription>
                Switching to Growth unlocks unlimited dashboards for your workspace.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 text-sm text-muted-foreground">
              Your next invoice will update immediately after confirmation.
            </div>
            <DrawerFooter>
              <Button>Continue</Button>
              <DrawerClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </ExampleSection>
    </ExamplePage>
  );
}
