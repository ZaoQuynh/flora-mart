import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/apiConfig";
import Strings from "../constants/Strings";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
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

export const getProducts = async () => {
  try {
    const response = await api.get('/product');
    return response.data;
    } catch (error) {
      throw error;
  }
}

export const findTop10SimilarProducts = async (productId: number) => {
  try {
    const response = await api.get(`/product/similar/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getProductByIds = async (ids: number[]) => {
  try {
    const response = await api.post('/product/get-by-ids', { ids });
    return response.data;
  } catch (error) {
    throw error;
  }
}