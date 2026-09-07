import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmContextMenuImports } from '@egose/shadcn-theme-ng/context-menu';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';

@Component({
  selector: 'app-context-menu-page',
  imports: [DemoHeaderComponent, HlmContextMenuImports, HlmDropdownMenuImports],
  template: `
    <app-demo-header
      title="Context Menu"
      description="Right-click to open a context menu. Choosing an action records a visible outcome below."
    />

    <div
      [hlmContextMenuTrigger]="menu"
      class="tw:flex tw:h-40 tw:w-full tw:items-center tw:justify-center tw:rounded-md tw:border tw:border-dashed tw:text-sm tw:text-gray-500"
    >
      Right-click here
    </div>

    <ng-template #menu>
      <div hlmDropdownMenu>
        <button hlmDropdownMenuItem type="button" (click)="choose('Cut')">Cut</button>
        <button hlmDropdownMenuItem type="button" (click)="choose('Copy')">Copy</button>
        <button hlmDropdownMenuItem type="button" (click)="choose('Paste')">Paste</button>
      </div>
    </ng-template>

    @if (menuMessage()) {
      <p role="status" class="tw:mt-4 tw:text-sm tw:text-slate-600">{{ menuMessage() }}</p>
    }
  `,
})
export class ContextMenuPage {
  readonly menuMessage = signal<string | null>(null);

  choose(label: string) {
    this.menuMessage.set(`${label} selected from the context menu.`);
  }
}
