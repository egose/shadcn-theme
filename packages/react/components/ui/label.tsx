import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';

import { cn } from '../../utils/ui';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ required = false, children, className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'gap-1 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  >
    {children}
    {required && <span className="text-danger">*</span>}
  </LabelPrimitive.Root>
));

export { Label };
