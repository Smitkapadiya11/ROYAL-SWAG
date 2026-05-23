"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import MobileStickyBar from '@/components/ui/MobileStickyBar';
import CountdownTimer from '@/components/ui/CountdownTimer';
import ProductCheckout from '@/components/product/ProductCheckout';
import ProductJsonLd from '@/components/seo/ProductJsonLd';
import { BUNDLES, DEFAULT_BUNDLE } from '@/lib/productData';
import { EVENTS, trackEvent } from '@/lib/events';
import ProductViewTracker from '@/components/analytics/ProductViewTracker';

const PageContainer = styled.div`
  background: #F4EDD6;
  min-height: 100vh;
  padding-bottom: 24px;

  @media (max-width: 768px) {
    padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  
  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 20px;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 767px) {
    order: 2;
    margin-left: -20px;
    margin-right: -20px;
    width: calc(100% + 40px);
  }
`;

const MainImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background: #F4EDD6;
  border: 1px solid rgba(73, 87, 56, 0.1);
  img {
    object-fit: contain;
    transition: opacity 0.3s ease;
  }

  @media (max-width: 767px) {
    width: 100%;
    height: 300px;
    aspect-ratio: unset;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const ThumbnailStrip = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #49573840;
    border-radius: 4px;
  }

  @media (max-width: 767px) {
    height: 72px;
    gap: 8px;
    padding: 8px 16px;
    margin: 0 -20px;
  }
`;

const Thumb = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 2px solid ${(props) => (props.$active ? '#495738' : 'transparent')};
  background: #F4EDD6;
  img {
    object-fit: cover;
  }

  @media (max-width: 767px) {
    width: 64px;
    height: 64px;
    border-radius: 8px;
  }
`;

const PurchasePanel = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    order: 1;
    text-align: left;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  color: #495738;
  margin-bottom: 8px;
  line-height: 1.2;

  @media (max-width: 767px) {
    font-size: 22px;
    font-weight: 700;
    text-align: left;
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9A6F1A;
  font-weight: 600;
  margin-bottom: 16px;

  @media (max-width: 767px) {
    font-size: 14px;
    text-align: left;
  }
`;

const Badges = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  img {
    height: 32px;
    width: auto;
  }
`;

const PriceBlock = styled.div`
  margin-bottom: 24px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
`;

const CurrentPrice = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #495738;

  @media (max-width: 767px) {
    font-size: 28px;
  }
`;

const OldPrice = styled.div`
  font-size: 20px;
  color: #495738;
  opacity: 0.6;
  text-decoration: line-through;
`;

const SaveBadge = styled.div`
  background: #5C946E;
  color: #F4EDD6;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
`;

const BundleSection = styled.div`
  margin-top: 32px;
`;

const BundleLabel = styled.h3`
  font-size: 18px;
  color: #2A3020;
  margin-bottom: 16px;
`;

const BundleCard = styled.div`
  border: 2px solid ${(props) => (props.$selected ? '#9A6F1A' : 'rgba(73, 87, 56, 0.2)')};
  background: ${(props) => (props.$selected ? 'rgba(154, 111, 26, 0.05)' : 'white')};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    border-color: #9A6F1A;
  }
`;

const RecommendedBadge = styled.div`
  position: absolute;
  top: -10px;
  left: 16px;
  background: #9A6F1A;
  color: white;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const BundleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RadioCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.$selected ? '#9A6F1A' : '#ccc')};
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(${(props) => (props.$selected ? 1 : 0)});
    width: 10px;
    height: 10px;
    background: #9A6F1A;
    border-radius: 50%;
    transition: transform 0.2s ease;
  }
`;

const BundleName = styled.div`
  font-weight: 600;
  color: #2A3020;
`;

const BundleDesc = styled.div`
  font-size: 13px;
  color: #495738;
  opacity: 0.8;
`;

const BundlePrice = styled.div`
  text-align: right;
`;

const BPrice = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: #2A3020;
`;

const BPerPack = styled.div`
  font-size: 12px;
  color: #5C946E;
  font-weight: 600;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  background: #495738;
  color: #F4EDD6;
  border: none;
  border-radius: 12px;
  padding: 18px;
  font-size: 20px;
  font-weight: bold;
  margin-top: 24px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: skewX(-20deg);
    transition: left 0.5s;
  }

  &:hover::after {
    left: 100%;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const PaymentIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  opacity: 0.6;
`;



