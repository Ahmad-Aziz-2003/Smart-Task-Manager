import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

export const getTasks = (params, token) =>
  API.get("/tasks", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTask = (data, token) =>
  API.post("/tasks", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTask = (id, data, token) =>
  API.put(`/tasks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTask = (id, token) =>
  API.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const completeTask = (id, token) =>
  API.patch(
    `/tasks/${id}/complete`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
