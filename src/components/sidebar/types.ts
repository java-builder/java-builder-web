export interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  requireAuth?: boolean;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
  requireAuth?: boolean;
  defaultOpen?: boolean;
}
