import { Voucher } from "@/models/Voucher";
import { getVouchers } from "@/scripts/voucherApi";
import { useState } from "react";

export const useVoucher = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetVouchers = async (id: any): Promise<Voucher[] | null> => {
        setLoading(true);
        try {
            const response = await getVouchers(id);
            setLoading(false);

            if (!response) return null;

            const products: Voucher[] = response;
            return products;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch vouchers");
            throw err;
        }
    };

    return { handleGetVouchers, loading, error };
};
