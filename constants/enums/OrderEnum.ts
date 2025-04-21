export const OrderEnum = Object.freeze({
    NEW: "NEW",
    CONFIRMED: "CONFIRMED",
    PREPARING: "PREPARING",
    SHIPPING: "SHIPPING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELED: "CANCELED"
  });

  export type OrderStatus = typeof OrderEnum[keyof typeof OrderEnum];