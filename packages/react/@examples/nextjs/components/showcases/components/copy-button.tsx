import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { CopyableButton } from '@egose/shadcn-theme/components/ui/copy-button';

export default function CopyButtonShowcase() {
  return (
    <ExamplePage
      title="Copy Button"
      description="Inline copy actions are useful for IDs, API keys, and generated snippets."
    >
      <ExampleSection title="Copyable text and custom values">
        <ExampleStack>
          <CopyableButton className="text-sm font-medium">api_live_01HZX3T2A9</CopyableButton>
          <CopyableButton value="Support escalated from roadmap board #42" className="text-sm font-medium text-primary">
            Copy escalation note
          </CopyableButton>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
