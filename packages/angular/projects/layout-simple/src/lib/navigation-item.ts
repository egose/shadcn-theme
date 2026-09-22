import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import type { ClassValue } from 'clsx';
import { NgIcon } from '@ng-icons/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { navigationMatchOptions, type MenuItem } from './navigation';

/** Internal shared renderer keeps desktop, mobile, and footer navigation consistent. */
@Component({
  selector: 'eg-layout-navigation-item',
  imports: [RouterLink, RouterLinkActive, NgIcon, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'tw:block tw:min-w-0 tw:shrink-0' },
  template: `
    @let entry = item();
    @if (entry.link && !entry.disabled) {
      <a
        [routerLink]="entry.link"
        [routerLinkActive]="activeClasses"
        [routerLinkActiveOptions]="matchOptions()"
        ariaCurrentWhenActive="page"
        [class]="classes()"
        (click)="selected.emit(entry)"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </a>
    } @else {
      <button type="button" [class]="classes()" [disabled]="entry.disabled || !entry.action" (click)="activate()">
        <ng-container [ngTemplateOutlet]="content" />
      </button>
    }
    <ng-template #content>
      @if (entry.icon) {
        <ng-icon
          [svg]="entry.icon"
          [size]="appearance() === 'card' ? '1.25rem' : '1rem'"
          aria-hidden="true"
          class="tw:shrink-0"
        />
      }
      <span class="tw:min-w-0">
        <span class="tw:block">{{ entry.label }}</span>
        @if (appearance() === 'card' && entry.description) {
          <span class="tw:mt-1.5 tw:block tw:text-sm tw:font-normal tw:leading-relaxed tw:text-foreground/75">{{
            entry.description
          }}</span>
        }
      </span>
    </ng-template>
  `,
})
export class EgLayoutNavigationItem {
  readonly item = input.required<MenuItem>();
  readonly itemClass = input<ClassValue>('');
  readonly appearance = input<'link' | 'card'>('link');
  readonly selected = output<MenuItem>();
  protected readonly activeClasses =
    'tw:bg-foreground/10 tw:font-semibold tw:underline tw:decoration-2 tw:underline-offset-4';
  protected readonly classes = computed(() =>
    hlm(
      'tw:flex tw:min-h-11 tw:w-full tw:items-center tw:gap-2 tw:rounded-lg tw:px-3 tw:py-2 tw:text-left tw:text-sm tw:font-medium tw:text-foreground tw:no-underline tw:cursor-pointer tw:motion-safe:transition-colors tw:hover:bg-foreground/5 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-ring tw:disabled:cursor-not-allowed tw:disabled:opacity-50',
      this.appearance() === 'card' &&
        'tw:h-full tw:min-h-11 tw:md:min-h-24 tw:flex-col tw:items-start tw:justify-between tw:gap-5 tw:rounded-xl tw:border tw:border-transparent tw:bg-foreground/3 tw:p-4 tw:font-semibold tw:break-words tw:hover:border-border tw:hover:bg-foreground/7',
      this.itemClass(),
      this.item().class,
    ),
  );
  protected readonly matchOptions = computed(() => navigationMatchOptions(this.item()));

  protected activate(): void {
    const item = this.item();
    if (item.disabled || !item.action) return;
    item.action();
    this.selected.emit(item);
  }
}
