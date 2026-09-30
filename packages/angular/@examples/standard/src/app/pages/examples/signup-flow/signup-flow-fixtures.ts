import type { SignupRole } from './signup-flow-types';

export const SIGNUP_ROLES: { label: string; value: SignupRole }[] = [
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Manager', value: 'manager' },
];

export const SIGNUP_ACCOUNT_DEFAULTS = { username: '', email: '' };
export const SIGNUP_PREFERENCES_DEFAULTS: { role: SignupRole | ''; acceptTerms: boolean } = {
  role: '',
  acceptTerms: false,
};

export const normalizeSignupEmail = (value: string): string => value.trim().toLowerCase();
export const isSignupRole = (value: unknown): value is SignupRole => SIGNUP_ROLES.some((role) => role.value === value);
export const signupRoleLabel = (value: string): string =>
  SIGNUP_ROLES.find((role) => role.value === value)?.label ?? 'Not selected';
