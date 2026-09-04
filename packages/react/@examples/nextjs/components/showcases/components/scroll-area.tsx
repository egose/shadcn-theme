import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { ScrollArea } from '@egose/shadcn-theme/components/ui/scroll-area';

export default function ScrollAreaShowcase() {
  return (
    <ExamplePage
      title="Scroll Area"
      description="Scroll areas keep long lists contained without giving up custom visual treatment."
    >
      <ExampleSection title="Recent activity">
        <ScrollArea className="h-72 rounded-xl border">
          <div className="space-y-3 p-4">
            {Array.from({ length: 14 }).map((_, index) => (
              <div key={index} className="rounded-lg border p-3 text-sm">
                <div className="font-medium">Activity #{index + 1}</div>
                <p className="mt-1 text-muted-foreground">
                  Billing sync finished for the {index + 1} most recent workspaces.
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </ExampleSection>
    </ExamplePage>
  );
}
