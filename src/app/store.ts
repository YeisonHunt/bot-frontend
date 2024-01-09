import { configureStore } from "@reduxjs/toolkit";
import botsReducer from "./storeHelpers/botSlice";
import themeReducer from './storeHelpers/themeSlice';

export const store = configureStore({
  reducer: {
    bots: botsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
