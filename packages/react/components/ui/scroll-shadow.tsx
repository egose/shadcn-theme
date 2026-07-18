import * as React from 'react';

import { cn } from '../../utils/ui';

export interface ScrollShadowProps extends React.ComponentProps<'div'> {
  orientation?: 'vertical' | 'horizontal' | 'both';
  /**
   * Size of the gradient fade at each edge, in pixels. Defaults to `16`.
   * Increase for thicker fade zones, decrease for subtler hints.
   */
  size?: number;
  /**
   * Optional threshold below which no shadow is rendered (useful when paired
   * with intersection observers). Currently a CSS-only implementation that
   * always shows the fade mask when the content can scroll in that direction;
   * pass `0` to disable.
   */
  className?: string;
}

/**
 * A scroll container that fades overflowing content at each edge using a CSS
 * mask gradient. Pure CSS — no scroll listeners, no layout thrashing. Wrap
 * long lists or horizontally scrolling rows to give users a subtle visual cue
 * that more content is available beyond the visible viewport.
 *
 * The component does NOT enforce a height/width for you; set the desired
 * dimensions on the wrapper (e.g. `className="h-72"`) and `ScrollShadow`
 * will render a fade mask at each scrollable edge.
 *
 * @example
 * <ScrollShadow className="h-72">
 *   <ul className="p-4 space-y-2">
 *     {items.map(item => <li key={item.id}>{item.label}</li>)}
 *   </ul>
 * </ScrollShadow>
 */
export function ScrollShadow({
  orientation = 'vertical',
  size = 16,
  className,
  children,
  style,
  ...props
}: ScrollShadowProps) {
  const fade = `${size}px`;

  const maskImages: string[] = [];
  const webkitImages: string[] = [];

  if (orientation !== 'horizontal') {
    const vertical = `linear-gradient(to bottom, transparent 0, black ${fade}, black calc(100% - ${fade}), transparent 100%)`;
    maskImages.push(vertical);
    webkitImages.push(`-webkit-${vertical}`);
  }

  if (orientation !== 'vertical') {
    const horizontal = `linear-gradient(to right, transparent 0, black ${fade}, black calc(100% - ${fade}), transparent 100%)`;
    maskImages.push(horizontal);
    webkitImages.push(`-webkit-${horizontal}`);
  }

  const mask = maskImages.join(', ');
  const webkitMask = webkitImages.join(', ');

  return (
    <div
      data-slot="scroll-shadow"
      data-orientation={orientation}
      className={cn('relative overflow-auto', className)}
      style={{
        maskImage: mask,
        WebkitMaskImage: webkitMask,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
