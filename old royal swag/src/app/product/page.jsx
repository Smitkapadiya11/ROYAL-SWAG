"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { initRazorpay } from '@/lib/razorpayClient';
import StickyCTA from '@/components/StickyCTA';
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

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MainImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background: white;
  border: 1px solid rgba(73, 87, 56, 0.1);
  img {
    object-fit: contain;
    transition: opacity 0.3s ease;
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
`;

const Thumb = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 2px solid ${(props) => (props.$active ? '#9A6F1A' : 'transparent')};
  background: white;
  img {
    object-fit: cover;
  }
`;

const PurchasePanel = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #495738;
  margin-bottom: 8px;
  line-height: 1.2;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9A6F1A;
  font-weight: 600;
  margin-bottom: 16px;
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
  color: #2A3020;
`;

const OldPrice = styled.div`
  font-size: 20px;
  color: #495738;
  opacity: 0.6;
  text-decoration: line-through;
`;

const SaveBadge = styled.div`
  background: #5C946E;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
`;

const TimerBox = styled.div`
  background: rgba(73, 87, 56, 0.15);
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #495738;
  font-weight: 600;
  margin-bottom: 12px;
`;

const StockText = styled.div`
  color: #9A6F1A;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SocialProof = styled.div`
  color: #5C946E;
  font-size: 14px;
  font-weight: 500;
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

const PACKS = [
  {
    id: 'pack_1',
    name: '1 Pack (20 Bags)',
    desc: 'Try it out',
    price: 349,
    original: 499,
    perPack: 349,
  },
  {
    id: 'pack_3',
    name: '3 Packs (60 Bags)',
    desc: 'Most Popular - 1 Month Supply',
    price: 899,
    original: 1497,
    perPack: 299,
    recommended: true,
  },
  {
    id: 'pack_6',
    name: '6 Packs (120 Bags)',
    desc: 'Best Value - 2 Months Supply',
    price: 1499,
    original: 2994,
    perPack: 249,
  }
];

// Dynamically gather all 13 images from /images/product/
const IMAGES = Array.from({ length: 13 }, (_, i) => `/images/product/product-${i + 1}.jpg`);

export default function ProductPage() {
  const [activeImage, setActiveImage] = useState(IMAGES[0]);
  const [selectedPack, setSelectedPack] = useState(PACKS[1]);
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 48 hours in seconds
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Timer logic with localStorage persistence
    const savedTime = localStorage.getItem('rs_offer_timer');
    const savedTimestamp = localStorage.getItem('rs_offer_timestamp');
    
    if (savedTime && savedTimestamp) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
      const remaining = Math.max(0, parseInt(savedTime) - elapsed);
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        setTimeLeft(48 * 60 * 60); // Reset if expired
      }
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev > 0 ? prev - 1 : 48 * 60 * 60;
        localStorage.setItem('rs_offer_timer', next.toString());
        localStorage.setItem('rs_offer_timestamp', Date.now().toString());
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      // Track intent
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          value: selectedPack.price,
          currency: 'INR',
          content_ids: [selectedPack.id],
          content_name: selectedPack.name,
        });
      }

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPack.price,
          packId: selectedPack.id,
        })
      });
      const order = await res.json();

      const rzp = await initRazorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Royal Swag',
        description: selectedPack.name,
        theme: { color: '#495738' },
        handler: function(response) {
          // Success handler - redirect to thank you
          window.location.href = `/thank-you?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}&amount=${selectedPack.price}&pack=${selectedPack.id}`;
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      });
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <PageContainer>
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
            {IMAGES.map((img, i) => (
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
              <CurrentPrice>₹{selectedPack.price}</CurrentPrice>
              <OldPrice>₹{selectedPack.original}</OldPrice>
              <SaveBadge>SAVE ₹{selectedPack.original - selectedPack.price}</SaveBadge>
            </PriceRow>
            
            <TimerBox>
              ⏳ Offer ends in: {formatTime(timeLeft)}
            </TimerBox>
            
            <StockText>Only 38 packs left at this price</StockText>
            <SocialProof>🔥 12 people ordered in last 24 hours</SocialProof>
          </PriceBlock>

          <BundleSection>
            <BundleLabel>Select Quantity:</BundleLabel>
            {PACKS.map(pack => (
              <BundleCard 
                key={pack.id} 
                $selected={selectedPack.id === pack.id}
                onClick={() => setSelectedPack(pack)}
              >
                {pack.recommended && <RecommendedBadge>RECOMMENDED</RecommendedBadge>}
                <BundleInfo>
                  <RadioCircle $selected={selectedPack.id === pack.id} />
                  <div>
                    <BundleName>{pack.name}</BundleName>
                    <BundleDesc>{pack.desc}</BundleDesc>
                  </div>
                </BundleInfo>
                <BundlePrice>
                  <BPrice>₹{pack.price}</BPrice>
                  <BPerPack>₹{pack.perPack} / pack</BPerPack>
                </BundlePrice>
              </BundleCard>
            ))}
          </BundleSection>

          <CheckoutBtn onClick={handleCheckout} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : `Buy Now — ₹${selectedPack.price}`}
          </CheckoutBtn>
          
          <PaymentIcons>
            <span>🔒 100% Secure Checkout</span>
            <span>|</span>
            <span>UPI • Cards • NetBanking</span>
          </PaymentIcons>
          
        </PurchasePanel>
      </MainContent>
      <StickyCTA />
    </PageContainer>
  );
}
