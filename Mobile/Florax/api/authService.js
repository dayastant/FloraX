import api from "./axios";

/**
 * Register a new user
 * @param {Object} formData - User registration data
 * @returns {Promise} Response with token
 */
export const registerUser = async (formData) => {
  try {
    const response = await api.post("/auth/register", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {Promise} Response with token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Forgot password request
 * @param {Object} data - Email address
 * @returns {Promise} Response message
 */
export const forgotPassword = async (data) => {
  try {
    const response = await api.post("/auth/forget-password", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 * @param {Object} data - Token and new password
 * @returns {Promise} Response message
 */
export const resetPassword = async (data) => {
  try {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
