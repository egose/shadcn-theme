import React from 'react';
import _get from 'lodash-es/get';
import { Controller, FieldValues, RegisterOptions, Path, useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { FormError } from './error';
import { FormTimeInput } from './time-input';
import type { FormTimeInputProps } from './time-input';

type HookFormTimeInputProps<T extends FieldValues> = Omit<FormTimeInputProps, 'name' | 'inputProps'> & {
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
};

export function HookFormTimeInput<T extends FieldValues>({
  id,
  name,
  rules,
  label,
  error,
  classNames,
  disabled,
  ...rest
}: HookFormTimeInputProps<T>) {
  const methods = useFormContext<T>();
  if (!methods) return null;

  const {
    control,
    formState: { errors },
  } = methods;

  const fieldError = _get(errors, name);
  const errorMessage = error ?? (fieldError?.message as string);
  const showError = !!fieldError && !disabled;

  return (
    <div className={classNames?.wrapper}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormTimeInput
            {...rest}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            classNames={{
              label: cn(classNames?.label, {
                'text-danger': showError,
              }),
              input: cn(classNames?.input, {
                'ring-danger text-danger': showError,
              }),
            }}
          />
        )}
      />
      {showError && <FormError field={name} className="mt-1" message={errorMessage} />}
    </div>
  );
}
