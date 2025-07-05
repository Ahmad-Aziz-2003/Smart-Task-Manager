import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} from '../../api/taskApi';

export const fetchTasksThunk = createAsyncThunk('tasks/fetchTasks', async ({ filter, categoryId, token }, thunkAPI) => {
  try {
    const params = {};
    if (filter && filter !== 'all') params.filter = filter;
    if (categoryId) params.categoryId = categoryId;
    const res = await getTasks(params, token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error fetching tasks');
  }
});

export const createTaskThunk = createAsyncThunk('tasks/createTask', async ({ data, token }, thunkAPI) => {
  try {
    const res = await createTask(data, token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error creating task');
  }
});

export const updateTaskThunk = createAsyncThunk('tasks/updateTask', async ({ id, data, token }, thunkAPI) => {
  try {
    const res = await updateTask(id, data, token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error updating task');
  }
});

export const deleteTaskThunk = createAsyncThunk('tasks/deleteTask', async ({ id, token }, thunkAPI) => {
  try {
    await deleteTask(id, token);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error deleting task');
  }
});

export const completeTaskThunk = createAsyncThunk('tasks/completeTask', async ({ id, token }, thunkAPI) => {
  try {
    const res = await completeTask(id, token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error marking task complete');
  }
}); 