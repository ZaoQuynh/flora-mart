import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from '../constants/apiConfig';
import Strings from "../constants/Strings";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
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

export const getCart = async () => {
    try {
        const response = await api.get('/cart/my-cart');
        console.log("Successfully!!");
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

// Hàm thanh toán
export const checkOut = async (cartId: number, address: string, type: number) => {
    try {
        const checkoutData = {
            cartDTO: { id: cartId },
            address: address,
            type: type
        };

        const response = await api.post('/cart/check-out', checkoutData);
        console.log("Checkout Successfully!!");
        return response.data;
    } catch (error) {
        console.error("Checkout Error:", error);
        throw error;
    }
};
