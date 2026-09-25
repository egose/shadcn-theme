import { inject, InjectionToken, type ValueProvider } from '@angular/core';
import type { ValidationErrors } from '@angular/forms';

/**
 * Factory for a single error message. Receives the validator's error params
 * (e.g. `{ requiredLength, actualLength }` for `minlength`) and the field label.
 */
export type EgFormErrorMessageFn = (params: Record<string, unknown>, label: string) => string;

/**
 * Dictionary of `ValidationErrors` key → message or message factory.
 * Custom validator keys (e.g. `usernameTaken`) are covered by adding entries
 * here, either globally via {@link provideEgFormErrorMessages} or per call.
 */
export type EgFormErrorMessages = Record<string, string | EgFormErrorMessageFn>;

/** Fallback label used when the field has no `label()` set. */
export const EG_FORM_DEFAULT_ERROR_LABEL = 'This field';

/** Canonical priority order for resolving the first displayed message. */
const ERROR_KEY_PRIORITY = ['required', 'requiredTrue', 'email', 'minlength', 'maxlength', 'min', 'max', 'pattern'];

/**
 * Default English messages for Angular's built-in validator error keys.
 * App-wide wording/i18n is customized via {@link provideEgFormErrorMessages}.
 */
export const DEFAULT_EG_FORM_ERROR_MESSAGES: EgFormErrorMessages = {
  required: (_, label) => `${label} is required`,
  requiredTrue: (_, label) => `${label} is required`,
  email: () => 'Please enter a valid email address',
  minlength: (params, label) => `${label} must be at least ${params?.['requiredLength']} characters`,
  maxlength: (params, label) => `${label} must be at most ${params?.['requiredLength']} characters`,
  min: (params, label) => `${label} must be at least ${params?.['min']}`,
  max: (params, label) => `${label} must be at most ${params?.['max']}`,
  pattern: (_, label) => `${label} is invalid`,
};

const EgFormErrorMessagesToken = new InjectionToken<EgFormErrorMessages>('EgFormErrorMessages');

/**
 * Overrides/adds error messages app-wide (e.g. custom validator keys or i18n).
 * Merged over {@link DEFAULT_EG_FORM_ERROR_MESSAGES} at injection time.
 *
 * ```ts
 * provideEgFormErrorMessages({ usernameTaken: 'This username is already taken' })
 * ```
 */
export function provideEgFormErrorMessages(messages: EgFormErrorMessages): ValueProvider {
  return { provide: EgFormErrorMessagesToken, useValue: { ...messages } };
}

/** Merged custom + default messages (defaults win only when not overridden). */
export function injectEgFormErrorMessages(): EgFormErrorMessages {
  return { ...DEFAULT_EG_FORM_ERROR_MESSAGES, ...(inject(EgFormErrorMessagesToken, { optional: true }) ?? {}) };
}

/**
 * Resolves the first displayable message for a `ValidationErrors` object.
 * Returns `undefined` when there are no errors. Unknown keys fall back to a
 * generic `${label} is invalid` message (or a custom dictionary entry).
 */
export function resolveEgFormError(
  errors: ValidationErrors | null | undefined,
  label?: string | null,
  messages: EgFormErrorMessages = DEFAULT_EG_FORM_ERROR_MESSAGES,
): string | undefined {
  if (!errors) return undefined;
  const keys = Object.keys(errors);
  if (keys.length === 0) return undefined;
  const resolvedLabel = label || EG_FORM_DEFAULT_ERROR_LABEL;
  const ordered = [
    ...ERROR_KEY_PRIORITY.filter((key) => key in errors),
    ...keys.filter((key) => !ERROR_KEY_PRIORITY.includes(key)),
  ];
  const key = ordered[0];
  const entry = messages[key];
  if (typeof entry === 'function') return entry((errors[key] ?? {}) as Record<string, unknown>, resolvedLabel);
  if (typeof entry === 'string') return entry;
  return `${resolvedLabel} is invalid`;
}
