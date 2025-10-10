import { Component, input, output, computed, signal, viewChild, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ClassValue } from 'clsx';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { HlmAutocompleteOption } from '@egose/shadcn-theme-ng/autocomplete';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmMenu } from '@egose/shadcn-theme-ng/menu';
import { EgLayoutSimpleUserMenu, type UserMenuSection } from './user-menu';
import { EgGenericAutocomplete } from './search';
import { EgLayoutSimpleSidebar } from './sidebar';
import { EgLayoutSimpleMobileMenuGroup } from './mobile-menu-group';

// Updated interface for left/right menu items
export interface MenuItem {
  label: string;
  icon?: any;
  link?: string; // optional router link
  action?: () => void; // optional click handler
  class?: string; // optional per-item CSS/Tailwind classes
}

const commonLinkGroupClasses = 'tw:hidden tw:md:flex tw:space-x-4 tw:items-center';
const commonLinkClasses =
  'tw:text-left tw:text-secondary tw:visited:text-secondary tw:hover:text-primary tw:cursor-pointer tw:no-underline';

@Component({
  selector: 'eg-layout-simple',
  standalone: true,
  imports: [
    RouterLink,
    EgLayoutSimpleUserMenu,
    EgLayoutSimpleSidebar,
    EgLayoutSimpleMobileMenuGroup,
    EgGenericAutocomplete,
    HlmButton,
    HlmMenu,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideMenu,
    }),
  ],
  templateUrl: './layout.html',
})
export class EgLayoutSimple<TItem, TParams extends object = { search: string }> {
  hlm = hlm;
  menuIcon = lucideMenu;

  sidebarEnabled = input<boolean>(false);
  sidebarTitle = input<string>('Menu');
  sidebarContent = input<TemplateRef<any> | undefined>();
  userMenuTrigger = input<TemplateRef<any> | undefined>();

  /** Menu data inputs */
  leftMenus = input<MenuItem[]>([]);
  rightMenus = input<MenuItem[]>([]);
  userMenus = input<UserMenuSection[]>([]);
  logo = input<string>('assets/logo.png');
  logoLink = input<string>('/');

  logoClass = input<ClassValue>('', { alias: 'logoClass' });
  headerClass = input<ClassValue>('', { alias: 'headerClass' });
  contentClass = input<ClassValue>('', { alias: 'contentClass' });
  contentBottomClass = input<ClassValue>('', { alias: 'contentBottomClass' });

  /** Container class inputs */
  leftMenuClass = input<ClassValue>('', { alias: 'leftClass' });
  rightMenuClass = input<ClassValue>('', { alias: 'rightClass' });

  /** Link/button base class inputs */
  leftLinkClass = input<ClassValue>('', { alias: 'leftLinkClass' });
  rightLinkClass = input<ClassValue>('', { alias: 'rightLinkClass' });

  searchEnabled = input<boolean>(false);
  loading = input<boolean>(false);
  searchPlaceholderText = input<string>('Select an page');
  searchEmptyText = input<string>('No pages found');
  searchOptionTemplate = input<TemplateRef<HlmAutocompleteOption<TItem>>>();
  searchLoaderFn = input<(params: TParams) => Promise<TItem[]>>();
  searchTransformValueToSearch = input<(value: TItem) => string>();

  public readonly searchOptionChange = output<TItem>();

  protected readonly _logoClass = computed(() => hlm('tw:h-10', this.logoClass()));

  protected readonly _headerClass = computed(() =>
    hlm(
      'tw:px-4 tw:py-2 tw:flex tw:items-center tw:justify-between tw:bg-gray-100 tw:border-b tw:border-gray-300',
      this.headerClass(),
    ),
  );

  protected readonly _contentClass = computed(() => hlm('tw:p-4 tw:flex tw:flex-col tw:flex-1', this.contentClass()));
  protected readonly _contentBottomClass = computed(() => hlm('tw:flex-1', this.contentBottomClass()));

  /** Computed merged classes for containers */
  protected readonly _computedLeftClass = computed(() => hlm(commonLinkGroupClasses, this.leftMenuClass()));
  protected readonly _computedRightClass = computed(() => hlm(commonLinkGroupClasses, this.rightMenuClass()));

  /** Computed merged classes for link/button elements */
  protected readonly _computedLeftLinkClass = computed(() => hlm(commonLinkClasses, this.leftLinkClass()));
  protected readonly _computedRightLinkClass = computed(() => hlm(commonLinkClasses, this.rightLinkClass()));

  mobileMenuItemClass = commonLinkClasses;

  footerEnabled = input<boolean>(false);
  footerMenus = input<MenuItem[]>([]);
  footerMenuClass = input<ClassValue>('', { alias: 'footerMenuClass' });
  footerLinkClass = input<ClassValue>('', { alias: 'footerLinkClass' });
  footerContent = input<string>('© 2024 My Company');
  footerClass = input<ClassValue>('', { alias: 'footerClass' });

  protected readonly _footerClass = computed(() =>
    hlm(
      'tw:px-4 tw:py-4 tw:bg-gray-100 tw:border-t tw:border-gray-300 tw:text-sm tw:text-gray-600',
      this.footerClass(),
    ),
  );

  protected readonly _computedFooterMenuClass = computed(() =>
    hlm('tw:flex tw:flex-wrap tw:justify-center tw:space-x-4', this.footerMenuClass()),
  );

  protected readonly _computedFooterLinkClass = computed(() =>
    hlm('tw:text-secondary tw:hover:text-primary tw:cursor-pointer tw:no-underline', this.footerLinkClass()),
  );

  /** Mobile menu state */
  mobileMenuOpen = false;
  isMobile = signal(false);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile.set(result.matches);
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onSearchOptionChange(value: TItem) {
    this.searchOptionChange.emit(value);
  }

  public readonly viewchildSheetRef = viewChild(EgLayoutSimpleSidebar);

  openSidebar() {
    this.viewchildSheetRef()?.openSheet();
  }

  closeSidebar() {
    this.viewchildSheetRef()?.closeSheet();
  }
}
