const CART_KEY = "rs_cart";

export type CartItem = {
  packId: string;
  packLabel: string;
  price: number;
  mrp: number;
  quantity: number;
};

export function readCart(): CartItem | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CartItem;
  } catch {
    return null;
  }
}

export function writeCart(item: CartItem): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CART_KEY, JSON.stringify(item));
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CART_KEY);
}
