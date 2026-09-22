/** Navigation destination or action shared by the header, mobile menu, and footer. */
export interface MenuItem {
  label: string;
  /** Supporting text displayed in fly-out cards. */
  description?: string;
  /** SVG data, e.g. `lucideHome` from `@ng-icons/lucide`. */
  icon?: string;
  /** Internal Angular router URL. A link takes precedence over an action. */
  link?: string;
  action?: () => void;
  /** Exact path matching by default; query parameters and fragments are ignored. */
  activeMatch?: 'exact' | 'prefix';
  disabled?: boolean;
  class?: string;
}

export interface MenuGroup {
  label?: string;
  items: readonly MenuItem[];
}

/** A named navbar disclosure that opens a wide grid of navigation cards. */
export interface FlyoutMenuGroup extends MenuGroup {
  label: string;
  /** Optional introduction shown above the cards. */
  description?: string;
  icon?: string;
}

/** Internal matching contract shared by links and dropdown destinations. */
export function navigationMatchOptions(item: MenuItem) {
  return {
    paths: item.activeMatch === 'prefix' ? ('subset' as const) : ('exact' as const),
    queryParams: 'ignored' as const,
    fragment: 'ignored' as const,
    matrixParams: 'ignored' as const,
  };
}
