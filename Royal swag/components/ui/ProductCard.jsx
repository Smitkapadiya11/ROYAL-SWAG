"use client";

import styled from 'styled-components';
import Image from 'next/image';

const Card = styled.div`
  width: 190px;
  height: 254px;
  border-radius: 30px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 50px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 26px -18px inset;
  background: linear-gradient(50deg, #F4EDD6, #495738);
  transition: transform 0.3s ease;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
    z-index: 10;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #9A6F1A;
  color: #F4EDD6;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  z-index: 2;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 120px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: bold;
  color: #2A3020;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 10px;
  color: #2A3020;
  margin: 0;
`;

const Price = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #495738;
  margin-top: 4px;
`;

export default function ProductCard({ image, title, subtitle, price, badge }) {
  return (
    <Card>
      {badge && <Badge>{badge}</Badge>}
      <ImageContainer>
        {image && (
          <Image 
            src={image} 
            alt={title || 'Product Image'} 
            fill 
            style={{ objectFit: 'cover' }} 
          />
        )}
      </ImageContainer>
      <Content>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        <Price>{price}</Price>
      </Content>
    </Card>
  );
}
