import * as React from 'react';
import { Button } from '../button';
import { Input } from '../input';
import { cn } from '../../../utils/ui';

export interface FileInputAsButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id?: string;
  accept?: string;
  loading?: boolean;
  resetOnChange?: boolean;
  classNames?: {
    wrapper?: string;
    input?: string;
    trigger?: string;
  };
}

export const FileInputAsButton = React.forwardRef<HTMLInputElement, FileInputAsButtonProps>(
  (
    { children, id = 'file-upload', accept = '*', loading, resetOnChange = true, classNames, onChange, ...rest },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      if (ref) {
        ref.current = node;
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);

      if (resetOnChange) {
        event.target.value = '';
      }
    };

    return (
      <div className={cn(classNames?.wrapper)}>
        <Input
          {...rest}
          ref={setRefs}
          id={id}
          type="file"
          accept={accept}
          onChange={handleChange}
          className={cn('sr-only', classNames?.input)}
        />

        <Button
          type="button"
          size="sm"
          loading={loading}
          disabled={loading || rest.disabled}
          className={cn(classNames?.trigger)}
          onClick={() => inputRef.current?.click()}
        >
          {children}
        </Button>
      </div>
    );
  },
);

FileInputAsButton.displayName = 'FileInputAsButton';
