import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const getCategories = (token) =>
  API.get('/categories', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createCategory = (data, token) =>
  API.post('/categories', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCategory = (id, data, token) =>
  API.put(`/categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteCategory = (id, token) =>
  API.delete(`/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }); 