import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import type { FlyoutMenuGroup, MenuItem } from '@egose/shadcn-theme-ng/layout-simple';
import {
  lucideBell,
  lucideCalendar,
  lucideCheck,
  lucideCircleHelp,
  lucideCircleUser,
  lucideCreditCard,
  lucideImage,
  lucideKeyboard,
  lucideLayers,
  lucideLayoutDashboard,
  lucideList,
  lucideLoaderCircle,
  lucideMenu,
  lucideMessageSquare,
  lucideMousePointer2,
  lucidePanelTop,
  lucideSearch,
  lucideSettings,
  lucideSlidersHorizontal,
  lucideTable,
  lucideTextCursorInput,
  lucideToggleLeft,
  lucideType,
  lucideUsers,
} from '@ng-icons/lucide';

/**
 * Single source of truth for the demo catalog.
 *
 * One entry here creates the lazy child route, the menu item, the search
 * option, and any displayed count — nothing else needs to be edited when a
 * demo is added, renamed, or removed. Contract tests in `catalog.spec.ts`
 * fail on duplicate slugs/titles/links, missing loaders, or removals below
 * the reviewed baseline.
 */

export type CatalogKind = 'component' | 'example';

export interface CatalogEntry {
  /** Routable path segment, unique across the whole registry. */
  readonly slug: string;
  /** Displayed title (menu item, search option, page label), unique. */
  readonly title: string;
  /** Supporting copy and SVG icon for the fly-out destination card. */
  readonly description: string;
  readonly icon: string;
  /** Menu group label for this entry's kind. */
  readonly category: string;
  /**
   * 'component' entries are packaged primitive demos routed under
   * `/components/<slug>`. 'example' entries are realistic product flows
   * routed under `/examples/<slug>` and never appear in the component
   * menu groups.
   */
  readonly kind: CatalogKind;
  /** Lazy page loader; required so a missing loader fails typecheck. */
  readonly load: () => Promise<Type<unknown>>;
}

export const CATALOG_KIND_PATHS: Record<CatalogKind, string> = {
  component: 'components',
  example: 'examples',
};

/**
 * Reviewed baseline size: the registry replaced a 69-demo route table and
 * menu, and ANGEX-08 added the menu demo (70). Contract tests assert the
 * component count never drops below this without deliberately lowering the
 * baseline (intentional removal) — otherwise an accidental removal breaks
 * nothing self-derived.
 */
export const REVIEWED_COMPONENT_BASELINE = 70;

/**
 * Reviewed baseline size for the real-example catalog, established by
 * ANGEX-09 (pricing, team management, settings, support inbox). Contract
 * tests assert the example count never drops below this without deliberately
 * lowering the baseline — adding a flow only appends an entry.
 */
export const REVIEWED_EXAMPLE_BASELINE = 4;

/** Presentation shared by the category trigger and its fly-out introduction. */
const CATALOG_CATEGORIES: Record<string, { description: string; icon: string }> = {
  'Buttons & Indicators': {
    description: 'Make actions clear and keep people informed with responsive controls and status indicators.',
    icon: lucideMousePointer2,
  },
  'Forms & Inputs': {
    description: 'Collect information with accessible inputs, helpful validation, and flexible selection patterns.',
    icon: lucideTextCursorInput,
  },
  Overlays: {
    description: 'Bring focused tasks, contextual actions, and helpful details closer to the user.',
    icon: lucideLayers,
  },
  'Layout & Navigation': {
    description: 'Give every page a clear structure and help people find their way around your application.',
    icon: lucideLayoutDashboard,
  },
  'Data Display': {
    description: 'Turn content and data into readable, well-organized views with clear visual hierarchy.',
    icon: lucideTable,
  },
  Misc: {
    description: 'Explore specialized controls for more complex interactions.',
    icon: lucideSlidersHorizontal,
  },
  'Product Flows': {
    description: 'See the components working together in realistic, interactive application screens.',
    icon: lucidePanelTop,
  },
};

