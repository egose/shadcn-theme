import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { DialogProps } from './dialog-manager';

import { HookFormTextInput } from '../form/hook-text-input';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { createTypedDialog } from './dialog-manager';

export interface TextInputDialogArgs {
  title: React.ReactNode;
  description?: React.ReactNode;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  minLength?: number;
  maxLength?: number;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'>;
}

export interface TextInputDialogResult {
  value?: string;
  cancelled: boolean;
}

function TextInputDialogComponent({ open, args, onClose }: DialogProps<TextInputDialogArgs, TextInputDialogResult>) {
  const {
    title,
    description,
    label,
    placeholder,
    defaultValue = '',
    confirmText = 'Submit',
    cancelText = 'Cancel',
    minLength = 1,
    maxLength = 100,
    inputProps,
  } = args;

  const formSchema = React.useMemo(
    () =>
      z.object({
        inputValue: z
          .string()
          .min(minLength, `Must be at least ${minLength} characters`)
          .max(maxLength, `Must be at most ${maxLength} characters`),
      }),
    [maxLength, minLength],
  );

  type FormValues = z.infer<typeof formSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputValue: defaultValue,
    },
  });

  React.useEffect(() => {
    methods.reset({ inputValue: defaultValue });
  }, [defaultValue, methods]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose({ cancelled: true })}>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit((data) => onClose({ value: data.inputValue, cancelled: false }))}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </DialogHeader>

            <div className="py-4">
              <HookFormTextInput
                {...inputProps}
                name="inputValue"
                label={label}
                placeholder={placeholder}
                autoFocus={inputProps?.autoFocus ?? true}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onClose({ cancelled: true })}>
                {cancelText}
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {confirmText}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export const TextInputDialog = createTypedDialog<TextInputDialogArgs, TextInputDialogResult>(TextInputDialogComponent);
