import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filter: "all", // all, today, completed, upcoming
  categoryId: null,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setCategoryId: (state, action) => {
      state.categoryId = action.payload;
    },
    resetFilters: (state) => {
      state.filter = "all";
      state.categoryId = null;
    },
  },
});

export const { setFilter, setCategoryId, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
