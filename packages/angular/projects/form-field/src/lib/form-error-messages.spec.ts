import { TestBed } from '@angular/core/testing';
import { configureLibraryTestBed } from '../../../../test/setup';
import {
  DEFAULT_EG_FORM_ERROR_MESSAGES,
  EG_FORM_DEFAULT_ERROR_LABEL,
  injectEgFormErrorMessages,
  provideEgFormErrorMessages,
  resolveEgFormError,
} from './form-error-messages';

describe('resolveEgFormError', () => {
  it('returns undefined when there are no errors', () => {
    expect(resolveEgFormError(null, 'Name')).toBeUndefined();
    expect(resolveEgFormError(undefined, 'Name')).toBeUndefined();
    expect(resolveEgFormError({}, 'Name')).toBeUndefined();
  });

  it('resolves built-in keys with the field label', () => {
    expect(resolveEgFormError({ required: true }, 'Name')).toBe('Name is required');
    expect(resolveEgFormError({ requiredTrue: true }, 'Agreed')).toBe('Agreed is required');
    expect(resolveEgFormError({ email: true }, 'Email')).toBe('Please enter a valid email address');
    expect(resolveEgFormError({ minlength: { requiredLength: 3, actualLength: 1 } }, 'Name')).toBe(
      'Name must be at least 3 characters',
    );
    expect(resolveEgFormError({ maxlength: { requiredLength: 5, actualLength: 9 } }, 'Name')).toBe(
      'Name must be at most 5 characters',
    );
    expect(resolveEgFormError({ min: { min: 18, actual: 3 } }, 'Age')).toBe('Age must be at least 18');
    expect(resolveEgFormError({ max: { max: 99, actual: 120 } }, 'Age')).toBe('Age must be at most 99');
    expect(resolveEgFormError({ pattern: { requiredPattern: '^a+$', actualValue: 'b' } }, 'Code')).toBe(
      'Code is invalid',
    );
  });

  it('falls back to the default label when none is given', () => {
    expect(resolveEgFormError({ required: true })).toBe(`${EG_FORM_DEFAULT_ERROR_LABEL} is required`);
    expect(resolveEgFormError({ required: true }, '')).toBe(`${EG_FORM_DEFAULT_ERROR_LABEL} is required`);
  });

  it('prefers the canonical priority order over object key order', () => {
    expect(resolveEgFormError({ email: true, required: true }, 'Name')).toBe('Name is required');
    expect(resolveEgFormError({ pattern: true, minlength: { requiredLength: 3 } }, 'Name')).toBe(
      'Name must be at least 3 characters',
    );
  });

  it('falls back to a generic message for unknown keys', () => {
    expect(resolveEgFormError({ usernameTaken: true }, 'Username')).toBe('Username is invalid');
  });

  it('supports custom dictionary entries (string and factory)', () => {
    expect(resolveEgFormError({ usernameTaken: true }, 'Username', { usernameTaken: 'Taken!' })).toBe('Taken!');
    expect(
      resolveEgFormError({ usernameTaken: { suggestion: 'ada2' } }, 'Username', {
        usernameTaken: (params, label) => `${label}: try ${params['suggestion']}`,
      }),
    ).toBe('Username: try ada2');
  });

  it('lets custom entries override built-in defaults', () => {
    expect(
      resolveEgFormError({ required: true }, 'Name', { ...DEFAULT_EG_FORM_ERROR_MESSAGES, required: 'Pick one' }),
    ).toBe('Pick one');
  });
});

describe('provideEgFormErrorMessages', () => {
  it('merges custom messages over the defaults at injection time', () => {
    configureLibraryTestBed([provideEgFormErrorMessages({ usernameTaken: 'This username is already taken' })]);
    const injected = TestBed.runInInjectionContext(() => injectEgFormErrorMessages());
    expect(injected['usernameTaken']).toBe('This username is already taken');
    expect(injected['required']).toBe(DEFAULT_EG_FORM_ERROR_MESSAGES['required']);
  });

  it('returns the defaults when no provider is configured', () => {
    configureLibraryTestBed();
    const injected = TestBed.runInInjectionContext(() => injectEgFormErrorMessages());
    expect(injected).toEqual(DEFAULT_EG_FORM_ERROR_MESSAGES);
    expect(injected).not.toBe(DEFAULT_EG_FORM_ERROR_MESSAGES);
  });
});
