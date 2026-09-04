import { notFound } from 'next/navigation';

import { DynamicShowcase } from '../../../components/dynamic-showcase';
import { componentsSection } from '../../../lib/sections';

export function generateStaticParams() {
  return componentsSection.dynamicSlugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  if (!componentsSection.dynamicSlugs.includes(slug)) {
    notFound();
  }

  return <DynamicShowcase section={componentsSection} slug={slug} />;
}
