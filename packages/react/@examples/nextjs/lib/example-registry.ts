export type ExampleLink = {
  title: string;
  url: string;
  description: string;
};

/**
 * Components — ordered by topic so similar primitives cluster together inside
 * the single sidebar collapsible:
 *   1. Inputs / Forms
 *   2. Layout
 *   3. Feedback / Disclosure
 *   4. Navigation
 *   5. Overlays
 *   6. Data Display
 *   7. Utilities & Primitives
 */
export const componentExamples: ExampleLink[] = [
  // ─── Inputs / Forms ────────────────────────────────────────────────
  { title: 'Button', url: '/components/button', description: 'Button variants, sizes, icons, and loading states.' },
  {
    title: 'Button Group',
    url: '/components/button-group',
    description: 'Grouped controls with shared edges and separators.',
  },
  {
    title: 'Unstyled Button',
    url: '/components/unstyled-button',
    description: 'Behavior-only button primitives for custom presentation.',
  },
  { title: 'Checkbox', url: '/components/checkbox', description: 'Boolean selection inputs and checkbox groups.' },
  { title: 'Input', url: '/components/input', description: 'Text, email, search, and disabled input states.' },
  {
    title: 'Input Group',
    url: '/components/input-group',
    description: 'Inputs with addons, buttons, and stacked affordances.',
  },
  {
    title: 'Input OTP',
    url: '/components/input-otp',
    description: 'Segmented verification code entry flows.',
  },
  { title: 'Textarea', url: '/components/textarea', description: 'Multi-line text input with sizing examples.' },
  { title: 'Label', url: '/components/label', description: 'Accessible form labels and required indicators.' },
  { title: 'Field', url: '/components/field', description: 'Composable field layouts with errors and descriptions.' },
  { title: 'Slider', url: '/components/slider', description: 'Continuous or ranged numeric input via drag handles.' },
  { title: 'Switch', url: '/components/switch', description: 'Binary toggle controls for settings and preferences.' },
  { title: 'Radio Group', url: '/components/radio-group', description: 'Single-choice selection sets.' },
  { title: 'Select', url: '/components/select', description: 'Radix-powered select menus with labels and groups.' },
  {
    title: 'Native Select',
    url: '/components/native-select',
    description: 'Styled native select elements and optgroups.',
  },
  { title: 'Combobox', url: '/components/combobox', description: 'Typeahead selection with filtering and chips.' },
  {
    title: 'Multi Select',
    url: '/components/multi-select',
    description: 'Chip-based multiple selection with typeahead filtering.',
  },
  {
    title: 'Tag Picker',
    url: '/components/tag-picker',
    description: 'Suggestion-aware tags that can also create new entries inline.',
  },
  {
    title: 'File Input',
    url: '/components/file-input',
    description: 'Hidden file input wired to a themed button trigger.',
  },
  { title: 'Calendar', url: '/components/calendar', description: 'Single-date, range, and week-number date views.' },

  // ─── Layout ────────────────────────────────────────────────────────
  { title: 'Card', url: '/components/card', description: 'Structured content containers with actions and footers.' },
  {
    title: 'Separator',
    url: '/components/separator',
    description: 'Horizontal and vertical dividers for layout rhythm.',
  },
  { title: 'Resizable', url: '/components/resizable', description: 'Resizable panels for split-view layouts.' },
  {
    title: 'Aspect Ratio',
    url: '/components/aspect-ratio',
    description: 'Media containers that preserve a consistent frame.',
  },
  {
    title: 'Sidebar',
    url: '/components/sidebar',
    description: 'Composable sidebar primitives for application shells.',
  },
  {
    title: 'Scroll Area',
    url: '/components/scroll-area',
    description: 'Custom scroll containers with themed scrollbars.',
  },
  {
    title: 'Scroll Shadow',
    url: '/components/scroll-shadow',
    description: 'CSS-mask fade shadows at the edges of any scroll container.',
  },

  // ─── Feedback / Disclosure ─────────────────────────────────────────
  { title: 'Alert', url: '/components/alert', description: 'Inline status and messaging patterns with actions.' },
  {
    title: 'Basic Alert',
    url: '/components/basic-alert',
    description: 'Opinionated alert presets with built-in icons.',
  },
  {
    title: 'Progress',
    url: '/components/progress',
    description: 'Linear progress indicators for loading and completion.',
  },
  { title: 'Skeleton', url: '/components/skeleton', description: 'Loading placeholders for content blocks and lists.' },
  { title: 'Spinner', url: '/components/spinner', description: 'Spinning loaders with optional labels.' },
  { title: 'Sonner', url: '/components/sonner', description: 'Toast notifications using the shared toaster setup.' },
  { title: 'Empty', url: '/components/empty', description: 'Empty states with messaging and next actions.' },
  {
    title: 'Collapsible',
    url: '/components/collapsible',
    description: 'Progressive disclosure for secondary content.',
  },
  {
    title: 'Accordion',
    url: '/components/accordion',
    description: 'Expandable content groups and disclosure patterns.',
  },
  { title: 'Tooltip', url: '/components/tooltip', description: 'Short hints and shortcuts on hover or focus.' },
  { title: 'Hover Card', url: '/components/hover-card', description: 'Hover-driven supplemental content panels.' },
  {
    title: 'Copy Button',
    url: '/components/copy-button',
    description: 'Inline copy-to-clipboard affordances with feedback.',
  },
  { title: 'Kbd', url: '/components/kbd', description: 'Keyboard key labels for shortcuts and hints.' },

  // ─── Navigation ────────────────────────────────────────────────────
  { title: 'Tabs', url: '/components/tabs', description: 'Tabbed content organization and switching.' },
  {
    title: 'Breadcrumb',
    url: '/components/breadcrumb',
    description: 'Hierarchical navigation with separators and overflow.',
  },
  {
    title: 'Navigation Menu',
    url: '/components/navigation-menu',
    description: 'Top-level navigation with rich content panels.',
  },
  {
    title: 'Pagination',
    url: '/components/pagination',
    description: 'Page navigation with active, previous, and next states.',
  },

  // ─── Overlays ──────────────────────────────────────────────────────
  { title: 'Dialog', url: '/components/dialog', description: 'Modal content surfaces with titles and actions.' },
  {
    title: 'Alert Dialog',
    url: '/components/alert-dialog',
    description: 'Confirmation dialogs for destructive or blocking actions.',
  },
  { title: 'Sheet', url: '/components/sheet', description: 'Off-canvas panels for supporting workflows.' },
  { title: 'Drawer', url: '/components/drawer', description: 'Edge-mounted drawers for mobile-first flows.' },
  { title: 'Popover', url: '/components/popover', description: 'Anchored floating panels for supporting content.' },
  {
    title: 'Dropdown Menu',
    url: '/components/dropdown-menu',
    description: 'Button-triggered menus with groups and submenus.',
  },
  {
    title: 'Context Menu',
    url: '/components/context-menu',
    description: 'Right-click and long-press action menus.',
  },
  { title: 'Menubar', url: '/components/menubar', description: 'Desktop-style application menus and nested actions.' },
  { title: 'Command', url: '/components/command', description: 'Command palette surfaces and searchable lists.' },
  {
    title: 'Carousel',
    url: '/components/carousel',
    description: 'Horizontal content carousels with navigation controls.',
  },

  // ─── Data Display ──────────────────────────────────────────────────
  { title: 'Avatar', url: '/components/avatar', description: 'Single avatars, badges, and grouped participants.' },
  { title: 'Badge', url: '/components/badge', description: 'Compact status labels and metadata chips.' },
  { title: 'Table', url: '/components/table', description: 'Responsive tables with headers, rows, and totals.' },
  { title: 'Item', url: '/components/item', description: 'Flexible list rows with media, content, and actions.' },
  { title: 'Toggle', url: '/components/toggle', description: 'Single pressed-state controls with icon support.' },
  {
    title: 'Toggle Group',
    url: '/components/toggle-group',
    description: 'Grouped pressed-state controls for formatting and views.',
  },

  // ─── Utilities & Primitives ────────────────────────────────────────
  {
    title: 'Direction',
    url: '/components/direction',
    description: 'LTR and RTL rendering for directional primitives.',
  },
];

