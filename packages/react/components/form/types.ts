import { Path, RegisterOptions, FieldValues } from 'react-hook-form';

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
