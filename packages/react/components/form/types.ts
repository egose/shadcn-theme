import { FieldValues, Message, Path, RegisterOptions, ValidationRule } from 'react-hook-form';

/**
 * Subset of `react-hook-form`'s `RegisterOptions` that is safe to pass to the
 * form-field components in `@egose/shadcn-theme/components/form/*`. Excludes
 * the value-transform options (`valueAsNumber`, `valueAsDate`, `setValueAs`)
 * and `disabled`, since those are handled by the form-field wrappers.
 */
export type HookFormRules<T extends FieldValues> = Omit<
  RegisterOptions<T, Path<T>>,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
>;

export interface HookFormValidationAttributes {
  required?: Message | ValidationRule<boolean>;
  min?: ValidationRule<number | string>;
  max?: ValidationRule<number | string>;
  maxLength?: ValidationRule<number>;
  minLength?: ValidationRule<number>;
}

export function mergeHookFormRules<T extends FieldValues>(
  rules: HookFormRules<T> | undefined,
  overrides: Partial<HookFormValidationAttributes>,
) {
  const mergedRules: HookFormRules<T> = { ...(rules ?? {}) };

  if (overrides.required !== undefined) mergedRules.required = overrides.required;
  if (overrides.min !== undefined) mergedRules.min = overrides.min;
  if (overrides.max !== undefined) mergedRules.max = overrides.max;
  if (overrides.maxLength !== undefined) mergedRules.maxLength = overrides.maxLength;
  if (overrides.minLength !== undefined) mergedRules.minLength = overrides.minLength;

  return Object.keys(mergedRules).length > 0 ? mergedRules : undefined;
}

export function isValidationRuleEnabled(rule: HookFormValidationAttributes['required']) {
  if (typeof rule === 'boolean') return rule;
  if (typeof rule === 'string') return rule.length > 0;
  return rule?.value === true;
}

export function getValidationRuleValue<T extends number | string>(rule?: ValidationRule<T>) {
  if (rule && typeof rule === 'object') return rule.value;
  return rule;
}
