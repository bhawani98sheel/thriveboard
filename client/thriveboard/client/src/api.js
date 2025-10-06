import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default api;
import api from "../api";

const addTask = async (data) => {
  const res = await api.post("/api/tasks", data);
  return res.data;
};
