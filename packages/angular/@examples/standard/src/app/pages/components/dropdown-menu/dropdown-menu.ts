import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-dropdown-menu-page',
  imports: [DemoHeaderComponent, HlmDropdownMenuImports, HlmButton],
  template: `
    <app-demo-header
      title="Dropdown Menu"
      description="A menu triggered by a button. Choosing an item records a visible outcome below."
    />

    <div hlmDropdownMenu>
      <button hlmButton [hlmDropdownMenuTrigger]="menu" type="button">Open</button>
      <ng-template #menu>
        <div hlmDropdownMenu>
          <div hlmDropdownMenuLabel>My Account</div>
          <div hlmDropdownMenuSeparator></div>
          <button hlmDropdownMenuItem type="button" (click)="choose('Profile')">Profile</button>
          <button hlmDropdownMenuItem type="button" (click)="choose('Settings')">Settings</button>
          <button hlmDropdownMenuItem type="button" (click)="choose('Keyboard shortcuts')">Keyboard shortcuts</button>
          <div hlmDropdownMenuSeparator></div>
          <button hlmDropdownMenuItem type="button" (click)="choose('Log out')">Log out</button>
        </div>
      </ng-template>
    </div>

    @if (menuMessage()) {
      <p role="status" class="tw:mt-4 tw:text-sm tw:text-slate-600">{{ menuMessage() }}</p>
    }
  `,
})
export class DropdownMenuPage {
  readonly menuMessage = signal<string | null>(null);

  choose(label: string) {
    this.menuMessage.set(`${label} selected from the account menu.`);
  }
}
