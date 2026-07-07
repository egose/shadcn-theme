import React, { InputHTMLAttributes } from 'react';
import _kebabCase from 'lodash-es/kebabCase';
import { cn } from '../../utils/ui';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const inputClass = '';

/**
 * Props for {@link FormTextInput}. `name` is required and is auto-kebabcased
 * into the input `id` when no explicit `id` is provided. Pass additional
 * native input attributes through `inputProps` (they are merged after the
 * top-level props, so `inputProps` wins).
 */
export interface FormTextInputProps extends InputProps {
  id?: string;
  name: string;
  label?: string;
  inputProps?: InputProps;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
}

/**
 * Uncontrolled text input wrapped with a {@link Label}. Pairs with
 * `react-hook-form` via `register('name')` passed through `inputProps`, or
 * any other native input binding. Composes with `cn` so `classNames.*` are
 * merged with the defaults rather than replacing them.
 */
export function FormTextInput({
  id,
  name,
  label,
  type = 'text',
  classNames,
  required,
  disabled,
  inputProps = {},
  ...rest
}: FormTextInputProps) {
  if (!id) id = _kebabCase(name);

  return (
    <div className={cn('$form-text-input space-y-1', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <Input
        type={type}
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        autoComplete="off"
        {...inputProps}
        {...rest}
        className={cn(inputClass, classNames?.input)}
      />
    </div>
  );
}
