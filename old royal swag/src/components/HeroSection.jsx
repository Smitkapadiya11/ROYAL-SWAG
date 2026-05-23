"use client";
import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import RoyalButton from './ui/RoyalButton';
import { trackEvent } from '../lib/events';

const HERO_IMAGE_CANDIDATES = [
  '/images/hero/asset1-hero-product.jpeg',
  '/images/hero/asset1-hero-product.jpg',
  '/images/hero/asset1-hero-product.png',
  '/images/product/product-1.jpg',
  '/images/product/product-2.jpg',
];

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-16px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(154, 111, 26, 0.5); }
  70% { box-shadow: 0 0 0 10px rgba(154, 111, 26, 0); }
  100% { box-shadow: 0 0 0 0 rgba(154, 111, 26, 0); }
`;

const HeroContainer = styled.section`
  min-height: 100vh;
  background: #F4EDD6;
  padding: 48px 8% 64px;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 55% 45%;
    align-items: center;
    gap: 24px;
  }

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    background: #495738;
    padding: 32px 20px 24px;
    min-height: auto;
    text-align: center;
  }
`;

const TextStack = styled.div`
  @media (min-width: 768px) {
    grid-column: 1;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 767px) {
    display: contents;
  }
`;

const ImageCol = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    grid-column: 2;
    grid-row: 1;
  }

  @media (max-width: 767px) {
    order: 4;
    width: 100%;
    margin: 8px 0 16px;
  }
`;

const ProductImageWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  min-height: 400px;
  @media (max-width: 767px) {
    width: 85vw;
    max-width: 85vw;
    min-height: 280px;
  }

  @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const PreHeadline = styled.p`
  font-variant: small-caps;
  color: #9A6F1A;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 16px;
  font-size: 14px;

  @media (max-width: 767px) {
    order: 1;
  }
`;

const Headline = styled.h1`
  font-size: 52px;
  color: #495738;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;

  @media (max-width: 767px) {
    order: 2;
    font-size: clamp(28px, 8vw, 42px);
    color: #F4EDD6;
    line-height: 1.15;
  }
`;

const Subheadline = styled.p`
  font-size: 18px;
  color: #495738;
  line-height: 1.5;
  margin-bottom: 0;

  @media (max-width: 767px) {
    order: 3;
    color: #F4EDD6;
    opacity: 0.92;
    font-size: 16px;
  }
`;

const PriceBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;

  @media (max-width: 767px) {
    order: 5;
    justify-content: center;
    margin: 20px 0 16px;
  }
`;

const OldPrice = styled.span`
  text-decoration: line-through;
  color: #495738;
  opacity: 0.6;
  font-size: 20px;

  @media (max-width: 767px) {
    color: #F4EDD6;
    opacity: 0.7;
  }
`;

const NewPrice = styled.span`
  font-size: 32px;
  font-weight: bold;
  color: #495738;

  @media (max-width: 767px) {
    color: #F4EDD6;
  }
`;

const SaveBadge = styled.span`
  background: #9A6F1A;
  color: #F4EDD6;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
`;

const CTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 767px) {
    order: 6;
    align-items: center;
    width: 100%;
    margin-bottom: 16px;
  }
`;

const BuyNowBtn = styled.div`
  width: 100%;
  max-width: 360px;
`;

const SecondaryLink = styled(Link)`
  color: #9A6F1A;
  text-decoration: underline;
  font-size: 16px;
  font-weight: bold;

  @media (max-width: 767px) {
    color: #F4EDD6;
  }
`;

const TrustStripInline = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  font-size: 12px;
  color: #495738;
  opacity: 0.8;
  font-weight: 500;
  flex-wrap: wrap;

  @media (max-width: 767px) {
    display: none;
  }
`;

const LiveBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 0;
  background: #9A6F1A;
  color: #F4EDD6;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${pulse} 2s infinite;
  }
  z-index: 10;
  white-space: nowrap;

  @media (max-width: 767px) {
    top: 0;
    right: 50%;
    transform: translateX(50%);
  }
`;

function HeroProductImage({ src, onError }) {
  return (
    <ProductImageWrap>
      <LiveBadge>147 people ordered today</LiveBadge>
      <Image
        src={src}
        alt="Royal Swag Lung Detox Tea"
        fill
        style={{ objectFit: 'contain' }}
        priority
        sizes="(max-width: 767px) 85vw, 500px"
        onError={onError}
      />
    </ProductImageWrap>
  );
}

export default function HeroSection() {
  const [heroSrc, setHeroSrc] = useState(HERO_IMAGE_CANDIDATES[0]);
  const heroFallbackRef = useRef(0);

  const handleBuyNow = () => {
    trackEvent('hero_cta_click');
    window.location.href = '/product';
  };

  const onHeroImageError = () => {
    const next = heroFallbackRef.current + 1;
    if (next < HERO_IMAGE_CANDIDATES.length) {
      heroFallbackRef.current = next;
      setHeroSrc(HERO_IMAGE_CANDIDATES[next]);
    }
  };

  return (
    <HeroContainer>
      <TextStack>
        <PreHeadline>TAR OUT · LUNG DETOX TEA</PreHeadline>
        <Headline>Breathe Freely Again.</Headline>
        <Subheadline>
          A deeply purifying Ayurvedic blend of seven potent herbs to detoxify your lungs, clear
          respiratory pathways, and combat the effects of daily pollution.
        </Subheadline>

        <PriceBlock>
          <OldPrice>₹499</OldPrice>
          <NewPrice>₹349</NewPrice>
          <SaveBadge>SAVE ₹150</SaveBadge>
        </PriceBlock>

        <CTAContainer>
          <BuyNowBtn>
            <RoyalButton onClick={handleBuyNow} style={{ width: '100%' }}>
              Buy Now — ₹349
            </RoyalButton>
          </BuyNowBtn>
          <SecondaryLink href="/lung-test" onClick={() => trackEvent('lung_test_click')}>
            Take the Free Lung Test →
          </SecondaryLink>
        </CTAContainer>

        <TrustStripInline>
          <span>✓ FSSAI Certified</span>
          <span>·</span>
          <span>✓ AYUSH Approved</span>
          <span>·</span>
          <span>✓ ISO & GMP</span>
          <span>·</span>
          <span>✓ 4.7★ (847+ reviews)</span>
        </TrustStripInline>
      </TextStack>

      <ImageCol>
        <HeroProductImage src={heroSrc} onError={onHeroImageError} />
      </ImageCol>
    </HeroContainer>
  );
}
