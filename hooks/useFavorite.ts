import { Product } from '@/models/Product';
import { useState } from "react";
import { getFavotites, addToFavorites, removeFromFavorites, checkFavorite } from '@/scripts/favoriteApi';

export const useFavorite = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

 
    const handleGetFavorites = async (userId: number): Promise<Product[] | null> => {
        setLoading(true);
        try {
            const response = await getFavotites(userId);
            setLoading(false);

            if (!response) return null;

            const favorites: Product[] = response;
            return favorites;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch favorites");
            throw err;
        }
    };

    const handleAddToFavorites = async (productId: number, userId: number): Promise<Product | null> => {
        setLoading(true);
        try {
            const response = await addToFavorites(productId, userId);
            setLoading(false);

            if (!response) return null;

            const favorite: Product = response;
            return favorite;
        } catch (err) {
            setLoading(false);
            setError("Failed to add to favorites");
            throw err;
        }
    };

    const handleRemoveFromFavorites = async (productId: number, userId: number): Promise<Product | null> => {
        setLoading(true);
        try {
            const response = await removeFromFavorites(productId, userId);
            setLoading(false);

            if (!response) return null;

            const favorite: Product = response;
            return favorite;
        } catch (err) {
            setLoading(false);
            setError("Failed to remove from favorites");
            throw err;
        }
    };

    const handleCheckFavorite = async (productId: number, userId: number): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await checkFavorite(productId, userId);
            setLoading(false);
            return response;
        } catch (err) {
            setLoading(false);
            setError("Failed to check favorite");
            throw err;
        }
    };
        
    

    return { handleGetFavorites, handleAddToFavorites, handleRemoveFromFavorites, handleCheckFavorite, loading, error };
};