/**
 * Forms — Standalone field components first (alphabetical by field type),
 * followed by react-hook-form bindings ("Hook *" entries) in the same
 * field-type ordering.
 */
export const formExamples: ExampleLink[] = [
  // ─── Standalone ────────────────────────────────────────────────────
  { title: 'Checkbox', url: '/form/checkbox', description: 'Standalone and controlled checkbox fields.' },
  { title: 'Date Picker', url: '/form/date-picker', description: 'Date selection with labels and controlled values.' },
  {
    title: 'Date Range Picker',
    url: '/form/date-range-picker',
    description: 'Range selection for reporting and filter flows.',
  },
  {
    title: 'Multi Select',
    url: '/form/multi-select',
    description: 'Labeled multi-select field with removable chips.',
  },
  { title: 'Native Select', url: '/form/native-select', description: 'Native select field with labels and defaults.' },
  {
    title: 'Searchable Select',
    url: '/form/searchable-select',
    description: 'Searchable combobox field with custom options.',
  },
  { title: 'Select', url: '/form/select', description: 'Select field built on top of the themed UI select.' },
  {
    title: 'Tag Picker',
    url: '/form/tag-picker',
    description: 'Labeled tag picker with suggestions and inline creation.',
  },
  {
    title: 'Text Input',
    url: '/form/text-input',
    description: 'Text and numeric inputs with form and non-form usage.',
  },
  { title: 'Textarea', url: '/form/textarea', description: 'Multi-line text fields with validation states.' },
  { title: 'Time Input', url: '/form/time-input', description: 'Time normalization helpers for duration entry.' },

  // ─── React Hook Form bindings ──────────────────────────────────────
  { title: 'Hook Checkbox', url: '/form/hook-checkbox', description: 'Checkbox bound to react-hook-form state.' },
  {
    title: 'Hook Date Picker',
    url: '/form/hook-date-picker',
    description: 'Date picker integrated with react-hook-form.',
  },
  {
    title: 'Hook Multi Select',
    url: '/form/hook-multi-select',
    description: 'Multi-select chips integrated with react-hook-form state.',
  },
  {
    title: 'Hook Native Select',
    url: '/form/hook-native-select',
    description: 'Native select with react-hook-form registration.',
  },
  {
    title: 'Hook Searchable Select',
    url: '/form/hook-searchable-select',
    description: 'Searchable select integrated with form context.',
  },
  { title: 'Hook Select', url: '/form/hook-select', description: 'Select component wired into react-hook-form.' },
  {
    title: 'Hook Tag Picker',
    url: '/form/hook-tag-picker',
    description: 'Creatable tag picker connected to react-hook-form.',
  },
  {
    title: 'Hook Text Input',
    url: '/form/hook-text-input',
    description: 'Text input with validation driven by form state.',
  },
  {
    title: 'Hook Textarea',
    url: '/form/hook-textarea',
    description: 'Textarea integrated with react-hook-form rules.',
  },
  {
    title: 'Hook Time Input',
    url: '/form/hook-time-input',
    description: 'Time input with form registration and conversion.',
  },
];

