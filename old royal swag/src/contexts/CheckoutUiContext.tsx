"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CheckoutUiContextValue = {
  showCheckout: boolean;
  setShowCheckout: (show: boolean) => void;
  openCheckout: () => void;
  closeCheckout: () => void;
};

const CheckoutUiContext = createContext<CheckoutUiContextValue | null>(null);

export function CheckoutUiProvider({ children }: { children: ReactNode }) {
  const [showCheckout, setShowCheckout] = useState(false);

  const openCheckout = useCallback(() => setShowCheckout(true), []);
  const closeCheckout = useCallback(() => setShowCheckout(false), []);

  const value = useMemo(
    () => ({
      showCheckout,
      setShowCheckout,
      openCheckout,
      closeCheckout,
    }),
    [showCheckout, openCheckout, closeCheckout]
  );

  return (
    <CheckoutUiContext.Provider value={value}>
      {children}
    </CheckoutUiContext.Provider>
  );
}

export function useCheckoutUi() {
  const ctx = useContext(CheckoutUiContext);
  if (!ctx) {
    return {
      showCheckout: false,
      setShowCheckout: () => {},
      openCheckout: () => {},
      closeCheckout: () => {},
    };
  }
  return ctx;
}
