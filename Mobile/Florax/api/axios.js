import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://172.19.66.26:8082/florax/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const isAuthRoute = config.url?.startsWith("/auth");
      if (token && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log(e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem("token");
        // Navigation to login should be handled by components listening to auth state,
        // or by a router wrapper that checks AsyncStorage on mount.
      } catch (e) {
        console.log(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;