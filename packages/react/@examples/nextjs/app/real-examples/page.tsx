import { CatalogIndexPage } from '../../components/catalog-page';
import { realExamplesSection } from '../../lib/sections';

export default function Page() {
  return (
    <CatalogIndexPage
      title="Real Examples"
      description="These demos combine multiple fields and patterns into realistic flows so you can evaluate how the pieces work together in practice."
      section={realExamplesSection}
    />
  );
}
