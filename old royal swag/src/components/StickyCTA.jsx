"use client";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const CTABar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: #0D3B1F;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
  transform: translateY(${(props) => (props.$visible ? '0' : '100%')});
  transition: transform 0.3s ease;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const ProductInfo = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const BuyBtn = styled.button`
  background: #9A6F1A;
  color: #F4EDD6;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
`;

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <CTABar $visible={visible}>
      <ProductInfo>Royal Swag Lung Detox — ₹349</ProductInfo>
      <BuyBtn onClick={() => router.push('/product')}>Buy Now</BuyBtn>
    </CTABar>
  );
}
