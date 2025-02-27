import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authRejectionMiddleware } from './authMiddleware';

import authSlice from '../slices/auth';

const plugins = [
  authRejectionMiddleware
];

const store = configureStore({
  reducer: {
    auth: authSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(plugins)
});
setupListeners(store.dispatch);

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
