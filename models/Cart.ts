import { User } from "./User";
import { OrderItem } from "./OrderItem";

export interface Cart {
    id: number;
    customer: User;
    orderItems: OrderItem[];
}