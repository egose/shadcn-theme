import React from 'react';
import _get from 'lodash-es/get';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { cn } from '../../utils/ui';
import { FormError } from './error';
import { FormTimeInput } from './time-input';
import type { FormTimeInputProps } from './time-input';
import { getValidationRuleValue, isValidationRuleEnabled, mergeHookFormRules } from './types';
import type { HookFormRules, HookFormValidationAttributes } from './types';

type HookFormTimeInputValidationAttributes = Pick<
  HookFormValidationAttributes,
  'required' | 'min' | 'max' | 'maxLength' | 'minLength'
>;

type HookFormTimeInputProps<T extends FieldValues> = Omit<
  FormTimeInputProps,
  'name' | 'inputProps' | keyof HookFormTimeInputValidationAttributes
> & {
  name: Path<T>;
  rules?: HookFormRules<T>;
  error?: string;
} & HookFormTimeInputValidationAttributes;

export function HookFormTimeInput<T extends FieldValues>({
  id,
  name,
  rules,
  label,
  error,
  classNames,
  disabled,
  required,
  min,
  max,
  maxLength,
  minLength,
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
  const mergedRules = mergeHookFormRules(rules, { required, min, max, maxLength, minLength });

  return (
    <div className={cn('$hook-form-time-input', classNames?.wrapper)}>
      <Controller
        name={name}
        control={control}
        rules={mergedRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormTimeInput
            {...rest}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={isValidationRuleEnabled(mergedRules?.required)}
            min={getValidationRuleValue(mergedRules?.min)}
            max={getValidationRuleValue(mergedRules?.max)}
            maxLength={getValidationRuleValue(mergedRules?.maxLength)}
            minLength={getValidationRuleValue(mergedRules?.minLength)}
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
