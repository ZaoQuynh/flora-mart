import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/apiConfig";
import Strings from "../constants/Strings";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export const updateUserInfo = async (id: number, fullName: string, username: string, phoneNumber: string, avatar: string) => {
  try {
      const response = await api.patch("/user/update", { id, fullName, username, phoneNumber, avatar });
      return response.data;
  } catch (error) {
      throw error;
  }
};