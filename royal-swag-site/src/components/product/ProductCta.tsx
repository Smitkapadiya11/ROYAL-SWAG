"use client";

import type { ReactNode } from "react";
import { useConversionBar } from "@/contexts/ConversionBarContext";
import { cn } from "@/lib/utils";

type ProductCtaProps = {
  price: number;
  mrp: number;
  discountPct: number;
  onBuyNow: () => void;
  onAddToCart: () => void;
  className?: string;
  beforeBuy?: ReactNode;
  afterBuy?: ReactNode;
  hideDeliveryNote?: boolean;
};

export function ProductCta({
  price,
  mrp,
  discountPct,
  onBuyNow,
  onAddToCart,
  className,
  beforeBuy,
  afterBuy,
  hideDeliveryNote = false,
}: ProductCtaProps) {
  const { dismissHeroBuy } = useConversionBar();

  const handleBuyNow = () => {
    dismissHeroBuy();
    onBuyNow();
  };

  return (
    <div className={cn("product-cta-wrapper", className)}>
      <div className="price-display">
        <span className="price-current font-number tabular-nums">₹{price}</span>
        <span className="price-original font-number tabular-nums">₹{mrp}</span>
        <span className="badge-discount">{discountPct}% OFF</span>
      </div>

      {beforeBuy}

      <button
        type="button"
        id="buy-now-btn"
        data-hero-buy-cta
        onClick={handleBuyNow}
        className="btn-buy-now"
        data-track-button="product-buy-now"
        data-track-label={`Buy Now — ₹${price}`}
      >
        Buy Now — ₹{price}
      </button>

      <button
        type="button"
        onClick={onAddToCart}
        className="btn-add-cart"
        data-track-button="product-add-cart"
        data-track-label="Add to Cart"
      >
        Add to Cart
      </button>

      {afterBuy}

      {!hideDeliveryNote ? (
        <p className="delivery-note">
          🚚 Free Delivery · Ships in 24 Hours · 30-Day Guarantee
        </p>
      ) : null}
    </div>
  );
}
