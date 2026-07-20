import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  lucideCircleHelp,
  lucideCircleUser,
  lucideCog,
  lucideGithub,
  lucideKeyboard,
  lucideLayers,
  lucideLogOut,
  lucidePlus,
  lucideUser,
} from '@ng-icons/lucide';
import { EgLayoutSimple, MenuItem, MenuGroup } from '@egose/shadcn-theme-ng/layout-simple';

type Country = { name: string; code: string; flag: string };

// All 70 component demos, grouped by their natural category (mirrors the sidebar in components.ts).
const COMPONENT_GROUPS: MenuGroup[] = [
  {
    label: 'Existing',
    items: [
      { label: 'Button', link: '/components/button' },
      { label: 'Badge', link: '/components/badge' },
      { label: 'Icon', link: '/components/icon' },
      { label: 'Alert', link: '/components/alert' },
      { label: 'Accordion', link: '/components/accordion' },
      { label: 'Spinner', link: '/components/spinner' },
      { label: 'Form Field', link: '/components/form-field' },
    ],
  },
  {
    label: 'Buttons & Indicators',
    items: [
      { label: 'Button Group', link: '/components/button-group' },
      { label: 'Toggle', link: '/components/toggle' },
      { label: 'Toggle Group', link: '/components/toggle-group' },
      { label: 'Switch', link: '/components/switch' },
    ],
  },
  {
    label: 'Forms & Inputs',
    items: [
      { label: 'Input', link: '/components/input' },
      { label: 'Input Group', link: '/components/input-group' },
      { label: 'Input OTP', link: '/components/input-otp' },
      { label: 'Textarea', link: '/components/textarea' },
      { label: 'Checkbox', link: '/components/checkbox' },
      { label: 'Radio Group', link: '/components/radio-group' },
      { label: 'Select', link: '/components/select' },
      { label: 'Native Select', link: '/components/native-select' },
      { label: 'Slider', link: '/components/slider' },
      { label: 'Label', link: '/components/label' },
      { label: 'Combobox', link: '/components/combobox' },
      { label: 'Autocomplete', link: '/components/autocomplete' },
      { label: 'Date Picker', link: '/components/date-picker' },
      { label: 'Calendar', link: '/components/calendar' },
      { label: 'Field', link: '/components/field' },
      { label: 'Form Checkbox', link: '/components/form-checkbox' },
      { label: 'Form Date Picker', link: '/components/form-date-picker' },
      { label: 'Form Field Simple', link: '/components/form-field-simple' },
      { label: 'Form Searchable Multiselect', link: '/components/form-searchable-multiselect' },
      { label: 'Form Select', link: '/components/form-select' },
      { label: 'Form Text Input', link: '/components/form-text-input' },
      { label: 'Form Textarea', link: '/components/form-textarea' },
    ],
  },
  {
    label: 'Overlays',
    items: [
      { label: 'Alert Dialog', link: '/components/alert-dialog' },
      { label: 'Dialog', link: '/components/dialog' },
      { label: 'Drawer', link: '/components/drawer' },
      { label: 'Sheet', link: '/components/sheet' },
      { label: 'Popover', link: '/components/popover' },
      { label: 'Hover Card', link: '/components/hover-card' },
      { label: 'Tooltip', link: '/components/tooltip' },
      { label: 'Dropdown Menu', link: '/components/dropdown-menu' },
      { label: 'Context Menu', link: '/components/context-menu' },
      { label: 'Menubar', link: '/components/menubar' },
      { label: 'Command', link: '/components/command' },
      { label: 'Confirmation Dialog', link: '/components/confirmation-dialog' },
    ],
  },
  {
    label: 'Layout & Navigation',
    items: [
      { label: 'Collapsible', link: '/components/collapsible' },
      { label: 'Breadcrumb', link: '/components/breadcrumb' },
      { label: 'Navigation Menu', link: '/components/navigation-menu' },
      { label: 'Pagination', link: '/components/pagination' },
      { label: 'Resizable', link: '/components/resizable' },
      { label: 'Scroll Area', link: '/components/scroll-area' },
      { label: 'Sidebar', link: '/components/sidebar' },
      { label: 'Tabs', link: '/components/tabs' },
      { label: 'Layout Simple', link: '/components/layout-simple' },
    ],
  },
  {
    label: 'Data Display',
    items: [
      { label: 'Card', link: '/components/card' },
      { label: 'Avatar', link: '/components/avatar' },
      { label: 'Basic Alert', link: '/components/basic-alert' },
      { label: 'Table', link: '/components/table' },
      { label: 'Kbd', link: '/components/kbd' },
      { label: 'Separator', link: '/components/separator' },
      { label: 'Progress', link: '/components/progress' },
      { label: 'Skeleton', link: '/components/skeleton' },
      { label: 'Sonner', link: '/components/sonner' },
      { label: 'Empty', link: '/components/empty' },
      { label: 'Item', link: '/components/item' },
      { label: 'Typography', link: '/components/typography' },
      { label: 'Aspect Ratio', link: '/components/aspect-ratio' },
      { label: 'Carousel', link: '/components/carousel' },
    ],
  },
  {
    label: 'Misc',
    items: [{ label: 'Searchable Multiselect', link: '/components/searchable-multiselect' }],
  },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EgLayoutSimple],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'angular';

  iconPath = 'assets/logo.png';

  // Use groups (rendered as hover-dropdowns in the header) for full 70 item inventory.
  leftMenuGroups: MenuGroup[] = COMPONENT_GROUPS;

  // Quick-access left menus that always appear in the header (regardless of grouping).
  leftMenus: MenuItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Components', link: '/components/button', class: 'tw:font-bold' },
  ];

  // Category shortcuts rendered in a top menu bar below the header.
  topMenus: MenuItem[] = COMPONENT_GROUPS.map((g) => ({
    label: g.label ?? 'Other',
    link: g.items[0]?.link ?? '/components/button',
    class: 'tw:font-medium',
  }));

  rightMenus = [{ label: 'Sign Out', action: () => alert('Signed out'), class: 'tw:bg-yellow-200' }];

  menus = [
    {
      label: 'My Account',
      items: [
        { label: 'Profile', icon: lucideCircleUser, link: '/profile' },
        { label: 'Billing', icon: lucideLayers, action: () => this.onBilling() },
        { label: 'Settings', icon: lucideCog, class: 'tw:text-blue-500' },
        { label: 'Keyboard shortcuts', icon: lucideKeyboard },
      ],
      separator: true,
    },
    {
      label: 'Team',
      items: [
        { label: 'Team', icon: lucideUser, link: '/team' },
        { label: 'New Team', icon: lucidePlus },
      ],
      separator: true,
    },
    {
      label: 'Links',
      items: [
        { label: 'GitHub', icon: lucideGithub, link: '/github' },
        { label: 'Support', icon: lucideCircleHelp, action: () => this.onSupport() },
      ],
      separator: true,
    },
    {
      items: [{ label: 'Log out', icon: lucideLogOut, action: () => this.logout() }],
    },
  ];

  footerMenus = [
    { label: 'Privacy Policy', link: '/privacy' },
    { label: 'Terms of Service', link: '/terms' },
    { label: 'Contact', action: () => {} },
  ];

  onBilling() {
    console.log('Billing clicked');
  }

  onSupport() {
    console.log('Support clicked');
  }

  logout() {
    console.log('Logged out');
  }

  private readonly _countries: Country[] = [
    { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺' },
    { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
    { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦' },
    { name: 'China', code: 'CN', flag: '🇨🇳' },
    { name: 'France', code: 'FR', flag: '🇫🇷' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪' },
    { name: 'India', code: 'IN', flag: '🇮🇳' },
    { name: 'Italy', code: 'IT', flag: '🇮🇹' },
    { name: 'Japan', code: 'JP', flag: '🇯🇵' },
    { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
    { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
    { name: 'Norway', code: 'NO', flag: '🇳🇴' },
    { name: 'Russia', code: 'RU', flag: '🇷🇺' },
    { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
    { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
    { name: 'Spain', code: 'ES', flag: '🇪🇸' },
    { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
    { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
    { name: 'United States', code: 'US', flag: '🇺🇸' },
  ];

  countryToSearch = (value: Country) => `${value.flag} ${value.name}`;

  loadCountries = async ({ search }: { search: string }): Promise<Country[]> => {
    if (!search) return [];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this._countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())));
      }, 500);
    });
  };

  onSearchOptionChange(value: Country) {
    console.log('Selected country:', value);
  }
}
