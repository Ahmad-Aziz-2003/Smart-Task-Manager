import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategoriesThunk,
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from "./categoryThunks";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const idx = state.categories.findIndex(
          (c) => c._id === action.payload._id
        );
        if (idx !== -1) state.categories[idx] = action.payload;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c._id !== action.payload
        );
      });
  },
});

export default categorySlice.reducer;
