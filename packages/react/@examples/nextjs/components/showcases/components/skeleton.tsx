import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Skeleton } from '@egose/shadcn-theme/components/ui/skeleton';

export default function SkeletonShowcase() {
  return (
    <ExamplePage
      title="Skeleton"
      description="Skeleton placeholders reduce perceived waiting time while data is loading."
    >
      <ExampleSection title="Card placeholder">
        <div className="space-y-3 rounded-xl border p-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </ExampleSection>
    </ExamplePage>
  );
}
