export interface MenuItem {
  href: string;
  label: string;
  labelKey?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  requireAuth?: boolean;
  highlight?: boolean;
  color?: string;
  tag?: string;
  tagVariant?: "hot" | "pro" | "new" | "popular";
}

export interface MenuGroup {
  title: string;
  titleKey?: string;
  items: MenuItem[];
  requireAuth?: boolean;
  defaultOpen?: boolean;
  collapsible?: boolean;
  icon?: React.ReactNode;
  borderColor?: string;
}
