import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/categoryApi';

export const fetchCategoriesThunk = createAsyncThunk('categories/fetchCategories', async (token, thunkAPI) => {
  try {
    const res = await getCategories(token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error fetching categories');
  }
});

export const createCategoryThunk = createAsyncThunk('categories/createCategory', async ({ data, token }, thunkAPI) => {
  try {
    const res = await createCategory(data, token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error creating category');
  }
});

export const updateCategoryThunk = createAsyncThunk('categories/updateCategory', async ({ id, data, token }, thunkAPI) => {
  try {
    const res = await updateCategory(id, data, token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error updating category');
  }
});

export const deleteCategoryThunk = createAsyncThunk('categories/deleteCategory', async ({ id, token }, thunkAPI) => {
  try {
    await deleteCategory(id, token);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error deleting category');
  }
}); 