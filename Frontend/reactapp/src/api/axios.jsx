// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.MODE === 'production' 
    ? "http://localhost:8080" 
    : "/api", // Use proxy in development
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;