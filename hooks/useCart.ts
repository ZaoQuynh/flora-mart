import { getCart, checkOut, addToCart, getCartId } from "@/scripts/cartApi";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Strings from "../constants/Strings";
import { User } from "@/models/User";

export const useCart = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState();

    const handleGetItemsCart = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);
            if (!token) {
                throw new Error("No token found");
            }

            const response = await getCart();
            //console.log(response)
            setCartItems(response);
            setLoading(false);
            return response;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch cart items");
            throw err;
        }
    };

    const handleAddToCart = async (productId: number, cartId: number) => {
        setLoading(true);
        setError(null);
    
        try {
            const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);
            if (!token) {
                throw new Error("No token found");
            }
            const response = await addToCart(productId, cartId);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError("Failed to add item to cart");
            console.error("Error adding to cart:", error);
            throw error;
        }
    };
    const handleCheckout = async (cartId: number, address: string, type: number, voucherId: number) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);
            if (!token) {
                throw new Error("No token found");
            }

            const response = await checkOut(cartId, address, type, voucherId);
            setCartItems(response);
            setLoading(false);
            return response;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch cart items");
            throw err;
        }
    };

    const handleGetCartId = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);
            if (!token) {
                throw new Error("No token found");
            }

            const response = await getCartId();
            console.log("cartId là: "+response)
            setCartId(response);
            setLoading(false);
            return response;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch cart items");
            throw err;
        }
    };
    
    return { handleAddToCart, handleCheckout, handleGetItemsCart, handleGetCartId, loading, error, cartItems };
};
