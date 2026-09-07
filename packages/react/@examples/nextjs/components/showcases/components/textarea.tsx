import { ExampleGrid, ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { Textarea } from '@egose/shadcn-theme/components/ui/textarea';

export default function TextareaShowcase() {
  return (
    <ExamplePage
      title="Textarea"
      description="Textarea supports longer messages, internal notes, and drafting workflows."
    >
      <ExampleGrid>
        <ExampleSection title="Default and disabled states">
          <ExampleStack>
            <Textarea rows={5} placeholder="Add customer context for the next handoff..." />
            <Textarea rows={4} disabled defaultValue="This field is intentionally disabled in readonly review mode." />
          </ExampleStack>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
