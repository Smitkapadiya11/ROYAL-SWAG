"use client";
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #F4EDD6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
`;

const Icon = styled.div`
  font-size: 64px;
  color: #5C946E;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #495738;
  margin-bottom: 16px;
`;

const Desc = styled.p`
  font-size: 16px;
  color: #2A3020;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  background: #9A6F1A;
  color: #F4EDD6;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
`;

export default function ThankYouPage() {
  return (
    <PageWrapper>
      <Card>
        <Icon>✓</Icon>
        <Title>Order Confirmed!</Title>
        <Desc>
          Thank you for choosing Royal Swag Lung Detox Tea. We're processing your order and will ship it within 24 hours. You'll receive a confirmation email shortly.
        </Desc>
        <HomeLink href="/">Return to Homepage</HomeLink>
      </Card>
    </PageWrapper>
  );
}
