import { Product } from "@/models/Product";
import { getProducts } from "@/scripts/productApi";
import { useState } from "react";

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

    return { handleGetProducts, loading, error };
};
