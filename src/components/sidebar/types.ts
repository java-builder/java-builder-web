export interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  requireAuth?: boolean;
  highlight?: boolean;
  color?: string;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
  requireAuth?: boolean;
  defaultOpen?: boolean;
}