/**
 * Widgets — composed, real-world building blocks grouped by family:
 *   1. Foundation/Shell helpers (Page Header, Content Sidebar)
 *   2. Dialog manager + dialog-producing widgets
 *   3. List / row action widgets
 *   4. Hook demos
 */
export const widgetExamples: ExampleLink[] = [
  // ─── Shell / Page framing ──────────────────────────────────────────
  {
    title: 'Page Header',
    url: '/widgets/page-header',
    description: 'Consistent title, description, and trailing actions for page tops.',
  },
  {
    title: 'Content Sidebar',
    url: '/widgets/content-sidebar',
    description: 'Sidebar paired with switchable content panels and breadcrumbs.',
  },

  // ─── Dialog manager + dialog-producing widgets ────────────────────
  {
    title: 'Dialog Manager',
    url: '/widgets/dialog-manager',
    description: 'Programmatic dialogs created through a shared manager context.',
  },
  {
    title: 'Confirmation Dialog',
    url: '/widgets/confirmation-dialog',
    description: 'Promise-based confirmation dialog that resolves with the user decision.',
  },
  {
    title: 'Text Input Dialog',
    url: '/widgets/text-input-dialog',
    description: 'Promise-based text prompt with built-in length validation.',
  },
  {
    title: 'Image Preview Dialog',
    url: '/widgets/image-preview-dialog',
    description: 'Programmatic image preview dialog driven through the shared manager.',
  },

  // ─── List / row actions ───────────────────────────────────────────
  {
    title: 'Action Menu',
    url: '/widgets/action-menu',
    description: 'List-driven dropdown menu for row and card overflow actions.',
  },

  // ─── Hook demos ────────────────────────────────────────────────────
  {
    title: 'Use Debounced Value',
    url: '/widgets/use-debounced-value',
    description: 'A hook demo showing deferred filtering while the user types.',
  },
];

export const realExampleExamples: ExampleLink[] = [
  {
    title: 'Real Example Form',
    url: '/real-examples/real-example-form',
    description: 'A realistic launch request form combining every hook-based field in one flow.',
  },
];

/**
 * Slugs handled by the dynamic `[slug]` routes — kept in alphabetical order
 * for easy scanning. Adding a new entry here AND in the matching examples
 * array above makes `app/<section>/[slug]/page.tsx` render the page.
 */
export const componentDynamicSlugs = new Set([
  'aspect-ratio',
  'avatar',
  'basic-alert',
  'breadcrumb',
  'calendar',
  'copy-button',
  'direction',
  'drawer',
  'dropdown-menu',
  'empty',
  'field',
  'file-input',
  'input',
  'input-group',
  'input-otp',
  'item',
  'kbd',
  'label',
  'menubar',
  'multi-select',
  'pagination',
  'progress',
  'scroll-area',
  'scroll-shadow',
  'select',
  'separator',
  'sidebar',
  'skeleton',
  'sonner',
  'spinner',
  'table',
  'tag-picker',
  'textarea',
  'toggle',
  'tooltip',
  'unstyled-button',
]);

export const formDynamicSlugs = new Set([
  'checkbox',
  'date-range-picker',
  'hook-checkbox',
  'hook-date-picker',
  'hook-multi-select',
  'hook-native-select',
  'hook-searchable-select',
  'hook-select',
  'hook-tag-picker',
  'hook-text-input',
  'hook-textarea',
  'hook-time-input',
  'multi-select',
  'tag-picker',
  'text-input',
  'time-input',
]);

export const realExampleDynamicSlugs = new Set(['real-example-form']);
