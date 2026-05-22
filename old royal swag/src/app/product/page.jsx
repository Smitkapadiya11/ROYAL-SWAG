"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { initRazorpay } from '@/lib/razorpayClient';
import StickyCTA from '@/components/StickyCTA';
import Nav from '@/components/Nav';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductJsonLd from '@/components/seo/ProductJsonLd';

const PageContainer = styled.div`
  background: #F4EDD6;
  min-height: 100vh;
  padding-bottom: 80px;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 20px;
  }
`;

const Gallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MainImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const ThumbnailsStrip = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #49573840;
    border-radius: 10px;
  }
`;

const Thumb = styled.button`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 2px solid ${(props) => (props.$active ? '#495738' : 'transparent')};
  background: white;
  cursor: pointer;
  
  &:hover {
    border-color: #49573880;
  }
`;

const DetailsPanel = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h1`
  color: #495738;
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 12px;
  line-height: 1.2;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const Stars = styled.span`
  color: #9A6F1A;
  font-size: 16px;
  letter-spacing: 2px;
`;

const ReviewCount = styled.span`
  color: #2A3020;
  font-size: 14px;
  opacity: 0.8;
  text-decoration: underline;
  cursor: pointer;
`;

const BadgesRow = styled.div`
  margin-bottom: 24px;
`;

const PriceBlock = styled.div`
  margin-bottom: 30px;
`;

const PriceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`;

const CurrentPrice = styled.span`
  font-size: 32px;
  font-weight: 800;
  color: #2A3020;
`;

const OriginalPrice = styled.span`
  font-size: 20px;
  color: #495738;
  opacity: 0.5;
  text-decoration: line-through;
`;

const SaveBadge = styled.span`
  background: #9A6F1A;
  color: #F4EDD6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const Countdown = styled.div`
  background: rgba(73, 87, 56, 0.08);
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #495738;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const UrgencyText = styled.p`
  color: #9A6F1A;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SocialProof = styled.p`
  font-size: 12px;
  opacity: 0.7;
`;

const BundlesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
`;

const BundleCard = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.$selected ? '#495738' : 'rgba(73, 87, 56, 0.2)')};
  background: ${(props) => (props.$selected ? 'rgba(73, 87, 56, 0.05)' : 'white')};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    border-color: #495738;
  }
`;

const RadioBtn = styled.input`
  margin-top: 4px;
  accent-color: #495738;
  width: 18px;
  height: 18px;
`;

const BundleInfo = styled.div`
  flex: 1;
`;

const BundleTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #2A3020;
  margin-bottom: 4px;
`;

const BundleDesc = styled.div`
  font-size: 14px;
  color: #495738;
  opacity: 0.8;
`;

const BundlePrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #2A3020;
`;

const BestValueBadge = styled.div`
  position: absolute;
  top: -10px;
  right: 16px;
  background: #9A6F1A;
  color: #F4EDD6;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
`;

const BuyButton = styled.button`
  width: 100%;
  height: 56px;
  background: #495738;
  color: #F4EDD6;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 16px;
  transition: background 0.3s ease;
  
  &:hover {
    background: #3A462D;
  }
`;

const DeliveryStrip = styled.div`
  background: rgba(92, 148, 110, 0.15);
  color: #495738;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
