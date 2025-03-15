import { AttributeGroup } from "../models/AttributeGroup";
import { getAttributeGroups } from "../scripts/attributeGroupApi";
import { useState } from "react";

export const useAttributeGroup = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetAttributeGroups = async (): Promise<AttributeGroup[] | null> => {
        setLoading(true);
        try {
            const response = await getAttributeGroups();
            setLoading(false);

            if (!response) return null;

            const attributes: AttributeGroup[] = response;
            return attributes;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch attributes");
            throw err;
        }
    };

    return { handleGetAttributeGroups, loading, error };
};
