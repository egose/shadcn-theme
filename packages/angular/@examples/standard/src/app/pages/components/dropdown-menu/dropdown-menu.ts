import { Component } from '@angular/core';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-dropdown-menu-page',
  imports: [HlmDropdownMenuImports, HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Dropdown Menu</h3>
    <p class="tw:text-gray-500 tw:mb-4">A menu triggered by a button.</p>

    <div hlmDropdownMenu>
      <button hlmButton hlmDropdownMenuTrigger="menu" type="button">Open</button>
      <ng-template #menu>
        <div hlmDropdownMenu>
          <div hlmDropdownMenuLabel>My Account</div>
          <div hlmDropdownMenuSeparator></div>
          <button hlmDropdownMenuItem type="button">Profile</button>
          <button hlmDropdownMenuItem type="button">Settings</button>
          <button hlmDropdownMenuItem type="button">Keyboard shortcuts</button>
          <div hlmDropdownMenuSeparator></div>
          <button hlmDropdownMenuItem type="button">Log out</button>
        </div>
      </ng-template>
    </div>
  `,
})
export class DropdownMenuPage {}
