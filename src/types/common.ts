export interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  isDropdown: boolean;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  tag?: string;
}

export interface DropdownState {
  [key: string]: boolean;
}

export type ActiveTab = 'dashboard' | 'exchange' | 'manager' | 'task' | 'scm' | 'collect' | 'meeting-room' | 'calendar' | 'admin';