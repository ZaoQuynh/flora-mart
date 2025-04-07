import { Review } from '@/models/Review';
import { useState } from "react";
import { getReviewsByProductId , addReview } from "@/scripts/reviewApi";
import { User } from '@/models/User';

export const useReview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetReviews = async (productId: number): Promise<Review[] | null> => {
        setLoading(true);
        try {
            const response = await getReviewsByProductId(productId);
            setLoading(false);

            if (!response) return null;

            const reviews: Review[] = response;
            return reviews;
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch reviews");
            throw err;
        }
    };

    const handleSubmitReview = async (orderItemId: number, customer: User, rate: number, comment: string): Promise<Review | null> => {
        setLoading(true);
        try {
            const response = await addReview(orderItemId, customer, rate, comment);
            setLoading(false);

            if (!response) return null;

            const review: Review = response;
            return review;
        } catch (err) {
            setLoading(false);
            setError("Failed to submit review");
            throw err;
        }
    };

    return { handleGetReviews, handleSubmitReview,  loading, error };
};
