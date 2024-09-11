import { configureStore } from '@reduxjs/toolkit';
import shelfReducer from './slices/shelvesSlice';

const store = configureStore({
  reducer: {
    shelves: shelfReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
