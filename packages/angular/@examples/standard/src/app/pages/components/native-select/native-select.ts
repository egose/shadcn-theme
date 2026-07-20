import { Component } from '@angular/core';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';

@Component({
  selector: 'app-native-select-page',
  imports: [HlmNativeSelectImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Native Select</h3>
    <p class="tw:text-gray-500 tw:mb-4">A styled native HTML select.</p>

    <hlm-native-select>
      <option value="" disabled>Select a fruit</option>
      <option value="apple" selected>Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
    </hlm-native-select>
  `,
})
export class NativeSelectPage {}
