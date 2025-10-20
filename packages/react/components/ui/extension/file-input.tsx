import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { forwardRef } from 'react';

export interface FileInputAsButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id?: string;
  accept?: string;
  loading?: boolean;
}

export const FileInputAsButton = forwardRef<HTMLInputElement, FileInputAsButtonProps>(
  ({ children, id = 'file-upload', accept = '*', className, loading, ...rest }, ref) => {
    return (
      <div>
        <Input ref={ref} id={id} type="file" accept={accept} className={`sr-only ${className ?? ''}`} {...rest} />

        <label htmlFor={id}>
          <Button size="sm" asChild loading={loading}>
            {children}
          </Button>
        </label>
      </div>
    );
  },
);

FileInputAsButton.displayName = 'FileInputAsButton';
