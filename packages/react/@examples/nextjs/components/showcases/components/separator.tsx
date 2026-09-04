import { ExampleGrid, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Separator } from '@egose/shadcn-theme/components/ui/separator';

export default function SeparatorShowcase() {
  return (
    <ExamplePage
      title="Separator"
      description="Separators create rhythm between adjacent groups without adding heavy visual weight."
    >
      <ExampleGrid>
        <ExampleSection title="Horizontal">
          <div className="space-y-3 text-sm">
            <div>Overview</div>
            <Separator />
            <div>Members</div>
            <Separator />
            <div>Billing</div>
          </div>
        </ExampleSection>
        <ExampleSection title="Vertical">
          <div className="flex h-10 items-center gap-3 text-sm">
            <span>Today</span>
            <Separator orientation="vertical" />
            <span>This week</span>
            <Separator orientation="vertical" />
            <span>This month</span>
          </div>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
