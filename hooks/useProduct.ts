import { Product } from "@/models/Product";
import { getProducts, findTop10SimilarProducts, getProductByIds} from "@/scripts/productApi";
import { useState } from "react";
import Strings from "../constants/Strings";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetProducts = async (): Promise<Product[] | null> => {
        setLoading(true);
        try {
            const response = await getProducts();
            setLoading(false);

            if (!response) return null;

            const products: Product[] = response;
            return products;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch products");
            throw err;
        }
    };

    const handleFindTop10SimilarProducts = async (productId: number): Promise<Product[] | null> => {
        setLoading(true);
        try {
            const response = await findTop10SimilarProducts(productId);
            setLoading(false);

            if (!response) return null;

            const products: Product[] = response;
            return products;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch similar products");
            throw err;
        }
    };

    const handleAddToRecentlyViewed = async (productId: number): Promise<void> => {
        try {
            const data = await AsyncStorage.getItem(Strings.PRODUCT.RECENTLY_VIEWED_KEY);
            let ids: number[] = data ? JSON.parse(data) : [];

            ids = [productId, ...ids.filter(id => id !== productId)];

            if (ids.length > Strings.PRODUCT.MAX_RECENT_ITEMS) {
                ids = ids.slice(0, Strings.PRODUCT.MAX_RECENT_ITEMS);
              }
          
            await AsyncStorage.setItem(Strings.PRODUCT.RECENTLY_VIEWED_KEY, JSON.stringify(ids));
        } catch (error) {
            console.error('Error saving recently viewed:', error);
        }
    };

    const handleGetProductRecentlyViewed = async (): Promise<Product[] | null> => {
        try {
            const data = await AsyncStorage.getItem(Strings.PRODUCT.RECENTLY_VIEWED_KEY);
            let ids: number[] = data ? JSON.parse(data) : [];

            if (ids.length === 0) return null;

            console.log('Recently viewed IDs:', ids);

            const response = await getProductByIds(ids);
            return response;
        }
        catch (error) {
            console.error('Error fetching recently viewed:', error);
            return [];
        }
    }

    return { handleGetProducts, handleFindTop10SimilarProducts, handleAddToRecentlyViewed, handleGetProductRecentlyViewed, loading, error };
};
