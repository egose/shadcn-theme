import { ExampleInline, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Spinner } from '@egose/shadcn-theme/components/ui/spinner';

export default function SpinnerShowcase() {
  return (
    <ExamplePage
      title="Spinner"
      description="Spinners are useful for small inline loading moments and pending actions."
    >
      <ExampleSection title="Sizes and labels">
        <ExampleInline className="items-end">
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large">Loading dashboard</Spinner>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}
