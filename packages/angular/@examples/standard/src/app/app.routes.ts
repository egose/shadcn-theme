import { Routes } from '@angular/router';
import { ComponentsLayout } from './pages/components/components';

export const routes: Routes = [
  {
    path: 'components',
    component: ComponentsLayout,
    children: [
      // Existing pages — kept as-is (button/badge/alert/accordion/spinner/form-field)
      {
        path: 'button',
        loadComponent: () => import('./pages/components/button/button').then((m) => m.ButtonPage),
      },
      {
        path: 'badge',
        loadComponent: () => import('./pages/components/badge/badge').then((m) => m.Badgeage),
      },
      {
        path: 'icon',
        loadComponent: () => import('./pages/components/icon/icon').then((m) => m.IconPage),
      },
      {
        path: 'spinner',
        loadComponent: () => import('./pages/components/spinner/spinner').then((m) => m.SpinnerPage),
      },
      {
        path: 'accordion',
        loadComponent: () => import('./pages/components/accordion/accordion').then((m) => m.AccordionPage),
      },
      {
        path: 'alert',
        loadComponent: () => import('./pages/components/alert/alert').then((m) => m.AlertPage),
      },
      {
        path: 'form-field',
        loadComponent: () => import('./pages/components/form-field/form-field').then((m) => m.FormFieldPage),
      },

      // Buttons & Indicators
      {
        path: 'button-group',
        loadComponent: () => import('./pages/components/button-group/button-group').then((m) => m.ButtonGroupPage),
      },
      {
        path: 'toggle',
        loadComponent: () => import('./pages/components/toggle/toggle').then((m) => m.TogglePage),
      },
      {
        path: 'toggle-group',
        loadComponent: () => import('./pages/components/toggle-group/toggle-group').then((m) => m.ToggleGroupPage),
      },
      {
        path: 'switch',
        loadComponent: () => import('./pages/components/switch/switch').then((m) => m.SwitchPage),
      },

      // Forms & Inputs
      {
        path: 'input',
        loadComponent: () => import('./pages/components/input/input').then((m) => m.InputPage),
      },
      {
        path: 'input-group',
        loadComponent: () => import('./pages/components/input-group/input-group').then((m) => m.InputGroupPage),
      },
      {
        path: 'input-otp',
        loadComponent: () => import('./pages/components/input-otp/input-otp').then((m) => m.InputOtpPage),
      },
      {
        path: 'textarea',
        loadComponent: () => import('./pages/components/textarea/textarea').then((m) => m.TextareaPage),
      },
      {
        path: 'checkbox',
        loadComponent: () => import('./pages/components/checkbox/checkbox').then((m) => m.CheckboxPage),
      },
      {
        path: 'radio-group',
        loadComponent: () => import('./pages/components/radio-group/radio-group').then((m) => m.RadioGroupPage),
      },
      {
        path: 'select',
        loadComponent: () => import('./pages/components/select/select').then((m) => m.SelectPage),
      },
      {
        path: 'native-select',
        loadComponent: () => import('./pages/components/native-select/native-select').then((m) => m.NativeSelectPage),
      },
      {
        path: 'slider',
        loadComponent: () => import('./pages/components/slider/slider').then((m) => m.SliderPage),
      },
      {
        path: 'label',
        loadComponent: () => import('./pages/components/label/label').then((m) => m.LabelPage),
      },
      {
        path: 'combobox',
        loadComponent: () => import('./pages/components/combobox/combobox').then((m) => m.ComboboxPage),
      },
      {
        path: 'autocomplete',
        loadComponent: () => import('./pages/components/autocomplete/autocomplete').then((m) => m.AutocompletePage),
      },
      {
        path: 'date-picker',
        loadComponent: () => import('./pages/components/date-picker/date-picker').then((m) => m.DatePickerPage),
      },
      {
        path: 'calendar',
        loadComponent: () => import('./pages/components/calendar/calendar').then((m) => m.CalendarPage),
      },
      {
        path: 'field',
        loadComponent: () => import('./pages/components/field/field').then((m) => m.FieldPage),
      },
      {
        path: 'form-checkbox',
        loadComponent: () => import('./pages/components/form-checkbox/form-checkbox').then((m) => m.FormCheckboxPage),
      },
      {
        path: 'form-date-picker',
        loadComponent: () =>
          import('./pages/components/form-date-picker/form-date-picker').then((m) => m.FormDatePickerPage),
      },
      {
        path: 'form-field-simple',
        loadComponent: () =>
          import('./pages/components/form-field-simple/form-field-simple').then((m) => m.FormFieldSimplePage),
      },
      {
        path: 'form-searchable-multiselect',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/components/form-searchable-multiselect/form-searchable-multiselect').then(
            (m) => m.FormSearchableMultiselectPage,
          ),
      },
      {
        path: 'form-select',
        loadComponent: () => import('./pages/components/form-select/form-select').then((m) => m.FormSelectPage),
      },
      {
        path: 'form-text-input',
        loadComponent: () =>
          import('./pages/components/form-text-input/form-text-input').then((m) => m.FormTextInputPage),
      },
      {
        path: 'form-textarea',
        loadComponent: () => import('./pages/components/form-textarea/form-textarea').then((m) => m.FormTextareaPage),
      },

      // Overlays
      {
        path: 'alert-dialog',
        loadComponent: () => import('./pages/components/alert-dialog/alert-dialog').then((m) => m.AlertDialogPage),
      },
      {
        path: 'dialog',
        loadComponent: () => import('./pages/components/dialog/dialog').then((m) => m.DialogPage),
      },
      {
        path: 'drawer',
        loadComponent: () => import('./pages/components/drawer/drawer').then((m) => m.DrawerPage),
      },
      {
        path: 'sheet',
        loadComponent: () => import('./pages/components/sheet/sheet').then((m) => m.SheetPage),
      },
      {
        path: 'popover',
        loadComponent: () => import('./pages/components/popover/popover').then((m) => m.PopoverPage),
      },
      {
        path: 'hover-card',
        loadComponent: () => import('./pages/components/hover-card/hover-card').then((m) => m.HoverCardPage),
      },
      {
        path: 'tooltip',
        loadComponent: () => import('./pages/components/tooltip/tooltip').then((m) => m.TooltipPage),
      },
      {
        path: 'dropdown-menu',
        loadComponent: () => import('./pages/components/dropdown-menu/dropdown-menu').then((m) => m.DropdownMenuPage),
      },
      {
        path: 'context-menu',
        loadComponent: () => import('./pages/components/context-menu/context-menu').then((m) => m.ContextMenuPage),
      },
      {
        path: 'menubar',
        loadComponent: () => import('./pages/components/menubar/menubar').then((m) => m.MenubarPage),
      },
      {
        path: 'command',
        loadComponent: () => import('./pages/components/command/command').then((m) => m.CommandPage),
      },
      {
        path: 'confirmation-dialog',
        loadComponent: () =>
          import('./pages/components/confirmation-dialog/confirmation-dialog').then((m) => m.ConfirmationDialogPage),
      },

      // Layout & Navigation
      {
        path: 'collapsible',
        loadComponent: () => import('./pages/components/collapsible/collapsible').then((m) => m.CollapsiblePage),
      },
      {
        path: 'breadcrumb',
        loadComponent: () => import('./pages/components/breadcrumb/breadcrumb').then((m) => m.BreadcrumbPage),
      },
      {
        path: 'navigation-menu',
        loadComponent: () =>
          import('./pages/components/navigation-menu/navigation-menu').then((m) => m.NavigationMenuPage),
      },
      {
        path: 'pagination',
        loadComponent: () => import('./pages/components/pagination/pagination').then((m) => m.PaginationPage),
      },
      {
        path: 'resizable',
        loadComponent: () => import('./pages/components/resizable/resizable').then((m) => m.ResizablePage),
      },
      {
        path: 'scroll-area',
        loadComponent: () => import('./pages/components/scroll-area/scroll-area').then((m) => m.ScrollAreaPage),
      },
      {
        path: 'sidebar',
        loadComponent: () => import('./pages/components/sidebar/sidebar').then((m) => m.SidebarPage),
      },
      {
        path: 'tabs',
        loadComponent: () => import('./pages/components/tabs/tabs').then((m) => m.TabsPage),
      },
      {
        path: 'layout-simple',
        loadComponent: () => import('./pages/components/layout-simple/layout-simple').then((m) => m.LayoutSimplePage),
      },

      // Data Display
      {
        path: 'card',
        loadComponent: () => import('./pages/components/card/card').then((m) => m.CardPage),
      },
      {
        path: 'avatar',
        loadComponent: () => import('./pages/components/avatar/avatar').then((m) => m.AvatarPage),
      },
      {
        path: 'basic-alert',
        loadComponent: () => import('./pages/components/basic-alert/basic-alert').then((m) => m.BasicAlertPage),
      },
      {
        path: 'table',
        loadComponent: () => import('./pages/components/table/table').then((m) => m.TablePage),
      },
      {
        path: 'kbd',
        loadComponent: () => import('./pages/components/kbd/kbd').then((m) => m.KbdPage),
      },
      {
        path: 'separator',
        loadComponent: () => import('./pages/components/separator/separator').then((m) => m.SeparatorPage),
      },
      {
        path: 'progress',
        loadComponent: () => import('./pages/components/progress/progress').then((m) => m.ProgressPage),
      },
      {
        path: 'skeleton',
        loadComponent: () => import('./pages/components/skeleton/skeleton').then((m) => m.SkeletonPage),
      },
      {
        path: 'sonner',
        loadComponent: () => import('./pages/components/sonner/sonner').then((m) => m.SonnerPage),
      },
      {
        path: 'empty',
        loadComponent: () => import('./pages/components/empty/empty').then((m) => m.EmptyPage),
      },
      {
        path: 'item',
        loadComponent: () => import('./pages/components/item/item').then((m) => m.ItemPage),
      },
      {
        path: 'typography',
        loadComponent: () => import('./pages/components/typography/typography').then((m) => m.TypographyPage),
      },
      {
        path: 'aspect-ratio',
        loadComponent: () => import('./pages/components/aspect-ratio/aspect-ratio').then((m) => m.AspectRatioPage),
      },
      {
        path: 'carousel',
        loadComponent: () => import('./pages/components/carousel/carousel').then((m) => m.CarouselPage),
      },

      // Data Manipulation & Misc
      {
        path: 'searchable-multiselect',
        loadComponent: () =>
          import('./pages/components/searchable-multiselect/searchable-multiselect').then(
            (m) => m.SearchableMultiselectPage,
          ),
      },

      { path: '', redirectTo: 'button', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'components/button', pathMatch: 'full' },
];
