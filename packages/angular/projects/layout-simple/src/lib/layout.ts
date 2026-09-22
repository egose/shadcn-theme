import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { _IdGenerator } from '@angular/cdk/a11y';
import type { ClassValue } from 'clsx';
import { NgIcon } from '@ng-icons/core';
import { lucideMenu, lucidePanelLeft, lucideX, lucideChevronDown } from '@ng-icons/lucide';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { HlmDropdownMenu, HlmDropdownMenuItem, HlmDropdownMenuTrigger } from '@egose/shadcn-theme-ng/dropdown-menu';
import { EgLayoutSimpleUserMenu, type UserMenuSection } from './user-menu';
import { EgLayoutSearch, type LayoutSearchLoader, type LayoutSearchResultContext } from './search';
import { EgLayoutSimpleSidebar } from './sidebar';
import { EgLayoutSimpleMobileMenuGroup } from './mobile-menu-group';
import { EgLayoutNavigationItem } from './navigation-item';
import { EgLayoutFlyoutNavbar } from './flyout-navbar';
import { navigationMatchOptions, type MenuItem, type MenuGroup, type FlyoutMenuGroup } from './navigation';

export type { MenuItem, MenuGroup, FlyoutMenuGroup } from './navigation';

/** Matches Tailwind's default `md` breakpoint. */
export const EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT = '(max-width: 767.98px)';

/** Responsive application shell. All navigation surfaces share the same item model. */
@Component({
  selector: 'eg-layout-simple',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    NgIcon,
    EgLayoutSimpleUserMenu,
    EgLayoutSimpleSidebar,
    EgLayoutSimpleMobileMenuGroup,
    EgLayoutSearch,
    EgLayoutNavigationItem,
    EgLayoutFlyoutNavbar,
    HlmDropdownMenu,
    HlmDropdownMenuItem,
    HlmDropdownMenuTrigger,
  ],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'tw:block tw:min-w-0' },
})
export class EgLayoutSimple<TItem = unknown> {
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly instanceId = inject(_IdGenerator).getId('eg-layout-simple-');
  protected readonly mainId = `${this.instanceId}-main`;
  protected readonly mobileMenuId = `${this.instanceId}-mobile-menu`;
  protected readonly sidebarId = `${this.instanceId}-sidebar`;
  protected readonly hlm = hlm;
  protected readonly navigationMatchOptions = navigationMatchOptions;
  protected readonly menuIcon = lucideMenu;
  protected readonly sidebarIcon = lucidePanelLeft;
  protected readonly closeIcon = lucideX;
  protected readonly chevronIcon = lucideChevronDown;
  protected readonly mobileMenuTrigger = viewChild<ElementRef<HTMLButtonElement>>('mobileMenuTrigger');
  protected readonly mainContent = viewChild<ElementRef<HTMLElement>>('mainContent');
  protected readonly sidebar = viewChild(EgLayoutSimpleSidebar);

  readonly sidebarEnabled = input(false);
  readonly sidebarTitle = input('Navigation');
  readonly sidebarContent = input<TemplateRef<unknown>>();
  readonly sidebarToggleLabel = input('Open navigation sidebar');
  readonly mobileMenuLabel = input('Open navigation menu');
  readonly mobileMenuCloseLabel = input('Close navigation menu');
  readonly userMenuTrigger = input<TemplateRef<unknown>>();
  readonly userMenuLabel = input('Open account menu');

  /** Main header destinations; use `activeMatch: 'prefix'` for whole sections. */
  readonly primaryNavigation = input<readonly MenuItem[]>([]);
  readonly navigationGroups = input<readonly MenuGroup[]>([]);
  readonly utilityNavigation = input<readonly MenuItem[]>([]);
  readonly sectionNavigation = input<readonly MenuItem[]>([]);
  readonly secondaryNavigationGroups = input<readonly MenuGroup[]>([]);
  /** Category navbar with wide card panels; mobile renders expandable groups. */
  readonly flyoutNavigationGroups = input<readonly FlyoutMenuGroup[]>([]);
  readonly flyoutNavigationLabel = input('Fly-out navigation');
  readonly flyoutCloseLabel = input('Close navigation panel');
  readonly userMenuSections = input<readonly UserMenuSection[]>([]);
  /** Optional image. Without it, the brand name is shown instead of a broken image. */
  readonly logo = input('');
  readonly brandName = input('Workspace');
  readonly logoLink = input('/');
  readonly logoClass = input<ClassValue>('');
  /** Disable for a shell preview embedded inside another page. */
  readonly fullHeight = input(true);
  readonly headerClass = input<ClassValue>('');
  readonly contentClass = input<ClassValue>('');
  readonly primaryNavigationClass = input<ClassValue>('');
  readonly utilityNavigationClass = input<ClassValue>('');
  readonly sectionNavigationClass = input<ClassValue>('');
  readonly secondaryNavigationClass = input<ClassValue>('');
  readonly flyoutNavigationClass = input<ClassValue>('');
  readonly flyoutPanelClass = input<ClassValue>('');
  readonly navigationItemClass = input<ClassValue>('');
  readonly loading = input(false);
  readonly loadingText = input('Loading content…');
  readonly skipLinkText = input('Skip to content');

