import { ExampleGrid, ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Label } from '@egose/shadcn-theme/components/ui/label';

export default function InputShowcase() {
  return (
    <ExamplePage
      title="Input"
      description="Use the input primitive for common text entry states before layering on form wrappers."
    >
      <ExampleGrid>
        <ExampleSection title="Common states">
          <ExampleStack>
            <Input placeholder="Search releases..." />
            <Input type="email" defaultValue="owner@example.com" />
            <Input type="password" value="secret-value" readOnly />
            <Input placeholder="Disabled input" disabled />
          </ExampleStack>
        </ExampleSection>
        <ExampleSection title="Inline with label">
          <div className="space-y-2">
            <Label htmlFor="workspace-domain" required>
              Workspace domain
            </Label>
            <Input id="workspace-domain" defaultValue="egose-inc" />
          </div>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
