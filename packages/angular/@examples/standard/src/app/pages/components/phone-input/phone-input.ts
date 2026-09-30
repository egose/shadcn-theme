import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmPhoneInput } from '@egose/shadcn-theme-ng/phone-input';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';

@Component({
  selector: 'app-phone-input-page',
  imports: [ReactiveFormsModule, HlmButton, HlmPhoneInput, DemoHeaderComponent, DemoSectionComponent],
  templateUrl: './phone-input.html',
})
export class PhoneInputPage {
  // Empty edits emit null in both public model modes.
  readonly raw = new FormControl<string | null>('4155552671');
  readonly formatted = new FormControl<string | null>('(212) 555-0199');
  readonly readOnly = new FormControl<string | null>('4155552671');
  readonly disabled = new FormControl<string | null>({ value: '2125550199', disabled: true });

  reset(): void {
    this.raw.reset();
    this.formatted.reset();
  }
}
