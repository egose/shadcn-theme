import React from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import _kebabCase from 'lodash-es/kebabCase';
import _isNil from 'lodash-es/isNil';

import { cn } from '../../lib/utils';
import { FormError } from './error';
import { FormDatePicker } from './date-picker';
import type { FormDatePickerProps } from './date-picker';
import type { HookFormRules } from './types';

export function HookFormDatePicker<T extends FieldValues>({
  id,
  name,
  label,
  error,
  rules,
  classNames,
  disabled,
  ...rest
}: Omit<FormDatePickerProps, 'name' | 'onChange' | 'value'> & {
  rules?: HookFormRules<T>;
  name: Path<T>;
  error?: string;
}) {
  const { control } = useFormContext<T>();
  const { wrapper, ...restClassnames } = classNames ?? {};

  return (
    <div className={cn('hook-date-picker', wrapper)}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <FormDatePicker
              id={id}
              name={name}
              label={label}
              onChange={onChange}
              // onBlur={onBlur}
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
