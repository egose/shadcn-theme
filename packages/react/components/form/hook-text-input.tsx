import React from 'react';
import _get from 'lodash-es/get';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { cn } from '../../utils/ui';
import { FormError } from './error';
import { FormTextInput } from './text-input';
import type { FormTextInputProps } from './text-input';
import { getValidationRuleValue, isValidationRuleEnabled, mergeHookFormRules } from './types';
import type { HookFormRules, HookFormValidationAttributes } from './types';

type HookFormTextInputValidationAttributes = Pick<
  HookFormValidationAttributes,
  'required' | 'min' | 'max' | 'maxLength' | 'minLength'
>;

type HookFormTextInputProps<T extends FieldValues> = Omit<
  FormTextInputProps,
  'name' | 'inputProps' | keyof HookFormTextInputValidationAttributes
> & {
  name: Path<T>;
  rules?: HookFormRules<T>;
  error?: string;
} & HookFormTextInputValidationAttributes;

export function HookFormTextInput<T extends FieldValues>({
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
}: HookFormTextInputProps<T>) {
  const methods = useFormContext<T>();
  if (!methods) return null;

  const {
    register,
    formState: { errors },
  } = methods;

  const fieldError = _get(errors, name);
  const errorMessage = error ?? (fieldError && String(fieldError?.message));
  const showError = !!fieldError && !disabled;
  const mergedRules = mergeHookFormRules(rules, { required, min, max, maxLength, minLength });

  return (
    <div className={cn('$hook-form-text-input', classNames?.wrapper)}>
      <FormTextInput
        {...rest}
        id={id}
        name={name}
        label={label}
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
        inputProps={register(name, mergedRules)}
      />
      {showError && <FormError field={name} className="mt-1" message={errorMessage} />}
    </div>
  );
}
