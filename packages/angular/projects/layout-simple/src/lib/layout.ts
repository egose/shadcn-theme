import { Component, input, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ClassValue } from 'clsx';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { EgLayoutSimpleUserMenu, type UserMenuSection } from './user-menu';

// Updated interface for left/right menu items
export interface MenuItem {
  label: string;
  link?: string; // optional router link
  action?: () => void; // optional click handler
  class?: string; // optional per-item CSS/Tailwind classes
}

@Component({
  selector: 'eg-layout-simple',
  standalone: true,
  imports: [RouterOutlet, RouterLink, EgLayoutSimpleUserMenu],
  templateUrl: './layout.html',
})
export class EgLayoutSimple {
  /** Menu data inputs */
  leftMenus = input<MenuItem[]>([]);
  rightMenus = input<MenuItem[]>([]);
  userMenus = input<UserMenuSection[]>([]);
  logo = input<string>('assets/logo.png');
  logoLink = input<string>('/');
  hlm = hlm;

  /** Container class inputs */
  leftMenuClass = input<ClassValue>('', { alias: 'leftClass' });
  rightMenuClass = input<ClassValue>('', { alias: 'rightClass' });

  /** Link/button base class inputs */
  leftLinkClass = input<ClassValue>('', { alias: 'leftLinkClass' });
  rightLinkClass = input<ClassValue>('', { alias: 'rightLinkClass' });

  /** Computed merged classes for containers */
  protected readonly _computedLeftClass = computed(() =>
    hlm('tw:hidden tw:md:flex tw:space-x-4 tw:items-center', this.leftMenuClass()),
  );
  protected readonly _computedRightClass = computed(() =>
    hlm('tw:hidden tw:md:flex tw:space-x-4 tw:items-center', this.rightMenuClass()),
  );

  /** Computed merged classes for link/button elements */
  protected readonly _computedLeftLinkClass = computed(() =>
    hlm('tw:text-gray-700 tw:hover:text-blue-500', this.leftLinkClass()),
  );
  protected readonly _computedRightLinkClass = computed(() =>
    hlm('tw:text-gray-700 tw:hover:text-blue-500', this.rightLinkClass()),
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
}