// Product pack images only — tea box photos, not lifestyle/banner
const PRODUCT_IMAGES = [
  '/images/product/product-1.jpg',
  '/images/product/product-2.jpg',
  '/images/product/product-3.jpg',
  '/images/product/product-4.jpg',
  '/images/product/product-5.jpg',
  '/images/product/product-6.jpg',
  '/images/product/product-7.jpg',
  '/images/product/product-8.jpg',
  '/images/product/product-9.jpg',
  '/images/product/product-10.jpg',
  '/images/product/product-11.jpg',
  '/images/product/product-12.jpg',
  '/images/product/product-13.jpg',
];

export default function ProductPage() {
  const [activeImage, setActiveImage] = useState(PRODUCT_IMAGES[0]);
  const [selectedBundle, setSelectedBundle] = useState(DEFAULT_BUNDLE);
  return (
    <PageContainer>
      <ProductViewTracker />
      <ProductJsonLd />
      
      <MainContent>
        <ImageGallery>
          <MainImageWrapper>
            <Image 
              src={activeImage} 
              alt="Royal Swag Lung Detox Tea" 
              fill 
              sizes="(max-width: 992px) 100vw, 50vw"
              priority
            />
          </MainImageWrapper>
          <ThumbnailStrip>
            {PRODUCT_IMAGES.map((img, i) => (
              <Thumb 
                key={i} 
                $active={activeImage === img}
                onClick={() => setActiveImage(img)}
              >
                <Image src={img} alt={`Thumbnail ${i+1}`} fill sizes="80px" />
              </Thumb>
            ))}
          </ThumbnailStrip>
        </ImageGallery>

        <PurchasePanel>
          <Title>Royal Swag TAR OUT Lung Detox Tea</Title>
          <RatingRow>
            ★★★★★ 4.7 <span style={{ color: '#495738', opacity: 0.7 }}>(847 reviews)</span>
          </RatingRow>
          
          <Badges>
            <Image src="/images/badges/asset12.jpeg" alt="Trust Badges" width={200} height={40} />
          </Badges>

          <PriceBlock>
            <PriceRow>
              <CurrentPrice>₹{selectedBundle.price}</CurrentPrice>
              <OldPrice>₹{selectedBundle.originalPrice}</OldPrice>
              <SaveBadge>SAVE ₹{selectedBundle.originalPrice - selectedBundle.price}</SaveBadge>
            </PriceRow>

            <div style={{ marginBottom: 12 }}>
              <CountdownTimer />
            </div>
          </PriceBlock>

          <BundleSection>
            <BundleLabel>Select Quantity:</BundleLabel>
            {BUNDLES.map(bundle => (
              <div key={bundle.id}
                role="button"
                tabIndex={0}
                data-track-button={`bundle-${bundle.id}`}
                data-track-label={bundle.label}
                onClick={() => {
                  setSelectedBundle(bundle);
                  trackEvent(EVENTS.BUNDLE_SELECT, {
                    pack_name: bundle.label,
                    packId: bundle.id,
                    price: bundle.price,
                    page: '/product',
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedBundle(bundle);
                  }
                }}
                style={{
                  border: selectedBundle.id === bundle.id ? '2px solid #495738' : '1px solid #49573830',
                  background: selectedBundle.id === bundle.id ? '#49573808' : '#F4EDD6',
                  borderRadius: 10,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                  position: 'relative',
                  transition: 'all 0.2s',
                  width: '100%',
                }}>
                {bundle.badge && (
                  <span style={{position:'absolute',top:-10,left:12,background:bundle.badgeBg,color:'#F4EDD6',fontSize:10,padding:'2px 8px',borderRadius:20,fontWeight:600}}>
                    {bundle.badge}
                  </span>
                )}
                <div>
                  <div style={{fontWeight:600,fontSize:14,color:'#495738'}}>{bundle.label}</div>
                  <div style={{fontSize:12,color:'#49573880'}}>{bundle.subtitle}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontWeight:700,fontSize:18,color:'#495738'}}>₹{bundle.price}</div>
                  <div style={{fontSize:11,color:'#9A6F1A'}}>₹{bundle.pricePerPack}/pack</div>
                </div>
              </div>
            ))}
          </BundleSection>

          <ProductCheckout
            key={selectedBundle.id}
            price={selectedBundle.price}
            packId={selectedBundle.id}
            packLabel={selectedBundle.label}
            className="mt-6"
            showSocialProof
          />
          
        </PurchasePanel>
      </MainContent>
      <MobileStickyBar selectedPrice={selectedBundle.price} />
    </PageContainer>
  );
}
