import { createSlice } from "@reduxjs/toolkit";

const reloadSlice = createSlice({
    name: "reload",
    initialState: { isReloading: false },
    reducers: {
        startReload: (state) => {
            state.isReloading = true;
        },
        stopReload: (state) => {
            state.isReloading = false;
        },
    },
});

export const { startReload, stopReload } = reloadSlice.actions;
export default reloadSlice.reducer;
