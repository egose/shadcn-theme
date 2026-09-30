import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { SETTINGS_TIMEZONES } from '../settings-fixtures';
import type { ProfileSettingsForm } from '../settings-types';
import { SettingsSectionComponent } from './settings-section';

@Component({
  selector: 'app-profile-settings-section',
  imports: [ReactiveFormsModule, HlmInput, HlmLabel, HlmNativeSelectImports, SettingsSectionComponent],
  templateUrl: './profile-settings-section.html',
})
export class ProfileSettingsSectionComponent {
  readonly form = input.required<ProfileSettingsForm>();
  protected readonly timezones = SETTINGS_TIMEZONES;

  protected displayNameError(): string | null {
    const control = this.form().controls.displayName;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter a display name';
    if (control.hasError('minlength')) return 'Use at least 2 characters for the display name';
    return 'Enter a valid display name';
  }

  protected emailError(): string | null {
    const control = this.form().controls.email;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter an email address';
    if (control.hasError('email')) return 'Enter a valid email like sam@example.com';
    return 'Enter a valid email address';
  }
}