export const CATALOG_ENTRIES: CatalogEntry[] = [
  // Buttons & Indicators
  {
    slug: 'button',
    title: 'Button',
    category: 'Buttons & Indicators',
    kind: 'component',
    description: 'Clear calls to action with flexible sizes, colors, and loading states.',
    icon: lucideMousePointer2,
    load: () => import('../pages/components/button/button').then((m) => m.ButtonPage),
  },
  {
    slug: 'button-group',
    title: 'Button Group',
    category: 'Buttons & Indicators',
    kind: 'component',
    description: 'Keep related actions together in a compact, connected toolbar.',
    icon: lucideLayers,
    load: () => import('../pages/components/button-group/button-group').then((m) => m.ButtonGroupPage),
  },
  {
    slug: 'icon',
    title: 'Icon',
    category: 'Buttons & Indicators',
    kind: 'component',
    description: 'Add recognizable visual cues with consistent, scalable icons.',
    icon: lucideImage,
    load: () => import('../pages/components/icon/icon').then((m) => m.IconPage),
  },
  {
    slug: 'spinner',
    title: 'Spinner',
    category: 'Buttons & Indicators',
    kind: 'component',
    description: 'Show that work is in progress while content or actions load.',
    icon: lucideLoaderCircle,
    load: () => import('../pages/components/spinner/spinner').then((m) => m.SpinnerPage),
  },
  {
    slug: 'toggle',
    title: 'Toggle',
    category: 'Buttons & Indicators',
    kind: 'component',
    description: 'Switch an individual option between pressed and unpressed states.',
    icon: lucideToggleLeft,
    load: () => import('../pages/components/toggle/toggle').then((m) => m.TogglePage),
  },
  {
    slug: 'toggle-group',
    title: 'Toggle Group',
    category: 'Buttons & Indicators',
    kind: 'component',
    description: 'Choose one or several options from a set of toggle buttons.',
    icon: lucideSlidersHorizontal,
    load: () => import('../pages/components/toggle-group/toggle-group').then((m) => m.ToggleGroupPage),
  },
  {
    slug: 'switch',
    title: 'Switch',
    category: 'Buttons & Indicators',
    kind: 'component',
    description: 'Turn a setting on or off with an immediately recognizable control.',
    icon: lucideToggleLeft,
    load: () => import('../pages/components/switch/switch').then((m) => m.SwitchPage),
  },

  // Forms & Inputs
  {
    slug: 'input',
    title: 'Input',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Capture short text with a clean, accessible input field.',
    icon: lucideTextCursorInput,
    load: () => import('../pages/components/input/input').then((m) => m.InputPage),
  },
  {
    slug: 'input-group',
    title: 'Input Group',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Combine text fields with icons, labels, and inline actions.',
    icon: lucideLayers,
    load: () => import('../pages/components/input-group/input-group').then((m) => m.InputGroupPage),
  },
  {
    slug: 'input-otp',
    title: 'Input OTP',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Enter verification codes in a focused, segmented input.',
    icon: lucideKeyboard,
    load: () => import('../pages/components/input-otp/input-otp').then((m) => m.InputOtpPage),
  },
  {
    slug: 'textarea',
    title: 'Textarea',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Give longer messages, notes, and feedback room to breathe.',
    icon: lucideType,
    load: () => import('../pages/components/textarea/textarea').then((m) => m.TextareaPage),
  },
  {
    slug: 'checkbox',
    title: 'Checkbox',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Select independent options or confirm a single choice.',
    icon: lucideCheck,
    load: () => import('../pages/components/checkbox/checkbox').then((m) => m.CheckboxPage),
  },
  {
    slug: 'radio-group',
    title: 'Radio Group',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Present mutually exclusive choices in a visible option group.',
    icon: lucideList,
    load: () => import('../pages/components/radio-group/radio-group').then((m) => m.RadioGroupPage),
  },
  {
    slug: 'select',
    title: 'Select',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Choose from a styled dropdown with keyboard-friendly navigation.',
    icon: lucideList,
    load: () => import('../pages/components/select/select').then((m) => m.SelectPage),
  },
  {
    slug: 'native-select',
    title: 'Native Select',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Use familiar browser selection with consistent theme styling.',
    icon: lucideMenu,
    load: () => import('../pages/components/native-select/native-select').then((m) => m.NativeSelectPage),
  },
  {
    slug: 'slider',
    title: 'Slider',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Adjust a value or range with an intuitive draggable control.',
    icon: lucideSlidersHorizontal,
    load: () => import('../pages/components/slider/slider').then((m) => m.SliderPage),
  },
  {
    slug: 'label',
    title: 'Label',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Give form controls clear names and accessible associations.',
    icon: lucideType,
    load: () => import('../pages/components/label/label').then((m) => m.LabelPage),
  },
  {
    slug: 'combobox',
    title: 'Combobox',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Find and select an option by typing into a searchable dropdown.',
    icon: lucideSearch,
    load: () => import('../pages/components/combobox/combobox').then((m) => m.ComboboxPage),
  },
  {
    slug: 'autocomplete',
    title: 'Autocomplete',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Help people discover matching suggestions as they type.',
    icon: lucideSearch,
    load: () => import('../pages/components/autocomplete/autocomplete').then((m) => m.AutocompletePage),
  },
  {
    slug: 'date-picker',
    title: 'Date Picker',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Choose a date from a calendar without leaving the form.',
    icon: lucideCalendar,
    load: () => import('../pages/components/date-picker/date-picker').then((m) => m.DatePickerPage),
  },
  {
    slug: 'calendar',
    title: 'Calendar',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Browse months and select dates in a full calendar view.',
    icon: lucideCalendar,
    load: () => import('../pages/components/calendar/calendar').then((m) => m.CalendarPage),
  },
  {
    slug: 'field',
    title: 'Field',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Arrange a control with its label, description, and feedback.',
    icon: lucideTextCursorInput,
    load: () => import('../pages/components/field/field').then((m) => m.FieldPage),
  },
  {
    slug: 'form-field',
    title: 'Form Field',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Build consistent form rows with labels, hints, and validation.',
    icon: lucideLayers,
    load: () => import('../pages/components/form-field/form-field').then((m) => m.FormFieldPage),
  },
  {
    slug: 'form-checkbox',
    title: 'Form Checkbox',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Connect checkbox choices to form state and validation messages.',
    icon: lucideCheck,
    load: () => import('../pages/components/form-checkbox/form-checkbox').then((m) => m.FormCheckboxPage),
  },
  {
    slug: 'form-date-picker',
    title: 'Form Date Picker',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Add calendar selection with integrated form labels and errors.',
    icon: lucideCalendar,
    load: () => import('../pages/components/form-date-picker/form-date-picker').then((m) => m.FormDatePickerPage),
  },
  {
    slug: 'form-field-simple',
    title: 'Form Field Simple',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Use a lightweight field wrapper for straightforward form layouts.',
    icon: lucideTextCursorInput,
    load: () => import('../pages/components/form-field-simple/form-field-simple').then((m) => m.FormFieldSimplePage),
  },
  {
    slug: 'form-searchable-multiselect',
    title: 'Form Searchable Multiselect',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Search and select multiple values with integrated form feedback.',
    icon: lucideSearch,
    load: () =>
      import('../pages/components/form-searchable-multiselect/form-searchable-multiselect').then(
        (m) => m.FormSearchableMultiselectPage,
      ),
  },
  {
    slug: 'form-select',
    title: 'Form Select',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Bind a dropdown selection to a labeled, validated form field.',
    icon: lucideList,
    load: () => import('../pages/components/form-select/form-select').then((m) => m.FormSelectPage),
  },
  {
    slug: 'form-text-input',
    title: 'Form Text Input',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Collect text with form binding, helpful hints, and error states.',
    icon: lucideTextCursorInput,
    load: () => import('../pages/components/form-text-input/form-text-input').then((m) => m.FormTextInputPage),
  },
  {
    slug: 'form-textarea',
    title: 'Form Textarea',
    category: 'Forms & Inputs',
    kind: 'component',
    description: 'Capture longer answers with consistent form validation and layout.',
    icon: lucideType,
    load: () => import('../pages/components/form-textarea/form-textarea').then((m) => m.FormTextareaPage),
  },

  // Overlays
  {
    slug: 'alert-dialog',
    title: 'Alert Dialog',
    category: 'Overlays',
    kind: 'component',
    description: 'Ask for a deliberate decision before an important action.',
    icon: lucideCircleHelp,
    load: () => import('../pages/components/alert-dialog/alert-dialog').then((m) => m.AlertDialogPage),
  },
  {
    slug: 'dialog',
    title: 'Dialog',
    category: 'Overlays',
    kind: 'component',
    description: 'Keep a focused task in a modal above the current page.',
    icon: lucidePanelTop,
    load: () => import('../pages/components/dialog/dialog').then((m) => m.DialogPage),
  },
  {
    slug: 'drawer',
    title: 'Drawer',
    category: 'Overlays',
    kind: 'component',
    description: 'Reveal a sliding panel for supporting content and mobile tasks.',
    icon: lucideLayers,
    load: () => import('../pages/components/drawer/drawer').then((m) => m.DrawerPage),
  },
  {
    slug: 'sheet',
    title: 'Sheet',
    category: 'Overlays',
    kind: 'component',
    description: 'Open contextual details or navigation from the edge of the screen.',
    icon: lucidePanelTop,
    load: () => import('../pages/components/sheet/sheet').then((m) => m.SheetPage),
  },
  {
    slug: 'popover',
    title: 'Popover',
    category: 'Overlays',
    kind: 'component',
    description: 'Place compact controls and details next to their trigger.',
    icon: lucideMessageSquare,
    load: () => import('../pages/components/popover/popover').then((m) => m.PopoverPage),
  },
  {
    slug: 'hover-card',
    title: 'Hover Card',
    category: 'Overlays',
    kind: 'component',
    description: 'Preview extra information without navigating away from a link.',
    icon: lucideCircleUser,
    load: () => import('../pages/components/hover-card/hover-card').then((m) => m.HoverCardPage),
  },
  {
    slug: 'tooltip',
    title: 'Tooltip',
    category: 'Overlays',
    kind: 'component',
    description: 'Explain an icon or control with a brief contextual hint.',
    icon: lucideCircleHelp,
    load: () => import('../pages/components/tooltip/tooltip').then((m) => m.TooltipPage),
  },
  {
    slug: 'dropdown-menu',
    title: 'Dropdown Menu',
    category: 'Overlays',
    kind: 'component',
    description: 'Group related commands in a compact, anchored action menu.',
    icon: lucideMenu,
    load: () => import('../pages/components/dropdown-menu/dropdown-menu').then((m) => m.DropdownMenuPage),
  },
  {
    slug: 'context-menu',
    title: 'Context Menu',
    category: 'Overlays',
    kind: 'component',
    description: 'Offer relevant actions where people right-click on content.',
    icon: lucideMousePointer2,
    load: () => import('../pages/components/context-menu/context-menu').then((m) => m.ContextMenuPage),
  },
  {
    slug: 'menubar',
    title: 'Menubar',
    category: 'Overlays',
    kind: 'component',
    description: 'Organize application commands into familiar top-level menus.',
    icon: lucideMenu,
    load: () => import('../pages/components/menubar/menubar').then((m) => m.MenubarPage),
  },
  {
    slug: 'command',
    title: 'Command',
    category: 'Overlays',
    kind: 'component',
    description: 'Find commands and destinations in a searchable command palette.',
    icon: lucideKeyboard,
    load: () => import('../pages/components/command/command').then((m) => m.CommandPage),
  },
  {
    slug: 'confirmation-dialog',
    title: 'Confirmation Dialog',
    category: 'Overlays',
    kind: 'component',
    description: 'Confirm an action with a reusable dialog and clear choices.',
    icon: lucideCheck,
    load: () =>
      import('../pages/components/confirmation-dialog/confirmation-dialog').then((m) => m.ConfirmationDialogPage),
  },
  {
    slug: 'menu',
    title: 'Menu',
    category: 'Overlays',
    kind: 'component',
    description: 'Build structured action lists with accessible keyboard behavior.',
    icon: lucideList,
    load: () => import('../pages/components/menu/menu').then((m) => m.MenuPage),
  },

  // Layout & Navigation
  {
    slug: 'accordion',
    title: 'Accordion',
    category: 'Layout & Navigation',
    kind: 'component',
    description: 'Reveal related content in expandable, space-saving sections.',
    icon: lucideList,
    load: () => import('../pages/components/accordion/accordion').then((m) => m.AccordionPage),
  },
  {
    slug: 'collapsible',
    title: 'Collapsible',
    category: 'Layout & Navigation',
    kind: 'component',
    description: 'Show or hide a supporting section with a simple disclosure.',
    icon: lucideLayers,
    load: () => import('../pages/components/collapsible/collapsible').then((m) => m.CollapsiblePage),
  },
  {
    slug: 'breadcrumb',
    title: 'Breadcrumb',
    category: 'Layout & Navigation',
    kind: 'component',
    description: 'Show where a page lives and provide a path back to its parents.',
    icon: lucideMenu,
    load: () => import('../pages/components/breadcrumb/breadcrumb').then((m) => m.BreadcrumbPage),
  },
  {
    slug: 'navigation-menu',
    title: 'Navigation Menu',
    category: 'Layout & Navigation',
    kind: 'component',
    description: 'Connect sections with rich dropdowns and accessible navigation.',
    icon: lucideMenu,
    load: () => import('../pages/components/navigation-menu/navigation-menu').then((m) => m.NavigationMenuPage),
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    category: 'Layout & Navigation',
    kind: 'component',
    description: 'Move through paged results with clear next and previous controls.',
    icon: lucideList,
    load: () => import('../pages/components/pagination/pagination').then((m) => m.PaginationPage),
  },
  {
    slug: 'resizable',
    title: 'Resizable',
    category: 'Layout & Navigation',
    kind: 'component',
    description: 'Let people adjust panel sizes to suit the way they work.',
    icon: lucideSlidersHorizontal,
    load: () => import('../pages/components/resizable/resizable').then((m) => m.ResizablePage),
  },
  {
    slug: 'scroll-area',
    title: 'Scroll Area',
    category: 'Layout & Navigation',
    kind: 'component',
    description: 'Keep long content contained in a styled scrolling region.',
    icon: lucidePanelTop,
    load: () => import('../pages/components/scroll-area/scroll-area').then((m) => m.ScrollAreaPage),
  },
  {
    slug: 'sidebar',
    title: 'Sidebar',
    category: 'Layout & Navigation',
    kind: 'component',
    description: 'Give application destinations a persistent, organized home.',
    icon: lucideLayoutDashboard,
    load: () => import('../pages/components/sidebar/sidebar').then((m) => m.SidebarPage),
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    category: 'Layout & Navigation',
    kind: 'component',
    description: 'Switch between related views within the same page.',
    icon: lucideLayers,
    load: () => import('../pages/components/tabs/tabs').then((m) => m.TabsPage),
  },
  {
    slug: 'layout-simple',
    title: 'Layout Simple',
    category: 'Layout & Navigation',
    kind: 'component',
    description: 'Bring navigation, fly-out menus, search, and page content together.',
    icon: lucideLayoutDashboard,
    load: () => import('../pages/components/layout-simple/layout-simple').then((m) => m.LayoutSimplePage),
  },

  // Data Display
  {
    slug: 'alert',
    title: 'Alert',
    category: 'Data Display',
    kind: 'component',
    description: 'Highlight important information with a clear inline message.',
    icon: lucideBell,
    load: () => import('../pages/components/alert/alert').then((m) => m.AlertPage),
  },
  {
    slug: 'basic-alert',
    title: 'Basic Alert',
    category: 'Data Display',
    kind: 'component',
    description: 'Display a ready-to-use notice with a title and supporting text.',
    icon: lucideMessageSquare,
    load: () => import('../pages/components/basic-alert/basic-alert').then((m) => m.BasicAlertPage),
  },
  {
    slug: 'badge',
    title: 'Badge',
    category: 'Data Display',
    kind: 'component',
    description: 'Mark statuses, categories, and counts with compact labels.',
    icon: lucideCheck,
    load: () => import('../pages/components/badge/badge').then((m) => m.BadgePage),
  },
  {
    slug: 'card',
    title: 'Card',
    category: 'Data Display',
    kind: 'component',
    description: 'Group related content and actions on a distinct visual surface.',
    icon: lucidePanelTop,
    load: () => import('../pages/components/card/card').then((m) => m.CardPage),
  },
  {
    slug: 'avatar',
    title: 'Avatar',
    category: 'Data Display',
    kind: 'component',
    description: 'Represent a person with a profile image or initials fallback.',
    icon: lucideCircleUser,
    load: () => import('../pages/components/avatar/avatar').then((m) => m.AvatarPage),
  },
  {
    slug: 'table',
    title: 'Table',
    category: 'Data Display',
    kind: 'component',
    description: 'Present structured records in readable rows and columns.',
    icon: lucideTable,
    load: () => import('../pages/components/table/table').then((m) => m.TablePage),
  },
  {
    slug: 'kbd',
    title: 'Kbd',
    category: 'Data Display',
    kind: 'component',
    description: 'Make keyboard shortcuts recognizable and easy to scan.',
    icon: lucideKeyboard,
    load: () => import('../pages/components/kbd/kbd').then((m) => m.KbdPage),
  },
  {
    slug: 'separator',
    title: 'Separator',
    category: 'Data Display',
    kind: 'component',
    description: 'Create quiet visual boundaries between related content groups.',
    icon: lucideLayers,
    load: () => import('../pages/components/separator/separator').then((m) => m.SeparatorPage),
  },
  {
    slug: 'progress',
    title: 'Progress',
    category: 'Data Display',
    kind: 'component',
    description: 'Communicate how far a task has moved toward completion.',
    icon: lucideLoaderCircle,
    load: () => import('../pages/components/progress/progress').then((m) => m.ProgressPage),
  },
  {
    slug: 'skeleton',
    title: 'Skeleton',
    category: 'Data Display',
    kind: 'component',
    description: 'Preview the shape of a page while its content is loading.',
    icon: lucidePanelTop,
    load: () => import('../pages/components/skeleton/skeleton').then((m) => m.SkeletonPage),
  },
  {
    slug: 'sonner',
    title: 'Sonner',
    category: 'Data Display',
    kind: 'component',
    description: 'Deliver timely feedback through unobtrusive toast notifications.',
    icon: lucideBell,
    load: () => import('../pages/components/sonner/sonner').then((m) => m.SonnerPage),
  },
  {
    slug: 'empty',
    title: 'Empty',
    category: 'Data Display',
    kind: 'component',
    description: 'Explain an empty view and guide people toward a useful next step.',
    icon: lucideSearch,
    load: () => import('../pages/components/empty/empty').then((m) => m.EmptyPage),
  },
  {
    slug: 'item',
    title: 'Item',
    category: 'Data Display',
    kind: 'component',
    description: 'Compose reusable list rows with content, media, and actions.',
    icon: lucideList,
    load: () => import('../pages/components/item/item').then((m) => m.ItemPage),
  },
  {
    slug: 'typography',
    title: 'Typography',
    category: 'Data Display',
    kind: 'component',
    description: 'Create readable pages with consistent headings and body text.',
    icon: lucideType,
    load: () => import('../pages/components/typography/typography').then((m) => m.TypographyPage),
  },
  {
    slug: 'aspect-ratio',
    title: 'Aspect Ratio',
    category: 'Data Display',
    kind: 'component',
    description: 'Keep images and other media at a predictable proportion.',
    icon: lucideImage,
    load: () => import('../pages/components/aspect-ratio/aspect-ratio').then((m) => m.AspectRatioPage),
  },
  {
    slug: 'carousel',
    title: 'Carousel',
    category: 'Data Display',
    kind: 'component',
    description: 'Browse a sequence of images or cards in a sliding gallery.',
    icon: lucideImage,
    load: () => import('../pages/components/carousel/carousel').then((m) => m.CarouselPage),
  },

  // Misc
  {
    slug: 'searchable-multiselect',
    title: 'Searchable Multiselect',
    category: 'Misc',
    kind: 'component',
    description: 'Quickly find and choose multiple items from a longer list.',
    icon: lucideSearch,
    load: () =>
      import('../pages/components/searchable-multiselect/searchable-multiselect').then(
        (m) => m.SearchableMultiselectPage,
      ),
  },

  // Real examples (Wave 4 product flows). One entry plus its feature
  // directory under `pages/examples/<slug>/` is sufficient to create the
  // lazy route, the Examples catalog links, and the navigation surface;
  // component routes and menus never include these entries.
  {
    slug: 'pricing',
    title: 'Pricing',
    category: 'Product Flows',
    kind: 'example',
    description: 'Compare subscription plans, switch billing periods, and choose a tier.',
    icon: lucideCreditCard,
    load: () => import('../pages/examples/pricing/pricing').then((m) => m.PricingExamplePage),
  },
  {
    slug: 'team-management',
    title: 'Team Management',
    category: 'Product Flows',
    kind: 'example',
    description: 'Invite teammates, review members, and manage access in one place.',
    icon: lucideUsers,
    load: () => import('../pages/examples/team-management/team-management').then((m) => m.TeamManagementExamplePage),
  },
  {
    slug: 'settings',
    title: 'Settings',
    category: 'Product Flows',
    kind: 'example',
    description: 'Explore a complete preferences screen with editable account settings.',
    icon: lucideSettings,
    load: () => import('../pages/examples/settings/settings').then((m) => m.SettingsExamplePage),
  },
  {
    slug: 'support-inbox',
    title: 'Support Inbox',
    category: 'Product Flows',
    kind: 'example',
    description: 'Browse support conversations and work through incoming requests.',
    icon: lucideMessageSquare,
    load: () => import('../pages/examples/support-inbox/support-inbox').then((m) => m.SupportInboxExamplePage),
  },
];

