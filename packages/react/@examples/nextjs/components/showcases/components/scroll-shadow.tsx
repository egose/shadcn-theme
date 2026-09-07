import { ExampleGrid, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { ScrollShadow } from '@egose/shadcn-theme/components/ui/scroll-shadow';

export default function ScrollShadowShowcase() {
  return (
    <ExamplePage
      title="Scroll Shadow"
      description="ScrollShadow fades overflowing content at each scrollable edge using a pure CSS mask gradient — no scroll listeners, no layout thrashing."
    >
      <ExampleGrid>
        <ExampleSection
          title="Vertical list"
          description="Wrap a long list with a fixed height; the top and bottom edges fade as the user scrolls."
        >
          <ScrollShadow className="h-72 rounded-xl border">
            <ul className="space-y-2 p-4">
              {Array.from({ length: 24 }).map((_, index) => (
                <li key={index} className="rounded-lg border px-3 py-2 text-sm">
                  Item #{index + 1}
                </li>
              ))}
            </ul>
          </ScrollShadow>
        </ExampleSection>
        <ExampleSection
          title="Horizontal row"
          description="Set orientation to horizontal and constrain the width to fade the left and right edges."
        >
          <ScrollShadow orientation="horizontal" className="w-full rounded-xl border p-4">
            <div className="flex gap-3">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="flex size-28 shrink-0 items-center justify-center rounded-lg border bg-muted text-sm"
                >
                  Card {index + 1}
                </div>
              ))}
            </div>
          </ScrollShadow>
        </ExampleSection>
        <ExampleSection
          title="Both orientations"
          description="Use orientation both to fade every scrollable edge — useful for pan-and-scan surfaces."
        >
          <ScrollShadow orientation="both" className="h-64 w-full rounded-xl border">
            <div className="grid grid-cols-4 gap-2 p-4">
              {Array.from({ length: 32 }).map((_, index) => (
                <div
                  key={index}
                  className="flex size-28 items-center justify-center rounded-lg border bg-muted text-sm"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </ScrollShadow>
        </ExampleSection>
        <ExampleSection
          title="Custom fade size"
          description="Increase the size prop for thicker fade zones or set it to 0 to disable the mask entirely."
        >
          <ScrollShadow size={40} className="h-56 rounded-xl border">
            <div className="space-y-3 p-4 text-sm">
              {Array.from({ length: 18 }).map((_, index) => (
                <p key={index} className="text-muted-foreground">
                  Row {index + 1}: the gradient fade is {40}px tall on every scrollable edge.
                </p>
              ))}
            </div>
          </ScrollShadow>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
