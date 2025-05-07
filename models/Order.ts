import { OrderItem } from "./OrderItem";
import { Payment } from "./Payment";
import { User } from "./User";
import { Voucher } from "./Voucher";

export interface Order {
    id: number;
    customer: User;
    orderItems: OrderItem[];
    status: string;
    createDate: Date;
    vouchers: Voucher[];
    payment: Payment;
    address: string;
}