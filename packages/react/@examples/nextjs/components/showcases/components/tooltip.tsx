import { ExampleInline, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Kbd, KbdGroup } from '@egose/shadcn-theme/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@egose/shadcn-theme/components/ui/tooltip';

export default function TooltipShowcase() {
  return (
    <ExamplePage
      title="Tooltip"
      description="Tooltips communicate short contextual hints without consuming permanent layout space."
    >
      <ExampleSection title="Hints and shortcuts">
        <ExampleInline>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" appearance="outline">
                Invite member
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Invite a collaborator
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>I</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}
