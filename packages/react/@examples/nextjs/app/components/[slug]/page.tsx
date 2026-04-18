import { notFound } from 'next/navigation';
import { ComponentShowcase } from '../../../components/showcases';
import { componentDynamicSlugs } from '../../../lib/example-registry';

export function generateStaticParams() {
  return Array.from(componentDynamicSlugs).map((slug) => ({ slug }));
}

export default async function Page({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  if (!componentDynamicSlugs.has(slug)) {
    notFound();
  }

  return <ComponentShowcase slug={slug} />;
}
