import { configureStore } from "@reduxjs/toolkit";
import newsSlice from "./slices/newsSlice"


export const store = configureStore({
    reducer: {
        news: newsSlice,
    },
});