  readonly searchEnabled = input(false);
  readonly searchPlaceholder = input('Search pages…');
  readonly searchEmptyText = input('No matching pages found.');
  readonly searchErrorText = input('Search is unavailable. Please try again.');
  readonly searchResultTemplate = input<TemplateRef<LayoutSearchResultContext<TItem>>>();
  readonly searchLoader = input<LayoutSearchLoader<TItem>>();
  readonly searchResultLabel = input<(item: TItem) => string>();
  readonly searchResultSelected = output<TItem>();

  readonly footerEnabled = input(false);
  readonly footerNavigation = input<readonly MenuItem[]>([]);
  readonly footerText = input('');
  readonly footerClass = input<ClassValue>('');

  protected readonly logoClasses = computed(() =>
    hlm('tw:h-8 tw:w-auto tw:max-w-40 tw:object-contain', this.logoClass()),
  );
  protected readonly headerClasses = computed(() =>
    hlm(
      'tw:flex tw:min-h-16 tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:border-b tw:border-border tw:bg-background tw:px-4 tw:py-3 tw:sm:px-6',
      this.headerClass(),
    ),
  );
  protected readonly contentClasses = computed(() =>
    hlm('tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:p-4 tw:outline-none tw:sm:p-6', this.contentClass()),
  );
  protected readonly primaryNavigationClasses = computed(() =>
    hlm('tw:hidden tw:md:flex tw:flex-wrap tw:items-center tw:gap-1', this.primaryNavigationClass()),
  );
  protected readonly utilityNavigationClasses = computed(() =>
    hlm('tw:hidden tw:md:flex tw:flex-wrap tw:items-center tw:gap-1', this.utilityNavigationClass()),
  );
  protected readonly sectionNavigationClasses = computed(() =>
    hlm(
      'tw:hidden tw:md:flex tw:items-center tw:gap-1 tw:overflow-x-auto tw:border-b tw:border-border tw:bg-background tw:px-4 tw:py-2 tw:sm:px-6',
      this.sectionNavigationClass(),
    ),
  );
  protected readonly secondaryNavigationClasses = computed(() =>
    hlm(
      'tw:hidden tw:md:flex tw:items-center tw:gap-5 tw:overflow-x-auto tw:border-b tw:border-border tw:bg-foreground/3 tw:px-4 tw:py-2 tw:sm:px-6',
      this.secondaryNavigationClass(),
    ),
  );
  protected readonly footerClasses = computed(() =>
    hlm(
      'tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-x-6 tw:gap-y-2 tw:border-t tw:border-border tw:bg-background tw:px-4 tw:py-4 tw:text-sm tw:text-foreground/75 tw:sm:px-6',
      this.footerClass(),
    ),
  );
  protected readonly iconButtonClasses =
    'tw:inline-flex tw:size-11 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-border tw:bg-background tw:text-foreground tw:cursor-pointer tw:hover:bg-foreground/5 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-ring';
  protected readonly mobileMenuOpen = signal(false);
  protected readonly isMobile = signal(false);
  protected readonly sidebarOpen = signal(false);
  protected readonly sidebarContext = { close: () => this.closeSidebar() };

  constructor() {
    this.breakpointObserver
      .observe([EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ matches }) => {
        this.isMobile.set(matches);
        if (!matches) this.mobileMenuOpen.set(false);
      });

    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.mobileMenuOpen()) this.closeMobileMenu(true);
        this.closeSidebar();
      }
    });

    effect((onCleanup) => {
      const sheet = this.sidebar()?.sheet();
      if (!sheet) return;
      this.sidebarOpen.set(sheet.stateComputed() === 'open');
      const subscriptions = [
        sheet.stateChanged.subscribe((state: string) => this.sidebarOpen.set(state === 'open')),
        sheet.closed.subscribe(() => this.sidebarOpen.set(false)),
      ];
      onCleanup(() => subscriptions.forEach((subscription) => subscription.unsubscribe()));
    });
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(restoreFocus = false): void {
    this.mobileMenuOpen.set(false);
    if (restoreFocus) this.mobileMenuTrigger()?.nativeElement.focus();
  }

  protected selectSearchResult(item: TItem): void {
    this.closeMobileMenu(true);
    this.searchResultSelected.emit(item);
  }

  protected focusContent(event: Event): void {
    event.preventDefault();
    this.mainContent()?.nativeElement.focus();
  }

  openSidebar(): void {
    this.closeMobileMenu();
    this.sidebar()?.open();
  }

  closeSidebar(): void {
    this.sidebar()?.close();
  }
}
