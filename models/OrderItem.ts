import { Product } from "./Product";
import { Review } from "./Review";

export interface OrderItem {
    id: number;
    product: Product;
    qty: number;
    discounted: number;
    currentPrice: number;
    review: Review;
}