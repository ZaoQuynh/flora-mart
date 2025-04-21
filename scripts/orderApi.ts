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

export const getMyOrders = async () => {
    try {
        const response = await api.get('/order/my-order-flow-stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getById = async (orderId: number) => {
    try {
        const response = await api.get(`/order/${orderId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

export const cancelOrder = async (orderId: number) => {
    try {
        const response = await api.patch(`/order/cancel/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const receiveOrder = async (orderId: number) => {
    try {
        const response = await api.patch(`/order/receive/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};