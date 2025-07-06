import { createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "../../api/authApi";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const res = await registerUser(formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const res = await loginUser(formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);
