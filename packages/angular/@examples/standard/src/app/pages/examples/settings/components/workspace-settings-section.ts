import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { SETTINGS_PLANS } from '../settings-fixtures';
import type { WorkspaceSettingsForm } from '../settings-types';
import { SettingsSectionComponent } from './settings-section';

@Component({
  selector: 'app-workspace-settings-section',
  imports: [ReactiveFormsModule, HlmInput, HlmLabel, HlmNativeSelectImports, SettingsSectionComponent],
  templateUrl: './workspace-settings-section.html',
})
export class WorkspaceSettingsSectionComponent {
  readonly form = input.required<WorkspaceSettingsForm>();
  protected readonly plans = SETTINGS_PLANS;

  protected workspaceNameError(): string | null {
    const control = this.form().controls.workspaceName;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter a workspace name';
    if (control.hasError('minlength')) return 'Use at least 2 characters for the workspace name';
    return 'Enter a valid workspace name';
  }

  protected slugError(): string | null {
    const control = this.form().controls.slug;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter a workspace slug';
    if (control.hasError('pattern')) return 'Use lowercase letters, numbers, and hyphens only';
    return 'Enter a valid workspace slug';
  }
}
