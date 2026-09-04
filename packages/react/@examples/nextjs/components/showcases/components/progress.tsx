import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { Progress } from '@egose/shadcn-theme/components/ui/progress';

export default function ProgressShowcase() {
  return (
    <ExamplePage
      title="Progress"
      description="Progress bars communicate background work, upload completion, and onboarding status."
    >
      <ExampleSection title="Progress states">
        <ExampleStack>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Import contacts</span>
              <span>24%</span>
            </div>
            <Progress value={24} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Sync billing data</span>
              <span>68%</span>
            </div>
            <Progress value={68} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Publish release</span>
              <span>100%</span>
            </div>
            <Progress value={100} />
          </div>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
