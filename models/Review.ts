import { User } from "./User";

export interface Review {
    id: number;
    customer: User;
    rate: number;
    commnent: string;
    feedback: string;
    date: Date;
}