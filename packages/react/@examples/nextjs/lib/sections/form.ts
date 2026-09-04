import { defineSection } from '../example-registry';

/**
 * Forms — Standalone field components first (alphabetical by field type),
 * followed by react-hook-form bindings ("Hook *" entries) in the same
 * field-type ordering.
 */
export const formSection = defineSection({
  name: 'form',
  base: '/form',
  entries: [
    // ─── Standalone ──────────────────────────────────────────────────
    {
      slug: 'checkbox',
      route: 'dynamic',
      title: 'Checkbox',
      description: 'Standalone and controlled checkbox fields.',
      load: () => import('@/components/showcases/form/checkbox'),
    },
    {
      slug: 'date-picker',
      route: 'static',
      title: 'Date Picker',
      description: 'Date selection with labels and controlled values.',
    },
    {
      slug: 'date-range-picker',
      route: 'dynamic',
      title: 'Date Range Picker',
      description: 'Range selection for reporting and filter flows.',
      load: () => import('@/components/showcases/form/date-range-picker'),
    },
    {
      slug: 'multi-select',
      route: 'dynamic',
      title: 'Multi Select',
      description: 'Labeled multi-select field with removable chips.',
      load: () => import('@/components/showcases/form/multi-select'),
    },
    {
      slug: 'native-select',
      route: 'static',
      title: 'Native Select',
      description: 'Native select field with labels and defaults.',
    },
    {
      slug: 'searchable-select',
      route: 'static',
      title: 'Searchable Select',
      description: 'Searchable combobox field with custom options.',
    },
    {
      slug: 'select',
      route: 'static',
      title: 'Select',
      description: 'Select field built on top of the themed UI select.',
    },
    {
      slug: 'tag-picker',
      route: 'dynamic',
      title: 'Tag Picker',
      description: 'Labeled tag picker with suggestions and inline creation.',
      load: () => import('@/components/showcases/form/tag-picker'),
    },
    {
      slug: 'text-input',
      route: 'dynamic',
      title: 'Text Input',
      description: 'Text and numeric inputs with form and non-form usage.',
      load: () => import('@/components/showcases/form/text-input'),
    },
    {
      slug: 'textarea',
      route: 'static',
      title: 'Textarea',
      description: 'Multi-line text fields with validation states.',
    },
    {
      slug: 'time-input',
      route: 'dynamic',
      title: 'Time Input',
      description: 'Time normalization helpers for duration entry.',
      load: () => import('@/components/showcases/form/time-input'),
    },

    // ─── React Hook Form bindings ────────────────────────────────────
    {
      slug: 'hook-checkbox',
      route: 'dynamic',
      title: 'Hook Checkbox',
      description: 'Checkbox bound to react-hook-form state.',
      load: () => import('@/components/showcases/form/hook-checkbox'),
    },
    {
      slug: 'hook-date-picker',
      route: 'dynamic',
      title: 'Hook Date Picker',
      description: 'Date picker integrated with react-hook-form.',
      load: () => import('@/components/showcases/form/hook-date-picker'),
    },
    {
      slug: 'hook-date-range-picker',
      route: 'dynamic',
      title: 'Hook Date Range Picker',
      description: 'Date range picker integrated with react-hook-form.',
      load: () => import('@/components/showcases/form/hook-date-range-picker'),
    },
    {
      slug: 'hook-multi-select',
      route: 'dynamic',
      title: 'Hook Multi Select',
      description: 'Multi-select chips integrated with react-hook-form state.',
      load: () => import('@/components/showcases/form/hook-multi-select'),
    },
    {
      slug: 'hook-native-select',
      route: 'dynamic',
      title: 'Hook Native Select',
      description: 'Native select with react-hook-form registration.',
      load: () => import('@/components/showcases/form/hook-native-select'),
    },
    {
      slug: 'hook-searchable-select',
      route: 'dynamic',
      title: 'Hook Searchable Select',
      description: 'Searchable select integrated with form context.',
      load: () => import('@/components/showcases/form/hook-searchable-select'),
    },
    {
      slug: 'hook-select',
      route: 'dynamic',
      title: 'Hook Select',
      description: 'Select component wired into react-hook-form.',
      load: () => import('@/components/showcases/form/hook-select'),
    },
    {
      slug: 'hook-tag-picker',
      route: 'dynamic',
      title: 'Hook Tag Picker',
      description: 'Creatable tag picker connected to react-hook-form.',
      load: () => import('@/components/showcases/form/hook-tag-picker'),
    },
    {
      slug: 'hook-text-input',
      route: 'dynamic',
      title: 'Hook Text Input',
      description: 'Text input with validation driven by form state.',
      load: () => import('@/components/showcases/form/hook-text-input'),
    },
    {
      slug: 'hook-textarea',
      route: 'dynamic',
      title: 'Hook Textarea',
      description: 'Textarea integrated with react-hook-form rules.',
      load: () => import('@/components/showcases/form/hook-textarea'),
    },
    {
      slug: 'hook-time-input',
      route: 'dynamic',
      title: 'Hook Time Input',
      description: 'Time input with form registration and conversion.',
      load: () => import('@/components/showcases/form/hook-time-input'),
    },
  ],
});
