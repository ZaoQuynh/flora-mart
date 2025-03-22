import { useState } from "react";
import { getMyOrders, getById, cancelOrder, receiveOrder } from "@/scripts/orderApi";
import { Order } from "@/models/Order";

export const useOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getOrderById = async (orderId: number): Promise<Order | null> => {
        setLoading(true);
        try {
            const response = await getById(orderId);
            setLoading(false);
            return response || null;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch order");
            throw err;
        }
    }

    const handleGetMyOrders = async (): Promise<Order[] | null> => {
        setLoading(true);
        try {
            const response = await getMyOrders();
            setLoading(false);
            return response || null;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch your orders");
            throw err;
        }
    };

    const handleCancelOrder = async (orderId: number): Promise<Order | null> => {
        setLoading(true);
        try {
            const response = await cancelOrder(orderId);
            setLoading(false);
            return response || null;
        } catch (err) {
            setLoading(false);
            setError("Failed to cancel order");
            throw err;
        }
    };

    const handleReceiveOrder = async (orderId: number): Promise<Order | null> => {
        setLoading(true);
        try {
            const response = await receiveOrder(orderId);
            setLoading(false);
            return response || null;
        } catch (err) {
            setLoading(false);
            setError("Failed to confirm order receipt");
            throw err;
        }
    };

    return { 
        handleGetMyOrders, 
        getOrderById,
        handleCancelOrder, 
        handleReceiveOrder, 
        loading, 
        error 
    };
};
