'use client';

import React from 'react';
import _get from 'lodash-es/get';
import { FieldValues, RegisterOptions, Path, useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { FormError } from './error';
import { FormTextarea } from './textarea';
import type { FormTextareaProps } from './textarea';

export function HookFormTextarea<T extends FieldValues>({
  id,
  name,
  rules,
  label,
  error,
  classNames,
  disabled,
  ...others
}: Omit<FormTextareaProps, 'name' | 'inputProps'> & {
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>> | undefined;
  error?: string;
}) {
  const methods = useFormContext<T>();
  if (!methods) return null;

  const {
    register,
    formState: { errors },
  } = methods;

  const fieldError = _get(errors, name);
  const errorMessage = error ?? (fieldError && String(fieldError?.message));
  const showError = !!fieldError && !disabled;

  return (
    <div className={classNames?.wrapper}>
      <FormTextarea
        id={id}
        name={name}
        label={label}
        disabled={disabled}
        {...others}
        classNames={{
          label: cn(classNames?.label, {
            'text-danger': showError,
          }),
          input: cn(classNames?.input, {
            'ring-danger text-danger': showError,
          }),
        }}
        inputProps={register(name, rules)}
      />
      {showError && <FormError field={name} className="mt-1" message={errorMessage} />}
    </div>
  );
}
