import { CatalogIndexPage } from '../../components/catalog-page';
import { widgetsSection } from '../../lib/sections';

export default function Page() {
  return (
    <CatalogIndexPage
      title="Widgets"
      description="Higher-level widgets combine multiple primitives into reusable application patterns."
      section={widgetsSection}
    />
  );
}
