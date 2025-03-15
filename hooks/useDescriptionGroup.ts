import { DescriptionGroup } from "@/models/DescriptionGroup";
import { getDescriptionGroups } from "../scripts/descriptionGroupApi";
import { useState } from "react";

export const useDescriptionGroup = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetDescriptionGroups = async (): Promise<DescriptionGroup[] | null> => {
        setLoading(true);
        try {
            const response = await getDescriptionGroups();
            setLoading(false);

            if (!response) return null;

            const descriptions: DescriptionGroup[] = response;
            return descriptions;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch descriptions");
            throw err;
        }
    };

    return { handleGetDescriptionGroups, loading, error };
};
