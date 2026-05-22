"use client";
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Image from 'next/image';
import RoyalButton from './ui/Button';
import { trackEvent } from '../lib/events';

const float = keyframes`
  0% { transform: translateY(0px) rotate(15deg); }
  50% { transform: translateY(-20px) rotate(15deg); }
  100% { transform: translateY(0px) rotate(15deg); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(73, 87, 56, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(73, 87, 56, 0); }
  100% { box-shadow: 0 0 0 0 rgba(73, 87, 56, 0); }
`;

const HeroContainer = styled.section`
  min-height: calc(100vh - 36px - 64px);
  background: #F4EDD6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 10%;
  position: relative;
  overflow: hidden;

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 40px 20px;
    text-align: center;
    justify-content: center;
  }
`;

const ContentSide = styled.div`
  flex: 1;
  max-width: 600px;
  z-index: 2;

  @media (max-width: 992px) {
    margin-bottom: 40px;
  }
`;

const ImageSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const FloatingImageContainer = styled.div`
  position: relative;
  width: 400px;
  height: 500px;
  animation: ${float} 3s ease-in-out infinite;
  filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15));

  @media (max-width: 768px) {
    width: 280px;
    height: 350px;
  }
`;

const PreHeadline = styled.p`
  font-variant: small-caps;
  color: #9A6F1A;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const Headline = styled.h1`
  font-size: 52px;
  color: #495738;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Subheadline = styled.p`
  font-size: 18px;
  color: #2A3020;
  line-height: 1.5;
  margin-bottom: 32px;
`;

const PriceBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 992px) {
    justify-content: center;
  }
`;

const OldPrice = styled.span`
  text-decoration: line-through;
  color: #888;
  font-size: 20px;
`;

const NewPrice = styled.span`
  font-size: 32px;
  font-weight: bold;
  color: #495738;
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
  
  @media (max-width: 992px) {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    z-index: 99;
    background: #F4EDD6;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
  }
`;

const SecondaryLink = styled.button`
  background: none;
  border: none;
  color: #9A6F1A;
  text-decoration: underline;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
`;

const TrustStrip = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  font-size: 12px;
  color: #495738;
  opacity: 0.7;
  font-weight: 500;

  @media (max-width: 992px) {
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 120px;
  }
`;

const LiveBadge = styled.div`
  position: absolute;
  top: 20px;
  right: -20px;
  background: #495738;
  color: #F4EDD6;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  animation: ${pulse} 2s infinite;
  z-index: 10;
  
  @media (max-width: 768px) {
    right: 10px;
    top: 0;
  }
`;

export default function HeroSection() {
  const handleBuyNow = () => {
    trackEvent('hero_cta_click');
    // Razorpay trigger placeholder
    console.log("Trigger Razorpay");
  };

  const handleLungTest = () => {
    trackEvent('lung_test_click');
    window.location.href = '/lung-test';
  };

  return (
    <HeroContainer>
      <ContentSide>
        <PreHeadline>TAR OUT · LUNG DETOX TEA</PreHeadline>
        <Headline>
          Your lungs work hard.<br />
          Give them a break.
        </Headline>
        <Subheadline>
          Seven Ayurvedic herbs. One cup a day. Built for people who breathe polluted air, smoke, or used to.
        </Subheadline>
        
        <PriceBlock>
          <OldPrice>₹499</OldPrice>
          <NewPrice>₹349</NewPrice>
          <SaveBadge>SAVE ₹150</SaveBadge>
        </PriceBlock>
        
        <CTAContainer>
          <RoyalButton onClick={handleBuyNow} style={{ width: '100%', maxWidth: '300px' }}>
            Buy Now — ₹349
          </RoyalButton>
          <SecondaryLink onClick={handleLungTest}>
            Take the Free Lung Test →
          </SecondaryLink>
        </CTAContainer>
        
        <TrustStrip>
          <span>✓ FSSAI Certified</span>
          <span>·</span>
          <span>✓ AYUSH Approved</span>
          <span>·</span>
          <span>✓ ISO & GMP</span>
          <span>·</span>
          <span>✓ 4.7★ (847+ reviews)</span>
        </TrustStrip>
      </ContentSide>

      <ImageSide>
        <FloatingImageContainer>
          <LiveBadge>147 people ordered today</LiveBadge>
          <Image 
            src="/images/asset1-hero-product.jpg" 
            alt="Royal Swag Lung Detox Tea" 
            fill 
            style={{ objectFit: 'contain' }}
            priority
          />
        </FloatingImageContainer>
      </ImageSide>
    </HeroContainer>
  );
}
