import { ChangeDetectionStrategy, Component, input, viewChild, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BrnSheet, BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmSheetImports } from '@egose/shadcn-theme-ng/sheet';

@Component({
  selector: 'eg-layout-simple-sidebar',
  imports: [NgTemplateOutlet, BrnSheetImports, HlmSheetImports, HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-sheet [id]="panelId()" side="left">
      <hlm-sheet-content
        *brnSheetContent="let context"
        class="tw:flex tw:h-full tw:max-w-[calc(100vw-2rem)] tw:flex-col tw:gap-0"
      >
        <hlm-sheet-header class="tw:shrink-0 tw:border-b tw:border-border tw:pr-12">
          <h2 hlmSheetTitle>{{ title() }}</h2>
        </hlm-sheet-header>
        <div class="tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:overscroll-contain tw:p-4">
          <ng-container [ngTemplateOutlet]="content() ?? null" [ngTemplateOutletContext]="contentContext()" />
        </div>
        <hlm-sheet-footer class="tw:shrink-0 tw:border-t tw:border-border">
          <button type="button" brnSheetClose hlmButton variant="secondary" appearance="outline">
            Close navigation
          </button>
        </hlm-sheet-footer>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class EgLayoutSimpleSidebar {
  readonly sheet = viewChild(BrnSheet);
  readonly panelId = input.required<string>();
  readonly title = input('Navigation');
  readonly content = input<TemplateRef<unknown>>();
  readonly contentContext = input<object | null>(null);

  open(): void {
    this.sheet()?.open();
  }
  close(): void {
    this.sheet()?.close();
  }
}
