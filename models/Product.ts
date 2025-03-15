import { Plant } from "./Plant";
import { Review } from "./Review";

export interface Product {
    id: number;
    plant: Plant;
    price: number;
    discount: number;
    stockQty: number;
    reviews: Review[];
    isDeleted: boolean;
}