import { Component, input, output } from '@angular/core';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { EXAMPLE_READ_ONLY_MESSAGE } from '../../../../shared/real-examples/example-view-state';
import { SettingsSectionComponent } from './settings-section';

@Component({
  selector: 'app-danger-zone-section',
  imports: [HlmButton, SettingsSectionComponent],
  templateUrl: './danger-zone-section.html',
})
export class DangerZoneSectionComponent {
  readonly readOnly = input(false);
  readonly busy = input(false);
  readonly leaveWorkspace = output<void>();
  readonly deleteWorkspace = output<void>();
  protected readonly readOnlyMessage = EXAMPLE_READ_ONLY_MESSAGE;
}
