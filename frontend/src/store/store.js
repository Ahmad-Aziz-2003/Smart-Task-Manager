import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/tasks/taskSlice';
import categoryReducer from '../features/categories/categorySlice';
import filterReducer from '../features/filters/filterSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    categories: categoryReducer,
    filters: filterReducer,
  },
});

export default store; 