export function catalogEntriesByKind(kind: CatalogKind): CatalogEntry[] {
  return CATALOG_ENTRIES.filter((entry) => entry.kind === kind);
}

export function catalogLink(entry: CatalogEntry): string {
  return `/${CATALOG_KIND_PATHS[entry.kind]}/${entry.slug}`;
}

/** Derived lazy child routes for the given kind, in registry order. */
export function catalogChildRoutes(kind: CatalogKind): Routes {
  return catalogEntriesByKind(kind).map((entry) => ({
    path: entry.slug,
    loadComponent: entry.load,
  }));
}

/**
 * Derived menu groups for the given kind, grouped by category in first-seen
 * registry order so Wave 4 example entries never appear in component menus.
 */
export function catalogMenuGroups(kind: CatalogKind): FlyoutMenuGroup[] {
  const byCategory = new Map<string, MenuItem[]>();
  for (const entry of catalogEntriesByKind(kind)) {
    const items = byCategory.get(entry.category) ?? [];
    items.push({ label: entry.title, link: catalogLink(entry), description: entry.description, icon: entry.icon });
    byCategory.set(entry.category, items);
  }
  return Array.from(byCategory, ([label, items]) => ({ label, items, ...CATALOG_CATEGORIES[label] }));
}

/** Duplicate values in encounter order; used by contract tests to fail on dupes. */
export function duplicateValues(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }
  return [...duplicates];
}
