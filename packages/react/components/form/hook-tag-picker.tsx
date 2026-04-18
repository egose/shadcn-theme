import { Controller, type FieldValues, type Path, useFormContext } from 'react-hook-form';

import { cn } from '../../utils/ui';
import { FormError } from './error';
import { FormTagPicker } from './tag-picker';

import type { FormTagPickerProps } from './tag-picker';
import type { HookFormRules } from './types';

export function HookFormTagPicker<T extends FieldValues>({
  id,
  name,
  label,
  error,
  rules,
  classNames,
  disabled = false,
  ...rest
}: Omit<FormTagPickerProps, 'name' | 'onChange' | 'value'> & {
  rules?: HookFormRules<T>;
  name: Path<T>;
  error?: string;
}) {
  const { control } = useFormContext<T>();
  const { wrapper, ...restClassnames } = classNames ?? {};

  return (
    <div className={cn('$hook-tag-picker', wrapper)}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <FormTagPicker
            id={id}
            name={name}
            label={label}
            value={value ?? []}
            onChange={onChange}
            disabled={disabled}
            classNames={restClassnames}
            {...rest}
          />
        )}
      />

      <FormError field={name} className="mt-1" message={error} />
    </div>
  );
}
