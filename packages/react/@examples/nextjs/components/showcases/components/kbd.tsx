import { ExampleGrid, ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { Kbd, KbdGroup } from '@egose/shadcn-theme/components/ui/kbd';

export default function KbdShowcase() {
  return (
    <ExamplePage title="Kbd" description="Keyboard labels are useful in menus, tooltips, and onboarding hints.">
      <ExampleGrid>
        <ExampleSection title="Shortcut groups">
          <ExampleStack>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span>Open command palette</span>
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span>New project</span>
              <KbdGroup>
                <Kbd>Shift</Kbd>
                <Kbd>N</Kbd>
              </KbdGroup>
            </div>
          </ExampleStack>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
