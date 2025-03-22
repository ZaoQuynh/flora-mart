import { Product } from "./Product";
import { Review } from "./Review";

export interface OrderItem {
    id: number;
    product: Product;
    discounted: number;
    qty: number;
    currentPrice: number;
    review: Review | null;  
}