import { ExampleGrid, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { AspectRatio } from '@egose/shadcn-theme/components/ui/aspect-ratio';

export default function AspectRatioShowcase() {
  return (
    <ExamplePage
      title="Aspect Ratio"
      description="Preserve consistent media framing while letting the surrounding layout stay flexible."
    >
      <ExampleSection
        title="Product imagery"
        description="Use aspect ratio containers to keep cards aligned before assets finish loading."
      >
        <ExampleGrid>
          {[4 / 3, 16 / 9, 1].map((ratio) => (
            <div key={ratio} className="space-y-3">
              <AspectRatio ratio={ratio}>
                <div className="flex h-full items-center justify-center rounded-xl border bg-gradient-to-br from-muted to-muted/30 text-sm font-medium text-muted-foreground">
                  {ratio === 1 ? '1:1 thumbnail' : ratio === 16 / 9 ? '16:9 hero' : '4:3 preview'}
                </div>
              </AspectRatio>
              <p className="text-sm text-muted-foreground">
                Ratio {ratio === 1 ? '1:1' : ratio === 16 / 9 ? '16:9' : '4:3'}
              </p>
            </div>
          ))}
        </ExampleGrid>
      </ExampleSection>
    </ExamplePage>
  );
}
