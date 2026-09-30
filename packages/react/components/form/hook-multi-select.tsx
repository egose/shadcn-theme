'use client';

import React from 'react';
import { Controller, type FieldValues, type Path, useFormContext } from 'react-hook-form';

import { cn } from '../../utils/ui';
import { FormError } from './error';
import { FormMultiSelect } from './multi-select';

import type { FormMultiSelectProps } from './multi-select';
import type { HookFormRules } from './types';

/** RHF selection with composite onBlur/touched validation and input focus for setFocus/invalid submit. Optional onBlur runs after RHF's handler. */
export function HookFormMultiSelect<T extends FieldValues>({
  id,
  name,
  label,
  error,
  rules,
  classNames,
  disabled = false,
  onBlur,
  ...rest
}: Omit<FormMultiSelectProps, 'name' | 'onChange' | 'value'> & {
  rules?: HookFormRules<T>;
  name: Path<T>;
  error?: string;
}) {
  const { control } = useFormContext<T>();
  const { wrapper, ...restClassnames } = classNames ?? {};

  return (
    <div className={cn('$hook-multi-select', wrapper)}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value, onBlur: fieldOnBlur, ref } }) => {
          return (
            <FormMultiSelect
              ref={ref}
              onBlur={() => {
                fieldOnBlur();
                onBlur?.();
              }}
              id={id}
              name={name}
              label={label}
              value={value ?? []}
              onChange={onChange}
              disabled={disabled}
              classNames={restClassnames}
              {...rest}
            />
          );
        }}
      />

      <FormError field={name} className="mt-1" message={error} />
    </div>
  );
}
