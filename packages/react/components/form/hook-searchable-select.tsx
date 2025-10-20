import React from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import _kebabCase from 'lodash-es/kebabCase';
import _isNil from 'lodash-es/isNil';

import { cn } from '../../lib/utils';
import { FormError } from './error';
import { FormSearchableSelect } from './searchable-select';
import type { FormSearchableSelectProps } from './searchable-select';
import type { HookFormRules } from './types';

export function HookFormSearchableSelect<T extends FieldValues>({
  id,
  name,
  label,
  error,
  rules,
  classNames,
  disabled = false,
  ...rest
}: Omit<FormSearchableSelectProps, 'name' | 'onChange' | 'value'> & {
  rules?: HookFormRules<T>;
  name: Path<T>;
  error?: string;
}) {
  const { control } = useFormContext<T>();
  const { wrapper, ...restClassnames } = classNames ?? {};

  return (
    <div className={cn('_hook-select', wrapper)}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <FormSearchableSelect
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
