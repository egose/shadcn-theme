import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  lucideCircleHelp,
  lucideCircleUser,
  lucideCode,
  lucideCog,
  lucideKeyboard,
  lucideLayers,
  lucideLogOut,
  lucidePlus,
  lucideUser,
} from '@ng-icons/lucide';
import { EgLayoutSimple, MenuItem, MenuGroup } from '@egose/shadcn-theme-ng/layout-simple';

type DemoRoute = { label: string; link: string; group: string };

// All 70 component demos, grouped by their natural category. "Existing" items are
// merged back into the appropriate categories — there is no special "Existing" group.
const COMPONENT_GROUPS: MenuGroup[] = [
  {
    label: 'Buttons & Indicators',
    items: [
      { label: 'Button', link: '/components/button' },
      { label: 'Button Group', link: '/components/button-group' },
      { label: 'Icon', link: '/components/icon' },
      { label: 'Spinner', link: '/components/spinner' },
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
      { label: 'Form Field', link: '/components/form-field' },
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
      { label: 'Accordion', link: '/components/accordion' },
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
      { label: 'Alert', link: '/components/alert' },
      { label: 'Basic Alert', link: '/components/basic-alert' },
      { label: 'Badge', link: '/components/badge' },
      { label: 'Card', link: '/components/card' },
      { label: 'Avatar', link: '/components/avatar' },
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
  imports: [RouterOutlet, RouterLink, EgLayoutSimple],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);

  protected title = 'angular';

  iconPath = 'assets/logo.png';

  leftMenus: MenuItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Components', link: '/components/button' },
  ];

  topMenus: MenuItem[] = COMPONENT_GROUPS.map((group) => ({ label: group.label ?? 'Other' }));
  topSecondaryMenus: MenuGroup[] = COMPONENT_GROUPS;

  rightMenus: MenuItem[] = [];

  menus = [
    {
      label: 'Explore',
      items: [
        { label: 'Overview', icon: lucideCircleUser, link: '/components/layout-simple' },
        { label: 'Form flows', icon: lucideLayers, link: '/components/form-field' },
        { label: 'Patterns', icon: lucideCog, link: '/components/card' },
        { label: 'Keyboard shortcuts', icon: lucideKeyboard, action: () => this.onSupport() },
      ],
      separator: true,
    },
    {
      label: 'Popular',
      items: [
        { label: 'Buttons', icon: lucideUser, link: '/components/button' },
        { label: 'Forms', icon: lucidePlus, link: '/components/form-text-input' },
      ],
      separator: true,
    },
    {
      label: 'Resources',
      items: [
        { label: 'GitHub', icon: lucideCode, action: () => this.onBilling() },
        { label: 'Support', icon: lucideCircleHelp, action: () => this.onSupport() },
      ],
      separator: true,
    },
    {
      items: [{ label: 'Reset demo', icon: lucideLogOut, link: '/components/button' }],
    },
  ];

  footerMenus = [
    { label: 'Buttons', link: '/components/button' },
    { label: 'Forms', link: '/components/form-field' },
    { label: 'Tables', link: '/components/table' },
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

  private readonly componentRoutes: DemoRoute[] = COMPONENT_GROUPS.flatMap((group) =>
    group.items
      .filter((item): item is MenuItem & { link: string } => Boolean(item.link))
      .map((item) => ({
        label: item.label,
        link: item.link,
        group: group.label ?? 'Other',
      })),
  );

  demoToSearch = (value: DemoRoute) => `${value.group} ${value.label}`;

  loadDemoRoutes = async ({ search }: { search: string }): Promise<DemoRoute[]> => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return this.componentRoutes.slice(0, 8);
    }

    return this.componentRoutes
      .filter((item) => {
        const haystack = `${item.group} ${item.label}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 8);
  };

  onSearchOptionChange(value: DemoRoute) {
    void this.router.navigateByUrl(value.link);
  }
}
