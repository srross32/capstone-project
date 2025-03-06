import {
  MiddlewareAPI,
  isRejectedWithValue,
  Middleware
} from '@reduxjs/toolkit';

export const authRejectionMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const { payload } = action;
      if (Object.prototype.hasOwnProperty.call(payload, 'status') && window.location.pathname !== '/login') {
        if ((payload as Record<string, number>).status === 401) {
          localStorage.removeItem('jwt');
          window.location.href = '/login';
        }
      }
    }
    return next(action);
  };
