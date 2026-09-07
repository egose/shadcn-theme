import { notFound } from 'next/navigation';

import { DynamicShowcase } from '../../../components/dynamic-showcase';
import { formSection } from '../../../lib/sections';

export function generateStaticParams() {
  return formSection.dynamicSlugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  if (!formSection.dynamicSlugs.includes(slug)) {
    notFound();
  }

  return <DynamicShowcase section={formSection} slug={slug} />;
}
