import React from 'react';
import _get from 'lodash-es/get';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { cn } from '../../utils/ui';
import { FormError } from './error';
import { FormTextarea } from './textarea';
import type { FormTextareaProps } from './textarea';
import { getValidationRuleValue, isValidationRuleEnabled, mergeHookFormRules } from './types';
import type { HookFormRules, HookFormValidationAttributes } from './types';

type HookFormTextareaValidationAttributes = Pick<HookFormValidationAttributes, 'required' | 'maxLength' | 'minLength'>;

type HookFormTextareaProps<T extends FieldValues> = Omit<
  FormTextareaProps,
  'name' | 'inputProps' | keyof HookFormTextareaValidationAttributes
> & {
  name: Path<T>;
  rules?: HookFormRules<T>;
  error?: string;
} & HookFormTextareaValidationAttributes;

export function HookFormTextarea<T extends FieldValues>({
  id,
  name,
  rules,
  label,
  error,
  classNames,
  disabled,
  required,
  maxLength,
  minLength,
  ...rest
}: HookFormTextareaProps<T>) {
  const methods = useFormContext<T>();
  if (!methods) return null;

  const {
    register,
    formState: { errors },
  } = methods;

  const fieldError = _get(errors, name);
  const errorMessage = error ?? (fieldError && String(fieldError?.message));
  const showError = !!fieldError && !disabled;
  const mergedRules = mergeHookFormRules(rules, { required, maxLength, minLength });

  return (
    <div className={cn('$hook-form-textarea', classNames?.wrapper)}>
      <FormTextarea
        {...rest}
        id={id}
        name={name}
        label={label}
        disabled={disabled}
        required={isValidationRuleEnabled(mergedRules?.required)}
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
