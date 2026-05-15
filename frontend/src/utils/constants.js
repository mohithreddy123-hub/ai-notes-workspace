export const API_ROUTES = {
  BASE: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  AUTH: {
    LOGIN: '/auth/login/',
    SIGNUP: '/auth/signup/',
    LOGOUT: '/auth/logout/',
    REFRESH: '/auth/token/refresh/',
    PROFILE: '/auth/profile/',
    CHANGE_PASSWORD: '/auth/change-password/',
  },
  NOTES: {
    BASE: '/notes/notes/',
    ARCHIVED: '/notes/notes/archived/',
    PINNED: '/notes/notes/pinned/',
    TAGS: '/notes/tags/',
  },
  AI: {
    SUMMARY: (id) => `/ai/notes/${id}/generate-summary/`,
    ACTIONS: (id) => `/ai/notes/${id}/extract-actions/`,
    TITLE: (id) => `/ai/notes/${id}/suggest-title/`,
    HISTORY: '/ai/history/',
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard/',
  },
  SHARED: (id) => `/shared/${id}/`,
};

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  APP: {
    BASE: '/app',
    NOTES: '/app/notes',
    DASHBOARD: '/app/dashboard',
    SETTINGS: '/app/settings',
  },
  SHARED: '/shared/:shareId',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  THEME: 'theme',
};

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};
