/**
 * A single menu entry rendered by {@link SimpleLayout}. Either `link` (for
 * navigation) or `action` (for callbacks) should be supplied; `link` wins
 * when both are present. `title: true` keeps the entry in the compact mobile
 * header; other entries move into the mobile navigation panel.
 */
export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  link?: string;
  action?: () => void;
  className?: string;
  title?: boolean;
}

/**
 * Group of items rendered inside the user dropdown. A section with
 * `separator: true` renders as a divider; otherwise `items` (if any) is
 * rendered under `label`.
 */
export interface UserMenuSection {
  label?: string;
  separator?: boolean;
  items?: MenuItem[];
}
