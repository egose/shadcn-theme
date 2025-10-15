export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  link?: string;
  action?: () => void;
  className?: string;
  title?: boolean;
}

export interface UserMenuSection {
  label?: string;
  separator?: boolean;
  items?: MenuItem[];
}
