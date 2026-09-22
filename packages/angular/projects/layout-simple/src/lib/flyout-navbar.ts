import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { _IdGenerator } from '@angular/cdk/a11y';
import { NavigationEnd, Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { lucideChevronDown, lucideX } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { EgLayoutNavigationItem } from './navigation-item';
import { navigationMatchOptions, type FlyoutMenuGroup } from './navigation';

/** Internal disclosure navigation: native links, normal Tab order, no application-menu roles. */
@Component({
  selector: 'eg-layout-flyout-navbar',
  imports: [NgIcon, EgLayoutNavigationItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw:relative tw:z-20 tw:block tw:min-w-0',
    '(document:pointerdown)': 'closeOnOutsidePointer($event)',
    '(focusout)': 'closeOnFocusOut($event)',
    '(keydown.escape)': 'onEscape($event)',
  },
  template: `
    <nav [attr.aria-label]="label()" [class]="navbarClasses()">
      @for (group of groups(); track $index; let index = $index) {
        <button
          #trigger
          type="button"
          [id]="id + '-trigger-' + index"
          [attr.aria-controls]="id + '-panel-' + index"
          [attr.aria-expanded]="openIndex() === index"
          [disabled]="!group.items.length"
          (click)="toggle(index)"
          (keydown)="onTriggerKeydown($event, index)"
          [attr.data-active]="activeGroups()[index] ? '' : null"
          [class]="
            hlm(
              'tw:flex tw:min-h-11 tw:items-center tw:gap-2 tw:rounded-lg tw:px-3 tw:py-2 tw:text-left tw:text-sm tw:font-medium tw:text-foreground tw:cursor-pointer tw:hover:bg-foreground/5 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-ring tw:disabled:cursor-not-allowed tw:disabled:opacity-50',
              (openIndex() === index || activeGroups()[index]) && 'tw:bg-foreground/7 tw:font-semibold'
            )
          "
        >
          @if (group.icon) {
            <ng-icon [svg]="group.icon" size="1rem" aria-hidden="true" />
          }
          {{ group.label }}
          <ng-icon
            [svg]="chevronIcon"
            size="14px"
            aria-hidden="true"
            [class]="hlm('tw:shrink-0 tw:motion-safe:transition-transform', openIndex() === index && 'tw:rotate-180')"
          />
        </button>
        @if (openIndex() === index) {
          <section
            #panel
            [id]="id + '-panel-' + index"
            [attr.aria-labelledby]="id + '-trigger-' + index"
            data-slot="flyout-panel"
            [class]="panelClasses()"
          >
            <div class="tw:mb-4 tw:flex tw:items-start tw:justify-between tw:gap-4">
              <div class="tw:space-y-1">
                <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-foreground/75">
                  {{ group.label }}
                </p>
                @if (group.description) {
                  <p class="tw:max-w-2xl tw:text-sm tw:leading-relaxed tw:text-foreground/75">
                    {{ group.description }}
                  </p>
                }
              </div>
              <button
                type="button"
                [attr.aria-label]="closeLabel()"
                (click)="close(true)"
                class="tw:inline-flex tw:size-11 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:text-foreground/75 tw:cursor-pointer tw:hover:bg-foreground/5 tw:focus-visible:outline-2 tw:focus-visible:outline-ring"
              >
                <ng-icon [svg]="closeIcon" size="18px" aria-hidden="true" />
              </button>
            </div>
            <div class="tw:grid tw:grid-cols-2 tw:gap-3 tw:lg:grid-cols-3">
              @for (item of group.items; track $index) {
                <eg-layout-navigation-item
                  [item]="item"
                  appearance="card"
                  [itemClass]="itemClass()"
                  (selected)="close(true)"
                />
              }
            </div>
          </section>
        }
      }
    </nav>
  `,
})
export class EgLayoutFlyoutNavbar {
  readonly groups = input.required<readonly FlyoutMenuGroup[]>();
  readonly label = input('Fly-out navigation');
  readonly closeLabel = input('Close navigation panel');
  readonly navbarClass = input<ClassValue>('');
  readonly panelClass = input<ClassValue>('');
  readonly itemClass = input<ClassValue>('');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  private readonly currentUrl = signal(this.router.url);
  private readonly triggers = viewChildren<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  protected readonly id = inject(_IdGenerator).getId('eg-layout-flyout-');
  protected readonly hlm = hlm;
  protected readonly chevronIcon = lucideChevronDown;
  protected readonly closeIcon = lucideX;
  protected readonly openIndex = signal<number | null>(null);
  protected readonly navbarClasses = computed(() =>
    hlm(
      'tw:flex tw:flex-wrap tw:items-center tw:gap-1 tw:border-b tw:border-border tw:bg-background tw:px-4 tw:py-2 tw:sm:px-6',
      this.navbarClass(),
    ),
  );
  protected readonly panelClasses = computed(() =>
    hlm(
      'tw:absolute tw:inset-x-0 tw:top-full tw:max-h-[min(70dvh,36rem)] tw:overflow-y-auto tw:overscroll-contain tw:rounded-b-2xl tw:border tw:border-t-0 tw:border-border tw:bg-background tw:p-5 tw:text-foreground tw:shadow-xl tw:sm:p-6',
      this.panelClass(),
    ),
  );
  protected readonly activeGroups = computed(() => {
    this.currentUrl();
    return this.groups().map((group) =>
      group.items.some(
        (item) => item.link && !item.disabled && this.router.isActive(item.link, navigationMatchOptions(item)),
      ),
    );
  });

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
        this.close();
      }
    });
    effect(() => {
      this.groups();
      this.close();
    });
  }

  protected toggle(index: number): void {
    this.openIndex.update((open) => (open === index ? null : index));
  }

  protected close(restoreFocus = false): void {
    const index = restoreFocus ? this.openIndex() : null;
    this.openIndex.set(null);
    if (restoreFocus && index !== null) this.triggers()[index]?.nativeElement.focus();
  }

  protected closeOnOutsidePointer(event: PointerEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  protected closeOnFocusOut(event: FocusEvent): void {
    if (!this.host.nativeElement.contains(event.relatedTarget as Node | null)) this.close();
  }

  protected onEscape(event: Event): void {
    if (this.openIndex() === null) return;
    event.preventDefault();
    event.stopPropagation();
    this.close(true);
  }

  protected onTriggerKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.openIndex.set(index);
      afterNextRender(
        () => {
          const items = this.panel()?.nativeElement.querySelectorAll<HTMLElement>(
            'eg-layout-navigation-item a, eg-layout-navigation-item button:not(:disabled)',
          );
          const position = event.key === 'ArrowUp' ? (items?.length ?? 0) - 1 : 0;
          items?.[position]?.focus();
        },
        { injector: this.injector },
      );
      return;
    }
    const triggers = this.triggers()
      .map((trigger) => trigger.nativeElement)
      .filter((trigger) => !trigger.disabled);
    const current = triggers.indexOf(event.currentTarget as HTMLButtonElement);
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
        next = (current + 1) % triggers.length;
        break;
      case 'ArrowLeft':
        next = (current - 1 + triggers.length) % triggers.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = triggers.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.close();
    triggers[next]?.focus();
  }
}
