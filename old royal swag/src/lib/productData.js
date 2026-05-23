export const BUNDLES = [
  {
    id: "starter",
    label: "Starter Pack",
    subtitle: "15 days · 1 pack",
    bags: 20,
    supply: "15-day supply",
    price: 349,
    originalPrice: 499,
    pricePerPack: 349,
    badge: null,
  },
  {
    id: "progress",
    label: "Progress Pack",
    subtitle: "30 days · 2 packs",
    bags: 40,
    supply: "30-day supply",
    price: 599,
    originalPrice: 698,
    pricePerPack: 300,
    badge: "RECOMMENDED",
    badgeBg: "#9A6F1A",
    default: true,
  },
  {
    id: "result",
    label: "Result Pack",
    subtitle: "45 days · 3 packs",
    bags: 60,
    supply: "45-day supply",
    price: 849,
    originalPrice: 1047,
    pricePerPack: 283,
    badge: "BEST VALUE",
    badgeBg: "#495738",
  },
];

export const DEFAULT_BUNDLE =
  BUNDLES.find((b) => b.default) ?? BUNDLES[1];
