import { defineSection } from '../example-registry';

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
 *
 * `route: 'static'` entries are implemented by a dedicated
 * `app/components/<slug>/page.tsx`; `route: 'dynamic'` entries are lazy-loaded
 * by `app/components/[slug]/page.tsx` through the loader below. See
 * `lib/example-registry.ts` for when to choose which.
 */
export const componentsSection = defineSection({
  name: 'components',
  base: '/components',
  entries: [
    // ─── Inputs / Forms ──────────────────────────────────────────────
    {
      slug: 'button',
      route: 'static',
      title: 'Button',
      description: 'Button variants, sizes, icons, and loading states.',
    },
    {
      slug: 'button-group',
      route: 'static',
      title: 'Button Group',
      description: 'Grouped controls with shared edges and separators.',
    },
    {
      slug: 'unstyled-button',
      route: 'dynamic',
      title: 'Unstyled Button',
      description: 'Behavior-only button primitives for custom presentation.',
      load: () => import('@/components/showcases/components/unstyled-button'),
    },
    {
      slug: 'checkbox',
      route: 'static',
      title: 'Checkbox',
      description: 'Boolean selection inputs and checkbox groups.',
    },
    {
      slug: 'input',
      route: 'dynamic',
      title: 'Input',
      description: 'Text, email, search, and disabled input states.',
      load: () => import('@/components/showcases/components/input'),
    },
    {
      slug: 'input-group',
      route: 'dynamic',
      title: 'Input Group',
      description: 'Inputs with addons, buttons, and stacked affordances.',
      load: () => import('@/components/showcases/components/input-group'),
    },
    {
      slug: 'input-otp',
      route: 'dynamic',
      title: 'Input OTP',
      description: 'Segmented verification code entry flows.',
      load: () => import('@/components/showcases/components/input-otp'),
    },
    {
      slug: 'textarea',
      route: 'dynamic',
      title: 'Textarea',
      description: 'Multi-line text input with sizing examples.',
      load: () => import('@/components/showcases/components/textarea'),
    },
    {
      slug: 'label',
      route: 'dynamic',
      title: 'Label',
      description: 'Accessible form labels and required indicators.',
      load: () => import('@/components/showcases/components/label'),
    },
    {
      slug: 'field',
      route: 'dynamic',
      title: 'Field',
      description: 'Composable field layouts with errors and descriptions.',
      load: () => import('@/components/showcases/components/field'),
    },
    {
      slug: 'slider',
      route: 'static',
      title: 'Slider',
      description: 'Continuous or ranged numeric input via drag handles.',
    },
    {
      slug: 'switch',
      route: 'static',
      title: 'Switch',
      description: 'Binary toggle controls for settings and preferences.',
    },
    {
      slug: 'radio-group',
      route: 'static',
      title: 'Radio Group',
      description: 'Single-choice selection sets.',
    },
    {
      slug: 'select',
      route: 'dynamic',
      title: 'Select',
      description: 'Radix-powered select menus with labels and groups.',
      load: () => import('@/components/showcases/components/select'),
    },
    {
      slug: 'native-select',
      route: 'static',
      title: 'Native Select',
      description: 'Styled native select elements and optgroups.',
    },
    {
      slug: 'combobox',
      route: 'static',
      title: 'Combobox',
      description: 'Typeahead selection with filtering and chips.',
    },
    {
      slug: 'multi-select',
      route: 'dynamic',
      title: 'Multi Select',
      description: 'Chip-based multiple selection with typeahead filtering.',
      load: () => import('@/components/showcases/components/multi-select'),
    },
    {
      slug: 'tag-picker',
      route: 'dynamic',
      title: 'Tag Picker',
      description: 'Suggestion-aware tags that can also create new entries inline.',
      load: () => import('@/components/showcases/components/tag-picker'),
    },
    {
      slug: 'file-input',
      route: 'dynamic',
      title: 'File Input',
      description: 'Hidden file input wired to a themed button trigger.',
      load: () => import('@/components/showcases/components/file-input'),
    },
    {
      slug: 'calendar',
      route: 'dynamic',
      title: 'Calendar',
      description: 'Single-date, range, and week-number date views.',
      load: () => import('@/components/showcases/components/calendar'),
    },

    // ─── Layout ──────────────────────────────────────────────────────
    {
      slug: 'card',
      route: 'static',
      title: 'Card',
      description: 'Structured content containers with actions and footers.',
    },
    {
      slug: 'separator',
      route: 'dynamic',
      title: 'Separator',
      description: 'Horizontal and vertical dividers for layout rhythm.',
      load: () => import('@/components/showcases/components/separator'),
    },
    {
      slug: 'resizable',
      route: 'static',
      title: 'Resizable',
      description: 'Resizable panels for split-view layouts.',
    },
    {
      slug: 'aspect-ratio',
      route: 'dynamic',
      title: 'Aspect Ratio',
      description: 'Media containers that preserve a consistent frame.',
      load: () => import('@/components/showcases/components/aspect-ratio'),
    },
    {
      slug: 'sidebar',
      route: 'dynamic',
      title: 'Sidebar',
      description: 'Composable sidebar primitives for application shells.',
      load: () => import('@/components/showcases/components/sidebar'),
    },
    {
      slug: 'scroll-area',
      route: 'dynamic',
      title: 'Scroll Area',
      description: 'Custom scroll containers with themed scrollbars.',
      load: () => import('@/components/showcases/components/scroll-area'),
    },
    {
      slug: 'scroll-shadow',
      route: 'dynamic',
      title: 'Scroll Shadow',
      description: 'CSS-mask fade shadows at the edges of any scroll container.',
      load: () => import('@/components/showcases/components/scroll-shadow'),
    },

    // ─── Feedback / Disclosure ───────────────────────────────────────
    {
      slug: 'alert',
      route: 'static',
      title: 'Alert',
      description: 'Inline status and messaging patterns with actions.',
    },
    {
      slug: 'basic-alert',
      route: 'dynamic',
      title: 'Basic Alert',
      description: 'Opinionated alert presets with built-in icons.',
      load: () => import('@/components/showcases/components/basic-alert'),
    },
    {
      slug: 'progress',
      route: 'dynamic',
      title: 'Progress',
      description: 'Linear progress indicators for loading and completion.',
      load: () => import('@/components/showcases/components/progress'),
    },
    {
      slug: 'skeleton',
      route: 'dynamic',
      title: 'Skeleton',
      description: 'Loading placeholders for content blocks and lists.',
      load: () => import('@/components/showcases/components/skeleton'),
    },
    {
      slug: 'spinner',
      route: 'dynamic',
      title: 'Spinner',
      description: 'Spinning loaders with optional labels.',
      load: () => import('@/components/showcases/components/spinner'),
    },
    {
      slug: 'sonner',
      route: 'dynamic',
      title: 'Sonner',
      description: 'Toast notifications using the shared toaster setup.',
      load: () => import('@/components/showcases/components/sonner'),
    },
    {
      slug: 'empty',
      route: 'dynamic',
      title: 'Empty',
      description: 'Empty states with messaging and next actions.',
      load: () => import('@/components/showcases/components/empty'),
    },
    {
      slug: 'collapsible',
      route: 'static',
      title: 'Collapsible',
      description: 'Progressive disclosure for secondary content.',
    },
    {
      slug: 'accordion',
      route: 'static',
      title: 'Accordion',
      description: 'Expandable content groups and disclosure patterns.',
    },
    {
      slug: 'tooltip',
      route: 'dynamic',
      title: 'Tooltip',
      description: 'Short hints and shortcuts on hover or focus.',
      load: () => import('@/components/showcases/components/tooltip'),
    },
    {
      slug: 'hover-card',
      route: 'static',
      title: 'Hover Card',
      description: 'Hover-driven supplemental content panels.',
    },
    {
      slug: 'copy-button',
      route: 'dynamic',
      title: 'Copy Button',
      description: 'Inline copy-to-clipboard affordances with feedback.',
      load: () => import('@/components/showcases/components/copy-button'),
    },
    {
      slug: 'kbd',
      route: 'dynamic',
      title: 'Kbd',
      description: 'Keyboard key labels for shortcuts and hints.',
      load: () => import('@/components/showcases/components/kbd'),
    },

    // ─── Navigation ──────────────────────────────────────────────────
    {
      slug: 'tabs',
      route: 'static',
      title: 'Tabs',
      description: 'Tabbed content organization and switching.',
    },
    {
      slug: 'breadcrumb',
      route: 'dynamic',
      title: 'Breadcrumb',
      description: 'Hierarchical navigation with separators and overflow.',
      load: () => import('@/components/showcases/components/breadcrumb'),
    },
    {
      slug: 'navigation-menu',
      route: 'static',
      title: 'Navigation Menu',
      description: 'Top-level navigation with rich content panels.',
    },
    {
      slug: 'pagination',
      route: 'dynamic',
      title: 'Pagination',
      description: 'Page navigation with active, previous, and next states.',
      load: () => import('@/components/showcases/components/pagination'),
    },

    // ─── Overlays ────────────────────────────────────────────────────
    {
      slug: 'dialog',
      route: 'static',
      title: 'Dialog',
      description: 'Modal content surfaces with titles and actions.',
    },
    {
      slug: 'alert-dialog',
      route: 'static',
      title: 'Alert Dialog',
      description: 'Confirmation dialogs for destructive or blocking actions.',
    },
    {
      slug: 'sheet',
      route: 'static',
      title: 'Sheet',
      description: 'Off-canvas panels for supporting workflows.',
    },
    {
      slug: 'drawer',
      route: 'dynamic',
      title: 'Drawer',
      description: 'Edge-mounted drawers for mobile-first flows.',
      load: () => import('@/components/showcases/components/drawer'),
    },
    {
      slug: 'popover',
      route: 'static',
      title: 'Popover',
      description: 'Anchored floating panels for supporting content.',
    },
    {
      slug: 'dropdown-menu',
      route: 'dynamic',
      title: 'Dropdown Menu',
      description: 'Button-triggered menus with groups and submenus.',
      load: () => import('@/components/showcases/components/dropdown-menu'),
    },
    {
      slug: 'context-menu',
      route: 'static',
      title: 'Context Menu',
      description: 'Right-click and long-press action menus.',
    },
    {
      slug: 'menubar',
      route: 'dynamic',
      title: 'Menubar',
      description: 'Desktop-style application menus and nested actions.',
      load: () => import('@/components/showcases/components/menubar'),
    },
    {
      slug: 'command',
      route: 'static',
      title: 'Command',
      description: 'Command palette surfaces and searchable lists.',
    },
    {
      slug: 'carousel',
      route: 'static',
      title: 'Carousel',
      description: 'Horizontal content carousels with navigation controls.',
    },

    // ─── Data Display ────────────────────────────────────────────────
    {
      slug: 'avatar',
      route: 'dynamic',
      title: 'Avatar',
      description: 'Single avatars, badges, and grouped participants.',
      load: () => import('@/components/showcases/components/avatar'),
    },
    {
      slug: 'badge',
      route: 'static',
      title: 'Badge',
      description: 'Compact status labels and metadata chips.',
    },
    {
      slug: 'table',
      route: 'dynamic',
      title: 'Table',
      description: 'Responsive tables with headers, rows, and totals.',
      load: () => import('@/components/showcases/components/table'),
    },
    {
      slug: 'item',
      route: 'dynamic',
      title: 'Item',
      description: 'Flexible list rows with media, content, and actions.',
      load: () => import('@/components/showcases/components/item'),
    },
    {
      slug: 'toggle',
      route: 'dynamic',
      title: 'Toggle',
      description: 'Single pressed-state controls with icon support.',
      load: () => import('@/components/showcases/components/toggle'),
    },
    {
      slug: 'toggle-group',
      route: 'static',
      title: 'Toggle Group',
      description: 'Grouped pressed-state controls for formatting and views.',
    },

    // ─── Utilities & Primitives ──────────────────────────────────────
    {
      slug: 'direction',
      route: 'dynamic',
      title: 'Direction',
      description: 'LTR and RTL rendering for directional primitives.',
      load: () => import('@/components/showcases/components/direction'),
    },
  ],
});
