import { configureStore } from "@reduxjs/toolkit";
import reloadReducer from "./reloadSlice";

export const store = configureStore({
    reducer: { reload: reloadReducer },
});

export default store;
