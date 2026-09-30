import type { FormControl, FormGroup } from '@angular/forms';

export type SignupRole = 'developer' | 'designer' | 'manager';

export interface SignupSubmission {
  readonly username: string;
  readonly email: string;
  readonly role: SignupRole;
  readonly acceptTerms: true;
}

export type SignupAccountForm = FormGroup<{
  username: FormControl<string>;
  email: FormControl<string>;
}>;

export type SignupPreferencesForm = FormGroup<{
  role: FormControl<SignupRole | ''>;
  acceptTerms: FormControl<boolean>;
}>;
