import React from 'react';
import _get from 'lodash-es/get';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { cn } from '../../utils/ui';
import { FormError } from './error';
import { FormCheckbox } from './checkbox';
import type { FormCheckboxProps } from './checkbox';
import { isValidationRuleEnabled, mergeHookFormRules } from './types';
import type { HookFormRules, HookFormValidationAttributes } from './types';

type HookFormCheckboxValidationAttributes = Pick<HookFormValidationAttributes, 'required'>;

type HookFormCheckboxProps<T extends FieldValues> = Omit<
  FormCheckboxProps,
  'name' | 'checked' | 'onCheckedChange' | keyof HookFormCheckboxValidationAttributes
> & {
  name: Path<T>;
  rules?: HookFormRules<T>;
  error?: string;
} & HookFormCheckboxValidationAttributes;

export function HookFormCheckbox<T extends FieldValues>({
  id,
  name,
  label,
  rules,
  required,
  error,
  disabled,
  classNames,
  ...rest
}: HookFormCheckboxProps<T>) {
  const methods = useFormContext<T>();
  if (!methods) return null;

  const {
    control,
    formState: { errors },
  } = methods;

  const fieldError = _get(errors, name);
  const errorMessage = error ?? (fieldError?.message as string);
  const showError = !!fieldError && !disabled;
  const mergedRules = mergeHookFormRules(rules, { required });

  return (
    <div className={cn('$hook-form-checkbox', classNames?.wrapper)}>
      <Controller
        name={name}
        control={control}
        rules={mergedRules}
        render={({ field: { value, onChange } }) => (
          <FormCheckbox
            {...rest}
            id={id}
            name={name}
            label={label}
            required={isValidationRuleEnabled(mergedRules?.required)}
            disabled={disabled}
            checked={value}
            onCheckedChange={onChange}
            classNames={{
              ...classNames,
              label: cn(classNames?.label, {
                'text-danger': showError,
              }),
              checkbox: cn(classNames?.checkbox, {
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
