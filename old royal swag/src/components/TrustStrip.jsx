"use client";
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const StripContainer = styled.section`
  background: #F4EDD6;
  border-top: 1px solid rgba(73, 87, 56, 0.2);
  border-bottom: 1px solid rgba(73, 87, 56, 0.2);
  padding: 16px 0;
  width: 100%;
`;

const ScrollWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  
  @media (max-width: 992px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
    justify-content: flex-start;
    gap: 32px;
    padding: 0 16px;
    
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #5C946E;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
`;

const ItemText = styled.span`
  color: #495738;
  font-size: 14px;
  font-weight: 500;
`;

const Separator = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(73, 87, 56, 0.2);
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const BadgesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

export default function TrustStrip() {
  const trustItems = [
    { icon: '🌿', text: '100% Ayurvedic' },
    { icon: '🏭', text: 'Made in India · Surat' },
    { icon: '🧪', text: 'Lab-Tested Batches' },
    { icon: '📦', text: 'Free Delivery Pan India' },
    { icon: '💵', text: 'COD Available' },
    { icon: '↩️', text: '30-Day Money Back' },
  ];

  return (
    <StripContainer>
      <ScrollWrapper>
        {trustItems.map((item, index) => (
          <React.Fragment key={index}>
            <Item>
              <IconCircle>{item.icon}</IconCircle>
              <ItemText>{item.text}</ItemText>
            </Item>
            {index < trustItems.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </ScrollWrapper>
      <BadgesContainer>
        <Image 
          src="/images/badges/asset12.jpeg" 
          alt="Certifications" 
          width={300} 
          height={40} 
          style={{ objectFit: 'contain' }}
        />
      </BadgesContainer>
    </StripContainer>
  );
}
