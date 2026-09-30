import { listCatalog, type ExampleSection } from '../lib/example-registry';
import { componentsSection, formSection, realExamplesSection, widgetsSection } from '../lib/sections';
import { CatalogSearch } from './catalog-search';

/**
 * Shared server-compatible presentation for the four section catalog index
 * pages (`/components`, `/form`, `/widgets`, `/real-examples`).
 */
export function CatalogIndexPage({
  title,
  description,
  section,
}: {
  title: string;
  description: string;
  section: ExampleSection;
}) {
  return (
    <div className="space-y-8 py-4">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Examples</p>

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </header>

      <CatalogSearch
        entries={listCatalog(section, [componentsSection, formSection, widgetsSection, realExamplesSection])}
      />
    </div>
  );
}
