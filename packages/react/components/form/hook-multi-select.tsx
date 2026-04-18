import { Controller, type FieldValues, type Path, useFormContext } from 'react-hook-form';

import { cn } from '../../utils/ui';
import { FormError } from './error';
import { FormMultiSelect } from './multi-select';

import type { FormMultiSelectProps } from './multi-select';
import type { HookFormRules } from './types';

export function HookFormMultiSelect<T extends FieldValues>({
  id,
  name,
  label,
  error,
  rules,
  classNames,
  disabled = false,
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
        render={({ field: { onChange, value } }) => {
          return (
            <FormMultiSelect
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
