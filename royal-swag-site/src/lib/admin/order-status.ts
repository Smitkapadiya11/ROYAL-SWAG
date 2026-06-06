export const ORDER_STATUS_OPTIONS = [
  "Pending",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatusLabel = (typeof ORDER_STATUS_OPTIONS)[number];

export function dbStatusToLabel(status: string): OrderStatusLabel {
  const s = status.toLowerCase();
  if (s === "pending" || s === "paid") return "Pending";
  if (s === "processing") return "Packed";
  if (s === "shipped") return "Shipped";
  if (s === "delivered") return "Delivered";
  if (s === "cancelled") return "Cancelled";
  return "Pending";
}

export function labelToDbStatus(label: OrderStatusLabel): string {
  switch (label) {
    case "Pending":
      return "pending";
    case "Packed":
      return "processing";
    case "Shipped":
      return "shipped";
    case "Delivered":
      return "delivered";
    case "Cancelled":
      return "cancelled";
    default:
      return "pending";
  }
}

export function statusBadgeClass(label: OrderStatusLabel): string {
  switch (label) {
    case "Pending":
      return "bg-amber-100 text-amber-900";
    case "Packed":
      return "bg-blue-100 text-blue-900";
    case "Shipped":
      return "bg-purple-100 text-purple-900";
    case "Delivered":
      return "bg-green-100 text-green-900";
    case "Cancelled":
      return "bg-red-100 text-red-900";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
