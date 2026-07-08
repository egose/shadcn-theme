import React from 'react';
import _get from 'lodash-es/get';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { cn } from '../../utils/ui';
import { FormError } from './error';
import { FormNativeSelect } from './native-select';
import type { FormNativeSelectProps } from './native-select';
import { isValidationRuleEnabled, mergeHookFormRules } from './types';
import type { HookFormRules, HookFormValidationAttributes } from './types';

type HookFormNativeSelectValidationAttributes = Pick<HookFormValidationAttributes, 'required'>;

type HookFormNativeSelectProps<T extends FieldValues> = Omit<
  FormNativeSelectProps,
  'name' | 'selectProps' | keyof HookFormNativeSelectValidationAttributes
> & {
  name: Path<T>;
  rules?: HookFormRules<T>;
  error?: string;
} & HookFormNativeSelectValidationAttributes;

export function HookFormNativeSelect<T extends FieldValues>({
  id,
  name,
  rules,
  label,
  error,
  classNames,
  disabled,
  required,
  ...rest
}: HookFormNativeSelectProps<T>) {
  const methods = useFormContext<T>();
  if (!methods) return null;

  const {
    register,
    formState: { errors },
  } = methods;

  const fieldError = _get(errors, name);
  const errorMessage = error ?? (fieldError && String(fieldError?.message));
  const showError = !!fieldError && !disabled;
  const mergedRules = mergeHookFormRules(rules, { required });

  return (
    <div className={cn('$hook-form-native-select', classNames?.wrapper)}>
      <FormNativeSelect
        {...rest}
        id={id}
        name={name}
        label={label}
        disabled={disabled}
        required={isValidationRuleEnabled(mergedRules?.required)}
        classNames={{
          label: cn(classNames?.label, {
            'text-danger': showError,
          }),
          input: cn(classNames?.input, {
            'ring-danger text-danger': showError,
          }),
        }}
        selectProps={register(name, mergedRules)}
      />
      {showError && <FormError field={name} className="mt-1" message={errorMessage} />}
    </div>
  );
}
