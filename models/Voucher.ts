import { VoucherType } from "./VoucherType";

export interface Voucher {
    id: number;
    code: string;
    discount: number;
    createDate: Date;
    startDate: Date;
    endDate: Date;
    type: VoucherType;
    description: string;
    minOrderAmount: number;
    maxDiscount: number;
}