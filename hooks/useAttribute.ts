import { Attribute } from "../models/Attribute";
import { getAttributes } from "../scripts/attributeApi";
import { useState } from "react";

export const useAttribute = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetAttributes = async (): Promise<Attribute[] | null> => {
        setLoading(true);
        try {
            const response = await getAttributes();
            setLoading(false);

            if (!response) return null;

            const attributes: Attribute[] = response;
            return attributes;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch attributes");
            throw err;
        }
    };

    return { handleGetAttributes, loading, error };
};
