import { ExampleGrid, ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { Checkbox } from '@egose/shadcn-theme/components/ui/checkbox';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Label } from '@egose/shadcn-theme/components/ui/label';

export default function LabelShowcase() {
  return (
    <ExamplePage
      title="Label"
      description="Labels provide accessible names, required indicators, and pairing with controls."
    >
      <ExampleGrid>
        <ExampleSection title="Form rows">
          <ExampleStack>
            <div className="space-y-2">
              <Label htmlFor="project-label" required>
                Project name
              </Label>
              <Input id="project-label" defaultValue="North star redesign" />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="notify-team" defaultChecked />
              <Label htmlFor="notify-team">Notify the team when this ships</Label>
            </div>
          </ExampleStack>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
