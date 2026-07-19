'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../../../components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../../../../components/ui/carousel';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  const slides = Array.from({ length: 5 });

  return (
    <ExamplePage
      title="Carousel"
      description="Carousels horizontally scroll content blocks with optional next and previous navigation controls."
    >
      <ExampleSection
        title="Featured cards"
        description="Use the carousel to surface a small set of equally weighted items."
      >
        <div className="flex justify-center">
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {slides.map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{index + 1}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </ExampleSection>
    </ExamplePage>
  );
}
