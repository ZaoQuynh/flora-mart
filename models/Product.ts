import { Plant } from "./Plant";

export interface Product {
    id: number;
    plant: Plant;
    price: number;
    discount: number;
    stockQty: number;
    isDeleted: boolean;
    soldQty: number;
}