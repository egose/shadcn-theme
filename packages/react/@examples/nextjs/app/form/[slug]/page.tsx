import { notFound } from 'next/navigation';
import { FormShowcase } from '../../../components/showcases';
import { formDynamicSlugs } from '../../../lib/example-registry';

export function generateStaticParams() {
  return Array.from(formDynamicSlugs).map((slug) => ({ slug }));
}

export default async function Page({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  if (!formDynamicSlugs.has(slug)) {
    notFound();
  }

  return <FormShowcase slug={slug} />;
}
