import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description:
    "Read what Royal Swag customers say about our herbal lung detox tea — ratings, cities, and real experiences from across India.",
};

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return children;
}
