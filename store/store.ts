import { configureStore } from '@reduxjs/toolkit';
import requestsSlice from './requestsSlice'
export const store = configureStore({
  reducer: {
    requests: requestsSlice
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;