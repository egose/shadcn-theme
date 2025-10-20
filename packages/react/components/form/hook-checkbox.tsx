import React from 'react';
import _get from 'lodash-es/get';
import { Controller, FieldValues, RegisterOptions, Path, useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { FormError } from './error';
import { FormCheckbox } from './checkbox';
import type { FormCheckboxProps } from './checkbox';

type HookFormCheckboxProps<T extends FieldValues> = Omit<FormCheckboxProps, 'name' | 'checked' | 'onCheckedChange'> & {
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
};

export function HookFormCheckbox<T extends FieldValues>({
  id,
  name,
  label,
  rules,
  error,
  disabled,
  classNames,
  ...rest
}: HookFormCheckboxProps<T>) {
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
        render={({ field: { value, onChange } }) => (
          <FormCheckbox
            id={id}
            name={name}
            label={label}
            disabled={disabled}
            checked={value}
            onCheckedChange={onChange}
            classNames={{
              ...classNames,
              label: cn(classNames?.label, {
                'text-danger': showError,
              }),
              checkbox: cn(classNames?.checkbox, {
                'ring-danger text-danger': showError,
              }),
            }}
            {...rest}
          />
        )}
      />
      {showError && <FormError field={name} className="mt-1" message={errorMessage} />}
    </div>
  );
}
