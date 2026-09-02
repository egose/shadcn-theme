'use client';

import React from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

import { cn } from '../../utils/ui';
import { FormDateRangePicker } from './date-range-picker';
import type { FormDateRangePickerProps } from './date-range-picker';
import { FormError } from './error';
import type { HookFormRules } from './types';

/** React Hook Form binding for the controlled {@link FormDateRangePicker}. */
export function HookFormDateRangePicker<T extends FieldValues>({
  id,
  name,
  label,
  error,
  rules,
  classNames,
  ...rest
}: Omit<FormDateRangePickerProps, 'name' | 'onChange' | 'value'> & {
  rules?: HookFormRules<T>;
  name: Path<T>;
  error?: string;
}) {
  const { control } = useFormContext<T>();
  const { wrapper, ...restClassNames } = classNames ?? {};

  return (
    <div className={cn('$hook-date-range-picker', wrapper)}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <FormDateRangePicker
            id={id}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            {...rest}
            classNames={restClassNames}
          />
        )}
      />

      <FormError field={name} className="mt-1" message={error} />
    </div>
  );
}
