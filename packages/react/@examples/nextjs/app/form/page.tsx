import { CatalogIndexPage } from '../../components/catalog-page';
import { formSection } from '../../lib/sections';

export default function Page() {
  return (
    <CatalogIndexPage
      title="Form"
      description="These examples cover both standalone fields and react-hook-form bindings across the current form surface."
      section={formSection}
    />
  );
}
