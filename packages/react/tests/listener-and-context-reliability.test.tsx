import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const embla = vi.hoisted(() => {
  const api = {
    canScrollNext: vi.fn(() => true),
    canScrollPrev: vi.fn(() => false),
    off: vi.fn(),
    on: vi.fn(),
    scrollNext: vi.fn(),
    scrollPrev: vi.fn(),
  };
  return { api, carouselRef: vi.fn() };
});

vi.mock('embla-carousel-react', () => ({
  default: () => [embla.carouselRef, embla.api],
}));

vi.mock('../components/ui/sidebar', () => ({
  useSidebar: () => ({ isMobile: false }),
}));

import { Carousel } from '../components/ui/carousel';
import { ContextSwitcher } from '../layouts/sidebar1/context-switcher';

describe('listener and empty-state reliability', () => {
  it('removes every Embla listener with the callback used to register it', () => {
    const { unmount } = render(<Carousel />);
    const reInitHandler = embla.api.on.mock.calls.find(([event]) => event === 'reInit')?.[1];
    const selectHandler = embla.api.on.mock.calls.find(([event]) => event === 'select')?.[1];

    expect(reInitHandler).toBeTypeOf('function');
    expect(selectHandler).toBe(reInitHandler);
    unmount();

    expect(embla.api.off).toHaveBeenCalledWith('reInit', reInitHandler);
    expect(embla.api.off).toHaveBeenCalledWith('select', selectHandler);
  });

  it('supports an empty context list by rendering nothing', () => {
    const { container, rerender } = render(<ContextSwitcher items={[]} />);
    expect(container).toBeEmptyDOMElement();

    rerender(<ContextSwitcher items={[]} canAdd onContextAdd={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
