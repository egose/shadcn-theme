import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuGroup } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-components',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="tw:flex tw:flex-col lg:tw:flex-row tw:gap-6 tw:w-full">
      <!-- Sidebar nav -->
      <aside class="tw:w-full lg:tw:w-64 tw:shrink-0">
        <h2 class="tw:text-xl tw:font-bold tw:mb-3">Components</h2>
        <div class="tw:flex tw:flex-col tw:gap-3">
          @for (group of groups; track group.label) {
            <div>
              @if (group.label) {
                <div class="tw:text-xs tw:font-semibold tw:uppercase tw:text-muted-foreground tw:mb-1">
                  {{ group.label }}
                </div>
              }
              <div class="tw:flex tw:flex-col tw:gap-0.5">
                @for (item of group.items; track item.link) {
                  <a
                    [routerLink]="item.link"
                    routerLinkActive="tw:bg-secondary tw:text-secondary-foreground tw:font-semibold"
                    class="tw:px-2 tw:py-1 tw:text-sm tw:rounded-sm tw:hover:bg-secondary tw:no-underline tw:text-current"
                  >
                    {{ item.label }}
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </aside>

      <!-- Demo content -->
      <div class="tw:flex-1 tw:min-w-0">
        <router-outlet />
      </div>
    </div>
  `,
})
export class ComponentsLayout {
  groups: MenuGroup[] = [
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
}
