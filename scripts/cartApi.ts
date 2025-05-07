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
        const response = await api.post('/cart/my-cart-id', );
        console.log("Get cart successfully!!");
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

export const getCartId = async () => {
    try {
        const userId = await AsyncStorage.getItem(Strings.AUTH.USER_ID);
        const response = await api.post('/cart/my-cart-id', userId);
        console.log("Get cart id successfully!!");
        return response.data;
    } catch (error) {
        console.error("Error fetching cart id:", error);
        throw error;
    }
};

export const addToCart = async (productId: number, cartId: number) => {
    try {
        const data = {
            productDTO: {id: productId},
            cartDTO: { id: cartId }
        };
        const response = await api.post('/orderItem', data);
        console.log("Add to cart successfully!!");
        return response.data;
    } catch (error) {
        console.error("Error order item:", error);
        throw error;
    }
};


export const checkOut = async (cartId: number, address: string, type: number, voucherId: number, phone: string) => {
    try {
        const checkoutData = {
            cartDTO: { id: cartId },
            address: address,
            type: type,
            voucherId,
            phone: phone,
        };

        const response = await api.post('/cart/check-out', checkoutData);
        console.log("Checkout Successfully!!");
        return response.data;
    } catch (error) {
        console.error("Checkout Error:", error);
        throw error;
    }
};
