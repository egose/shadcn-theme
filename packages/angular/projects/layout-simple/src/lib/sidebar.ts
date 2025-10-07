import { Component, effect, input, viewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrnSheet } from '@spartan-ng/brain/sheet';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';
import { HlmSheetImports } from '@egose/shadcn-theme-ng/sheet';

@Component({
  selector: 'eg-layout-simple-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, BrnSheetImports, HlmSheetImports, HlmButtonImports, HlmLabelImports],
  template: `
    @let _title = title();
    @let _content = content();

    <hlm-sheet [side]="side() ?? 'left'">
      <hlm-sheet-content *brnSheetContent="let ctx" class="tw:gap-0">
        @if (_title) {
          <hlm-sheet-header>
            <h3 hlmSheetTitle>{{ _title }}</h3>
          </hlm-sheet-header>
        }

        @if (_content) {
          <ng-container *ngTemplateOutlet="_content"></ng-container>
        }

        <hlm-sheet-footer>
          <button brnSheetClose hlmButton variant="secondary" appearance="outline-filled">Close</button>
        </hlm-sheet-footer>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class EgLayoutSimpleSidebar {
  public readonly viewchildSheetRef = viewChild(BrnSheet);
  side = input<'top' | 'bottom' | 'left' | 'right' | undefined>('left');
  title = input<string | undefined>('');
  content = input<TemplateRef<any> | undefined>();

  constructor() {
    effect(() => {});
  }

  openSheet() {
    this.viewchildSheetRef()?.open();
  }

  closeSheet() {
    this.viewchildSheetRef()?.close();
  }
}
