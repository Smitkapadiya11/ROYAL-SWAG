"use client";

import styled from "styled-components";
import { cn } from "@/lib/utils";

type ProductBuyButtonProps = {
  price: number;
  mrp: number;
  packLabel: string;
  savingPct: number;
  onClick: () => void;
  size?: "default" | "compact";
  className?: string;
};

export default function ProductBuyButton({
  price,
  mrp,
  packLabel,
  savingPct,
  onClick,
  size = "default",
  className,
}: ProductBuyButtonProps) {
  const compact = size === "compact";

  return (
    <Root className={cn(className)}>
      <PressButton
        type="button"
        onClick={onClick}
        $compact={compact}
        aria-label={`Buy Now — ${packLabel} for ₹${price}`}
      >
        <Face className="buy-face" $compact={compact}>
          <Icon $compact={compact} aria-hidden>
            🛍
          </Icon>
          <Copy>
            <Title $compact={compact}>Buy Now</Title>
            <Subtitle $compact={compact}>
              {packLabel} · Save {savingPct}%
            </Subtitle>
          </Copy>
          <Pricing>
            <Price $compact={compact}>₹{price}</Price>
            {!compact && <Mrp>₹{mrp}</Mrp>}
            {compact && <MrpInline>₹{mrp}</MrpInline>}
          </Pricing>
        </Face>
      </PressButton>
      {!compact && (
        <TrustStrip>
          <span>Free Delivery</span>
          <Dot aria-hidden />
          <span>COD Available</span>
          <Dot aria-hidden />
          <span>30-Day Guarantee</span>
        </TrustStrip>
      )}
    </Root>
  );
}

const Root = styled.div`
  width: 100%;
`;

const PressButton = styled.button<{ $compact: boolean }>`
  position: relative;
  display: block;
  width: 100%;
  cursor: pointer;
  outline: none;
  border: 0;
  padding: 0;
  font-family: var(--font-sans), "DM Sans", sans-serif;
  font-size: ${({ $compact }) => ($compact ? "13px" : "15px")};
  transform-style: preserve-3d;
  transition:
    transform 150ms cubic-bezier(0, 0, 0.58, 1),
    filter 150ms cubic-bezier(0, 0, 0.58, 1);
  border-radius: ${({ $compact }) => ($compact ? "0.65em" : "0.85em")};

  &::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: inherit;
    background: #1a2410;
    box-shadow:
      0 0 0 2px #324023,
      0 ${({ $compact }) => ($compact ? "0.45em" : "0.625em")} 0 0 #495738;
    transform: translate3d(0, ${({ $compact }) => ($compact ? "0.5em" : "0.75em")}, -1em);
    transition:
      transform 150ms cubic-bezier(0, 0, 0.58, 1),
      box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
    pointer-events: none;
  }

  &:hover {
    transform: translate(0, 0.25em);
  }

  &:hover::before {
    box-shadow:
      0 0 0 2px #324023,
      0 ${({ $compact }) => ($compact ? "0.3em" : "0.5em")} 0 0 #495738;
    transform: translate3d(0, ${({ $compact }) => ($compact ? "0.35em" : "0.5em")}, -1em);
  }

  &:active {
    transform: translate(0, ${({ $compact }) => ($compact ? "0.5em" : "0.75em")});
  }

  &:active::before {
    box-shadow: 0 0 0 2px #324023, 0 0 0 0 #495738;
    transform: translate3d(0, 0, -1em);
  }

  &:focus-visible .buy-face {
    outline: 2px solid #9a6f1a;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none !important;

    &::before {
      transform: translate3d(0, 0.35em, -1em);
      transition: none;
    }

    &:hover,
    &:active {
      transform: none;
    }
  }
`;

const Face = styled.span<{ $compact: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ $compact }) => ($compact ? "0.65rem" : "1rem")};
  width: 100%;
  text-align: left;
  border-radius: inherit;
  padding: ${({ $compact }) => ($compact ? "0.85em 1em" : "1.1em 1.25em")};
  background: linear-gradient(180deg, #b37d1c 0%, #9a6f1a 48%, #8a6318 100%);
  border: 2px solid rgba(244, 237, 214, 0.45);
  color: #f4edd6;
  transform: translateZ(0);
  transition: background 150ms cubic-bezier(0, 0, 0.58, 1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);

  ${PressButton}:hover & {
    background: linear-gradient(180deg, #c4922a 0%, #b0841f 48%, #9a6f1a 100%);
  }

  ${PressButton}:active & {
    background: linear-gradient(180deg, #9a6f1a 0%, #8a6318 100%);
  }
`;

const Icon = styled.span<{ $compact: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $compact }) => ($compact ? "2.25rem" : "2.75rem")};
  height: ${({ $compact }) => ($compact ? "2.25rem" : "2.75rem")};
  border-radius: 0.55em;
  background: rgba(50, 64, 35, 0.28);
  border: 1px solid rgba(244, 237, 214, 0.25);
  font-size: ${({ $compact }) => ($compact ? "1rem" : "1.2rem")};
`;

const Copy = styled.span`
  min-width: 0;
  flex: 1;
  overflow: hidden;
`;

const Title = styled.span<{ $compact: boolean }>`
  display: block;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: ${({ $compact }) => ($compact ? "0.82rem" : "0.95rem")};
  color: #f4edd6;
  line-height: 1.2;
`;

const Subtitle = styled.span<{ $compact: boolean }>`
  display: block;
  margin-top: 0.2em;
  font-weight: 500;
  font-size: ${({ $compact }) => ($compact ? "0.62rem" : "0.72rem")};
  color: rgba(244, 237, 214, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Pricing = styled.span`
  flex-shrink: 0;
  text-align: right;
`;

const Price = styled.span<{ $compact: boolean }>`
  display: block;
  font-family: var(--font-sans), "DM Sans", sans-serif;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  font-size: ${({ $compact }) => ($compact ? "1.15rem" : "1.65rem")};
  color: #f4edd6;
  line-height: 1.1;
  text-shadow: 0 1px 0 rgba(50, 64, 35, 0.35);
`;

const Mrp = styled.span`
  display: block;
  margin-top: 0.15em;
  font-size: 0.72rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: rgba(244, 237, 214, 0.55);
  text-decoration: line-through;
`;

const MrpInline = styled.span`
  display: block;
  margin-top: 0.1em;
  font-size: 0.58rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: rgba(244, 237, 214, 0.5);
  text-decoration: line-through;
`;

const TrustStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  margin-top: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.65em;
  background: rgba(50, 64, 35, 0.08);
  border: 1px solid rgba(50, 64, 35, 0.12);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #495738;
`;

const Dot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #9a6f1a;
  opacity: 0.7;
`;
