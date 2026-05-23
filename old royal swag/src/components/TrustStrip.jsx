"use client";
import React from 'react';
import styled from 'styled-components';

const StripContainer = styled.section`
  background: #F4EDD6;
  border-top: 1px solid #49573820;
  border-bottom: 1px solid #49573820;
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

  @media (max-width: 767px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
    justify-content: flex-start;
    gap: 24px;
    padding: 16px 20px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const ItemText = styled.span`
  color: #495738;
  font-size: 14px;
  font-weight: 500;
`;

const Separator = styled.span`
  color: #495738;
  opacity: 0.35;
  font-size: 14px;
  flex-shrink: 0;

  @media (max-width: 767px) {
    display: none;
  }
`;

const trustItems = [
  { icon: '🌿', text: '100% Ayurvedic' },
  { icon: '🏭', text: 'Made in India · Surat' },
  { icon: '🧪', text: 'Lab-Tested Batches' },
  { icon: '📦', text: 'Free Delivery Pan India' },
  { icon: '💵', text: 'COD Available' },
  { icon: '↩️', text: '30-Day Money Back' },
];

export default function TrustStrip() {
  return (
    <StripContainer>
      <ScrollWrapper>
        {trustItems.map((item, index) => (
          <React.Fragment key={index}>
            <Item>
              <span aria-hidden="true">{item.icon}</span>
              <ItemText>{item.text}</ItemText>
            </Item>
            {index < trustItems.length - 1 && <Separator>·</Separator>}
          </React.Fragment>
        ))}
      </ScrollWrapper>
    </StripContainer>
  );
}
