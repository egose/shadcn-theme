import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import type { NotificationSettingsForm } from '../settings-types';
import { SettingsSectionComponent } from './settings-section';

@Component({
  selector: 'app-notification-settings-section',
  imports: [ReactiveFormsModule, HlmCheckbox, SettingsSectionComponent],
  templateUrl: './notification-settings-section.html',
})
export class NotificationSettingsSectionComponent {
  readonly form = input.required<NotificationSettingsForm>();
}
