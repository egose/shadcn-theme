import { ExampleGrid, ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { DirectionProvider } from '@egose/shadcn-theme/components/ui/direction';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@egose/shadcn-theme/components/ui/pagination';

export default function DirectionShowcase() {
  return (
    <ExamplePage
      title="Direction"
      description="Wrap directional primitives when you need consistent RTL and LTR rendering."
    >
      <ExampleGrid>
        <ExampleSection title="LTR">
          <DirectionProvider dir="ltr" direction="ltr">
            <ExampleStack>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </ExampleStack>
          </DirectionProvider>
        </ExampleSection>
        <ExampleSection title="RTL">
          <DirectionProvider dir="rtl" direction="rtl">
            <ExampleStack>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </ExampleStack>
          </DirectionProvider>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
