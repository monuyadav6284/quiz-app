import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { postApi } from "../service/post";
import { questionApi } from "../service/question";
import { resultApi } from "./../service/result";

export const store = configureStore({
  reducer: {
    [postApi.reducerPath]: postApi.reducer,
    [questionApi.reducerPath]: questionApi.reducer,
    [resultApi.reducerPath]: resultApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      postApi.middleware,
      questionApi.middleware,
      resultApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
