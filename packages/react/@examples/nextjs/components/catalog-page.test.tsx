import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isValidElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineSection, type CatalogListing } from '../lib/example-registry';
import { componentsSection, formSection, realExamplesSection, widgetsSection } from '../lib/sections';
import { CatalogIndexPage } from './catalog-page';
import { CatalogSearch } from './catalog-search';

const sections = [componentsSection, formSection, widgetsSection, realExamplesSection];
const workflowCount = realExamplesSection.entries.length;

afterEach(cleanup);

describe('catalog discovery', () => {
  it.each(sections)('server-renders every initial card in $name before hydration', (section) => {
    const page = CatalogIndexPage({ title: section.name, description: 'Catalog', section });
    const search = page.props.children.find((child: unknown) => isValidElement(child) && child.type === CatalogSearch);
    expect(JSON.parse(JSON.stringify(search.props))).toEqual(search.props);
    for (const entry of search.props.entries) {
      expect(Object.keys(entry).sort()).toEqual(['capabilities', 'description', 'related', 'title', 'url']);
    }
    const html = renderToString(page);
    const document = new DOMParser().parseFromString(html, 'text/html');
    expect(document.querySelectorAll('article')).toHaveLength(section.entries.length);
    for (const entry of section.entries) {
      expect(document.querySelector(`h2 a[href="${entry.url}"]`)?.textContent).toBe(entry.title);
    }
    expect(document.querySelector('[role="status"]')?.textContent).toBe(
      `${section.entries.length} of ${section.entries.length} examples`,
    );
  });

  it('passes only serializable listing metadata at the actual client boundary without invoking loaders', () => {
    const load = vi.fn(async () => ({ default: () => null }));
    const section = defineSection({
      name: 'components',
      base: '/components',
      entries: [{ slug: 'probe', route: 'dynamic', title: 'Probe', description: 'Lazy probe', load }],
    });
    const page = CatalogIndexPage({ title: 'Probe', description: 'Catalog', section });
    const search = page.props.children.find((child: unknown) => isValidElement(child) && child.type === CatalogSearch);
    expect(search.props).toEqual({
      entries: [
        {
          title: 'Probe',
          description: 'Lazy probe',
          url: '/components/probe',
          capabilities: [],
          related: [],
        },
      ],
    });
    expect(JSON.parse(JSON.stringify(search.props))).toEqual(search.props);
    renderToString(page);
    expect(load).not.toHaveBeenCalled();
  });

  it.each([
    ['LAUNCH', ['Launch Request']],
    ['permission', ['Account and Workspace Settings']],
    ['  RETAINED   retry drafts  ', ['Support Inbox', 'Customer Resource Management']],
    ['per-ticket drafts', ['Support Inbox']],
  ] as const)('finds title, description, or capability terms: %s', async (query, titles) => {
    const user = userEvent.setup();
    render(<CatalogIndexPage title="Workflows" description="Catalog" section={realExamplesSection} />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('searchbox', { name: 'Search examples' }));
    await user.keyboard(query);
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual(titles);
    expect(screen.getByRole('status').textContent).toBe(`${titles.length} of ${workflowCount} examples`);
  });

  it('announces zero results and lets the keyboard clear and return to search', async () => {
    const user = userEvent.setup();
    render(<CatalogIndexPage title="Workflows" description="Catalog" section={realExamplesSection} />);
    await user.tab();
    await user.keyboard('no-such-capability');
    expect(screen.getByRole('status').textContent).toBe(`0 of ${workflowCount} examples`);
    expect(screen.getByText(/No examples match/).textContent).toContain('clear the search');
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Clear search' }));
    await user.keyboard('{Enter}');
    expect(document.activeElement).toBe(screen.getByRole('searchbox', { name: 'Search examples' }));
    expect(screen.getByRole('status').textContent).toBe(`${workflowCount} of ${workflowCount} examples`);
    expect(screen.queryAllByRole('article')).toHaveLength(workflowCount);
  });

  it('shows factual related demos and derives reverse workflow links from the same metadata', () => {
    const { unmount } = render(
      <CatalogIndexPage title="Workflows" description="Catalog" section={realExamplesSection} />,
    );
    const customer = screen.getByRole('heading', { name: 'Customer Resource Management' }).closest('article')!;
    expect(within(customer).getByRole('link', { name: 'Pagination' }).getAttribute('href')).toBe(
      '/components/pagination',
    );
    unmount();
    render(<CatalogIndexPage title="Components" description="Catalog" section={componentsSection} />);
    const pagination = screen.getByRole('heading', { name: 'Pagination' }).closest('article')!;
    expect(within(pagination).getByRole('link', { name: 'Customer Resource Management' }).getAttribute('href')).toBe(
      '/real-examples/customers',
    );
    expect(pagination.querySelector('a a')).toBeNull();
  });

  it('handles an empty section', () => {
    const entries: CatalogListing[] = [];
    render(<CatalogSearch entries={entries} />);
    expect(screen.getByRole('status').textContent).toBe('0 of 0 examples');
    expect(screen.getByText(/No examples match/)).toBeTruthy();
  });
});
