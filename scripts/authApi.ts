import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (fullName: String, email: String, username: String, phoneNumber: String, password: String) => {
  const response = await api.post('/auth/register', { fullName, email, username, phoneNumber, password });
  return response.data;
};

export const verify = async (email: string) => {
  const response = await api.put(`/auth/verify`, { email });
  return response.data;
}

export const checkEmail = async (email: string) => {
  const response = await api.post(`/auth/check-email`, { email });
  return response.data;
}

export const checkUsername = async (username: string) => {
  const response = await api.post(`/auth/check-username`, { username });
  return response.data;
}

export const resetPassword = async (email: string, newPassword: string) => {
  const response = await api.put(`/auth/reset-password`, { email, newPassword });
  return response.data;
}