`;

const GuaranteeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const bundles = [
  { id: 'single', type: 'single', name: '1 Pack', price: 349, originalPrice: 499, desc: '20 bags / 30-day supply' },
  { id: 'triple', type: 'triple', name: '3 Pack Bundle', price: 899, originalPrice: 1497, desc: '60 bags / Save ₹150', badge: 'BEST VALUE' },
  { id: 'subscription', type: 'subscription', name: 'Monthly Subscription', price: 299, originalPrice: 499, desc: 'Cancel anytime', badge: 'AUTO-DELIVER' }
];

const images = Array.from({ length: 4 }).map((_, i) => `/images/asset1-hero-product.jpg`);

export default function ProductPage() {
  const [selectedBundleId, setSelectedBundleId] = useState('triple');
  const [mainImage, setMainImage] = useState(images[0]);
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });

  const selectedBundle = bundles.find(b => b.id === selectedBundleId);

  useEffect(() => {
    let endTime = localStorage.getItem('royalSwagOfferEnd');
    if (!endTime || Date.now() > parseInt(endTime)) {
      endTime = Date.now() + 48 * 60 * 60 * 1000;
      localStorage.setItem('royalSwagOfferEnd', endTime);
    }
    
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = parseInt(endTime) - now;
      if (diff <= 0) {
        localStorage.setItem('royalSwagOfferEnd', Date.now() + 48 * 60 * 60 * 1000);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleBuyNow = () => {
    initRazorpay(selectedBundle);
  };

  return (
    <PageContainer>
      <ProductJsonLd />
      <AnnouncementBar />
      <Nav />
      
      <MainContent>
        <Gallery>
          <MainImageWrapper>
            <Image src={mainImage} alt="Royal Swag Lung Detox" fill style={{ objectFit: 'contain' }} priority />
          </MainImageWrapper>
          <ThumbnailsStrip>
            {images.map((img, i) => (
              <Thumb key={i} $active={mainImage === img} onClick={() => setMainImage(img)}>
                <Image src={img} alt={`Thumbnail ${i}`} fill style={{ objectFit: 'cover' }} />
              </Thumb>
            ))}
          </ThumbnailsStrip>
        </Gallery>

        <DetailsPanel>
          <ProductTitle>Royal Swag TAR OUT Lung Detox Tea</ProductTitle>
          <RatingRow>
            <Stars>★★★★★</Stars>
            <span style={{color: '#9A6F1A', fontWeight: 'bold'}}>4.7</span>
            <ReviewCount>(847 reviews)</ReviewCount>
          </RatingRow>
          
          <BadgesRow>
            <Image src="/images/asset12-badges.png" alt="FSSAI & AYUSH Badges" width={150} height={30} style={{ objectFit: 'contain' }} />
          </BadgesRow>
          
          <PriceBlock>
            <PriceDisplay>
              <CurrentPrice>₹{selectedBundle.price}</CurrentPrice>
              <OriginalPrice>₹{selectedBundle.originalPrice}</OriginalPrice>
              <SaveBadge>SAVE ₹{selectedBundle.originalPrice - selectedBundle.price}</SaveBadge>
            </PriceDisplay>
            <Countdown>
              ⏰ Offer ends in: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </Countdown>
            <UrgencyText>Only 38 packs left at this price</UrgencyText>
            <SocialProof>12 people ordered in last 24 hours</SocialProof>
          </PriceBlock>
          
          <BundlesWrapper>
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} $selected={selectedBundleId === bundle.id}>
                <RadioBtn 
                  type="radio" 
                  name="bundle" 
                  checked={selectedBundleId === bundle.id} 
                  onChange={() => setSelectedBundleId(bundle.id)} 
                />
                <BundleInfo>
                  <BundleTitle>{bundle.name}</BundleTitle>
                  <BundleDesc>{bundle.desc}</BundleDesc>
                </BundleInfo>
                <BundlePrice>₹{bundle.price}</BundlePrice>
                {bundle.badge && <BestValueBadge>{bundle.badge}</BestValueBadge>}
              </BundleCard>
            ))}
          </BundlesWrapper>
          
          <BuyButton onClick={handleBuyNow}>Buy Now</BuyButton>
          
          <DeliveryStrip>
            🚚 Free delivery on all orders · Ships in 24 hours
          </DeliveryStrip>
          
          <GuaranteeRow>
            <span style={{fontSize: '12px', fontWeight: 'bold', color: '#495738'}}>↩️ 30-Day Guarantee</span>
            <span style={{fontSize: '12px', textDecoration: 'underline', color: '#495738', cursor: 'pointer'}}>FSSAI Certified</span>
          </GuaranteeRow>
          
        </DetailsPanel>
      </MainContent>
      
      <StickyCTA />
    </PageContainer>
  );
}
