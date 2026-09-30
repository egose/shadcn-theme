'use client';

import React from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

import { cn } from '../../utils/ui';
import { FormError } from './error';
import { FormSelect } from './select';
import type { FormSelectProps } from './select';
import type { HookFormRules } from './types';

/** RHF selection with composite onBlur/touched validation and trigger focus for setFocus/invalid submit. Optional onBlur runs after RHF's handler. */
export function HookFormSelect<T extends FieldValues>({
  id,
  name,
  label,
  error,
  rules,
  classNames,
  disabled = false,
  onBlur,
  ...rest
}: Omit<FormSelectProps, 'name' | 'onChange' | 'value'> & {
  rules?: HookFormRules<T>;
  name: Path<T>;
  error?: string;
}) {
  const { control } = useFormContext<T>();
  const { wrapper, ...restClassnames } = classNames ?? {};

  return (
    <div className={cn('$hook-form-select', wrapper)}>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value, onBlur: fieldOnBlur, ref } }) => {
          return (
            <FormSelect
              ref={ref}
              onBlur={() => {
                fieldOnBlur();
                onBlur?.();
              }}
              id={id}
              name={name}
              label={label}
              onChange={onChange}
              value={value}
              disabled={disabled}
              {...rest}
              classNames={restClassnames}
            />
          );
        }}
      />

      <FormError field={name} className="mt-1" message={error} />

    </div>
  );
}
