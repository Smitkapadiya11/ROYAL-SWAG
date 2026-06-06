/** Session snapshot written after successful Razorpay verification (product page). */
export const RS_ORDER_CONFIRMATION_KEY = "rs_order_confirmation";

export type StoredOrderConfirmation = {
  name: string;
  mobile: string;
  package: string;
  amount: number;
  orderId: string;
  paymentId: string;
};
