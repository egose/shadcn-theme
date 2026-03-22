import * as React from 'react';

import { cn } from '../../utils/ui';

const baseClassName = [
  'aria-invalid:border-destructive',
  'aria-invalid:ring-3',
  'aria-invalid:ring-destructive/20',
  'bg-transparent',
  'border',
  'border-input',
  'dark:aria-invalid:border-destructive/50',
  'dark:aria-invalid:ring-destructive/40',
  'dark:bg-input/30',
  'dark:disabled:bg-input/80',
  'disabled:bg-input/50',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'field-sizing-content',
  'flex',
  'focus-visible:border-ring',
  'focus-visible:ring-3',
  'focus-visible:ring-ring/50',
  'md:text-sm',
  'min-h-16',
  'outline-none',
  'placeholder:text-muted-foreground',
  'px-2.5',
  'py-2',
  'rounded-sm',
  'text-base',
  'transition-colors',
  'w-full',
].join(' ');

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return <textarea className={cn(baseClassName, className)} ref={ref} {...props} />;
  },
);

export { Textarea };
