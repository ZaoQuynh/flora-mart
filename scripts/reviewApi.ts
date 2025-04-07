import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/apiConfig";
import Strings from "../constants/Strings";
import { User } from "@/models/User";

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

export const getReviewsByProductId = async (productId: number) => {
    try {
        const response = await api.get(`/review/${productId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const addReview = async (orderItemId: number, customer: User, rate: number, comment: string) => {
  try {
      const response = await api.post(`/review/${orderItemId}`, { customer, rate , comment });
      return response.data;
  } catch (error) {
      throw error;
  }
}