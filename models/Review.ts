import { User } from "./User";

export interface Review {
    id: number;
    customer: User;
    rate: number;
    comment: string;
    feedback: string;
    date: Date;
}