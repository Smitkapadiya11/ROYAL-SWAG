"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_PRODUCT_BUNDLE } from "@/lib/bundle-options";
import { getPrimaryProductPrice } from "@/lib/product-price";

export type ConversionBarConfig = {
  productName?: string;
  price?: number;
  packId?: string;
  packLabel?: string;
  mrp?: number;
  onBuyNow?: () => void;
};

type ConversionBarContextValue = {
  config: ConversionBarConfig | null;
  setBarConfig: (config: ConversionBarConfig | null) => void;
  heroBuyDismissed: boolean;
  dismissHeroBuy: () => void;
};

const ConversionBarContext = createContext<ConversionBarContextValue | null>(null);

export function ConversionBarProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConversionBarConfig | null>(null);
  const [heroBuyDismissed, setHeroBuyDismissed] = useState(false);

  const setBarConfig = useCallback((next: ConversionBarConfig | null) => {
    setConfig(next);
  }, []);

  const dismissHeroBuy = useCallback(() => {
    setHeroBuyDismissed(true);
  }, []);

  const value = useMemo(
    () => ({
      config,
      setBarConfig,
      heroBuyDismissed,
      dismissHeroBuy,
    }),
    [config, setBarConfig, heroBuyDismissed, dismissHeroBuy]
  );

  return (
    <ConversionBarContext.Provider value={value}>
      {children}
    </ConversionBarContext.Provider>
  );
}

export function useConversionBar() {
  const ctx = useContext(ConversionBarContext);
  if (!ctx) {
    return {
      config: null as ConversionBarConfig | null,
      setBarConfig: () => {},
      heroBuyDismissed: false,
      dismissHeroBuy: () => {},
    };
  }
  return ctx;
}

export function resolveBarCheckout(config: ConversionBarConfig | null) {
  const price = config?.price ?? getPrimaryProductPrice();
  const packId = config?.packId ?? DEFAULT_PRODUCT_BUNDLE.id;
  const packLabel = config?.packLabel ?? DEFAULT_PRODUCT_BUNDLE.title;
  const mrp = config?.mrp ?? DEFAULT_PRODUCT_BUNDLE.mrp;
  const productName = config?.productName ?? "Royal Swag Lung Detox Tea";
  return { price, packId, packLabel, mrp, productName };
}
