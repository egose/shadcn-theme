import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { UnstyledButton } from '@egose/shadcn-theme/components/ui/unstyled-button';

export default function UnstyledButtonShowcase() {
  return (
    <ExamplePage
      title="Unstyled Button"
      description="Use the unstyled button when you need button semantics without inheriting preset visuals."
    >
      <ExampleSection title="Custom presentation">
        <UnstyledButton className="rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted">
          <div className="font-medium">Behavior-only button</div>
          <p className="mt-1 text-sm text-muted-foreground">
            This stays fully clickable while letting you control every visual detail yourself.
          </p>
        </UnstyledButton>
      </ExampleSection>
    </ExamplePage>
  );
}
