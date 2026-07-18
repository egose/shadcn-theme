'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { ImageIcon } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { ImagePreviewDialog } from '../../../../../components/widgets/image-preview-dialog';
import { useDialog } from '../../../../../components/widgets/dialog-manager';
import { ExampleGrid, ExampleInline, ExamplePage, ExampleSection } from '@/components/showcase-shell';

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=70',
    alt: 'Mountain trail at dawn',
    title: 'Mountain trail',
    description: 'Captured during a sunrise hike along the trail.',
  },
  {
    src: 'https://images.unsplash.com/photo-1519681393784-d1bbf9f19ba5?w=900&q=70',
    alt: 'Starry night sky',
    title: 'Night sky',
    description: 'Long exposure of the Milky Way over the ridge.',
  },
];

export default function Page() {
  const { openDialog } = useDialog();

  async function openImage(photo: (typeof photos)[number]) {
    await openDialog(ImagePreviewDialog, {
      src: photo.src,
      alt: photo.alt,
      title: photo.title,
      description: photo.description,
    });
    toast.success('Preview closed');
  }

  return (
    <ExamplePage
      title="Image Preview Dialog"
      description="Promise-based image preview dialog that takes over the screen and closes via promise resolution."
    >
      <ExampleSection
        title="Thumbnail grid"
        description="Each thumbnail opens the same ImagePreviewDialog with a different payload."
      >
        <ExampleGrid className="md:grid-cols-2">
          {photos.map((photo) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => openImage(photo)}
              className="group relative aspect-video overflow-hidden rounded-xl border bg-muted"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium">
                  <ImageIcon className="size-4" /> Preview
                </span>
              </span>
            </button>
          ))}
        </ExampleGrid>
      </ExampleSection>
      <ExampleSection
        title="Bare trigger"
        description="Trigger the preview directly without an image to surface a poster or screenshot."
      >
        <ExampleInline>
          <Button variant="secondary" onClick={() => openImage(photos[0])}>
            Open preview
          </Button>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}
