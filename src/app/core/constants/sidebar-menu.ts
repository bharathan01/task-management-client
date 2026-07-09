import { MenuItem } from '../interfaces/app.interface';

export const SIDEBAR_MENU: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
  },
  {
    title: 'Tasks',
    icon: 'task',
    route: '/tasks',
  },
  {
    title: 'Kanban',
    icon: 'view_kanban',
    route: '/kanban',
  },
  {
    title: 'Settings',
    icon: 'settings',
    route: '/settings',
  },
];
