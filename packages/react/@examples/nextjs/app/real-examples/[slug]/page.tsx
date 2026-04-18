import { notFound } from 'next/navigation';

import { RealExampleShowcase } from '../../../components/showcases';
import { realExampleDynamicSlugs } from '../../../lib/example-registry';

export function generateStaticParams() {
  return Array.from(realExampleDynamicSlugs).map((slug) => ({ slug }));
}

export default async function Page({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  if (!realExampleDynamicSlugs.has(slug)) {
    notFound();
  }

  return <RealExampleShowcase slug={slug} />;
}
