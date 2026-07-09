export const API = {
  auth: {
    login: '/auth/login',
    profile: '/auth/profile',
  },
  dashboard: {
    summary: '/dashboard/summary',
  },
  settings: '/settings',
  tasks: {
    base: '/tasks',
    byId: (id: string) => `/tasks/${id}`,
    status: (id: string) => `/tasks/${id}/status`
  }
};
