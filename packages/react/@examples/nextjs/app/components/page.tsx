import { CatalogIndexPage } from '../../components/catalog-page';
import { componentsSection } from '../../lib/sections';

export default function Page() {
  return (
    <CatalogIndexPage
      title="Components"
      description="The catalog below mirrors the available UI components and routes each example from a single registry."
      section={componentsSection}
    />
  );
}
