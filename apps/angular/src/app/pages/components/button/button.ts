import { Component } from '@angular/core';
import { EgButton } from '@egose/shadcn-theme-ng/button';
import { NgIcon } from '@ng-icons/core';
import { tablerBrandAngular } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [EgButton, NgIcon],
  template: `
    <h1 class="font-bold text-2xl mt-4 mb-5">Button</h1>

    <ng-template #lefticon>
      <ng-icon [svg]="icon" />
    </ng-template>

    @for (section of sections; track section.title) {
      <div class="font-semibold mt-4">
        <h3>{{ section.title }}</h3>
        <div class="flex gap-2">
          @for (v of variants; track v) {
            <button
              egBtn
              [variant]="v"
              [disabled]="section.disabled"
              [loading]="section.loading ?? false"
              [compact]="section.compact ?? false"
              [outline]="section.outline ?? false"
              [outlineFilled]="section.outlineFilled ?? false"
              [left]="section.icon ? lefticon : ''"
            >
              {{ v }}
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class ButtonPage {
  icon = tablerBrandAngular;

  variants = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'light',
    'dark',
    'link',
    'destructive',
    'accent',
    'muted',
  ] as const;

  sections = [
    { title: 'Basic' },
    { title: 'Basic - disabled', disabled: true },
    { title: 'Basic - loading', loading: true },
    { title: 'Basic - disabled - loading', disabled: true, loading: true },
    { title: 'Basic - compact', compact: true },
    { title: 'Outline', outline: true },
    { title: 'Outline - disabled', outline: true, disabled: true },
    { title: 'Outline - loading', outline: true, loading: true },
    { title: 'Outline - disabled - loading', outline: true, disabled: true, loading: true },
    { title: 'Outline - compact', outline: true, compact: true },
    { title: 'Outline filled', outlineFilled: true },
    { title: 'Outline filled - disabled', outlineFilled: true, disabled: true },
    { title: 'Outline filled - loading', outlineFilled: true, loading: true },
    { title: 'Outline filled - disabled - loading', outlineFilled: true, disabled: true, loading: true },
    { title: 'Outline filled - compact', outlineFilled: true, compact: true },
    { title: 'Icon', icon: true },
  ];
}
