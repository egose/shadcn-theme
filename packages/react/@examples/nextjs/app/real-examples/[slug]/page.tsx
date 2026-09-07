import { notFound } from 'next/navigation';

import { DynamicShowcase } from '../../../components/dynamic-showcase';
import { realExamplesSection } from '../../../lib/sections';

export function generateStaticParams() {
  return realExamplesSection.dynamicSlugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  if (!realExamplesSection.dynamicSlugs.includes(slug)) {
    notFound();
  }

  return <DynamicShowcase section={realExamplesSection} slug={slug} />;
}
