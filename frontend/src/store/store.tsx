import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authRejectionMiddleware } from './authMiddleware';

import authSlice from '../slices/auth';
import { api } from '../api';

const plugins = [authRejectionMiddleware, api.middleware];

const store = configureStore({
  reducer: {
    auth: authSlice,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(plugins)
});
setupListeners(store.dispatch);

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
