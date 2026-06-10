"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import MobileStickyBar from "@/components/ui/MobileStickyBar";
import {
  resolveBarCheckout,
  useConversionBar,
} from "@/contexts/ConversionBarContext";
import { useCheckoutUi } from "@/contexts/CheckoutUiContext";

export default function MobileStickyBarHost() {
  const pathname = usePathname() ?? "/";
  const { config } = useConversionBar();
  const { showCheckout, openCheckout, setShowCheckout } = useCheckoutUi();
  const [hostCheckoutOpen, setHostCheckoutOpen] = useState(false);

  const checkout = resolveBarCheckout(config);
  const onProductPage = pathname === "/product";
  const modalOpen = onProductPage ? showCheckout : hostCheckoutOpen;

  const handleStickyBuy = useCallback(() => {
    if (config?.onBuyNow) {
      config.onBuyNow();
      return;
    }
    if (onProductPage) {
      openCheckout();
      return;
    }
    setHostCheckoutOpen(true);
  }, [config, onProductPage, openCheckout]);

  const handleClose = useCallback(() => {
    if (onProductPage) {
      setShowCheckout(false);
    } else {
      setHostCheckoutOpen(false);
    }
  }, [onProductPage, setShowCheckout]);

  return (
    <>
      <MobileStickyBar onBuyNow={handleStickyBuy} />
      {!onProductPage ? (
        <CheckoutModal
          open={modalOpen}
          onClose={handleClose}
          price={checkout.price}
          mrp={checkout.mrp}
          packId={checkout.packId}
          packLabel={checkout.packLabel}
        />
      ) : null}
    </>
  );
}
