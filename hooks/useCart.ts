import { getCart, checkOut } from "@/scripts/cartApi";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Strings from "../constants/Strings";
import { User } from "@/models/User";

export const useCart = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState([]);

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

    // Hàm thêm sản phẩm vào giỏ hàng
    // const handleAddToCart = async (customerId: number, productId: number, quantity: number) => {
    //     setLoading(true);
    //     setError(null); // Xóa lỗi trước đó (nếu có)
    
    //     try {
    //         const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);
    //         if (!token) {
    //             throw new Error("No token found");
    //         }
    
    //         // // Gọi API thêm sản phẩm vào giỏ hàng
    //         // const response = await addToCart(customerId, productId, quantity);
    //         // console.log("Response từ API:", response);
    
    //         setLoading(false);
    //         return response;
    //     } catch (err) {
    //         setLoading(false);
    //         setError(err.message || "Failed to add item to cart");
    //         console.error("Error adding to cart:", err);
    //         throw err;
    //     }
    // };
    const handleCheckout = async (cartId: number, address: string, type: number) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);
            if (!token) {
                throw new Error("No token found");
            }

            const response = await checkOut(cartId, address, type);
            setCartItems(response);
            setLoading(false);
            return response;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch cart items");
            throw err;
        }
    };
    
    return { handleCheckout, handleGetItemsCart, loading, error, cartItems };
};
