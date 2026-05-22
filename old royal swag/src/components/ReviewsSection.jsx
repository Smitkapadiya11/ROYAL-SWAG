"use client";
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { trackEvent } from '../lib/events';

const SectionWrapper = styled.section`
  background: #495738;
  padding: 80px 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #F4EDD6;
`;

const Headline = styled.h2`
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Subheadline = styled.p`
  font-size: 16px;
  color: #9A6F1A;
  font-weight: 600;
  margin-bottom: 60px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 16px;
    padding-bottom: 20px;
    margin: 0 -20px;
    padding-left: 20px;
    padding-right: 20px;
    width: calc(100% + 40px);
    
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;

const ReviewCard = styled.div`
  background: #2A3020;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    min-width: 280px;
    scroll-snap-align: center;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Initials = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #9A6F1A;
  color: #F4EDD6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
`;

const NameCity = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-weight: bold;
  font-size: 14px;
`;

const City = styled.span`
  font-size: 12px;
  opacity: 0.7;
`;

const Badges = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const Stars = styled.div`
  color: #9A6F1A;
  font-size: 12px;
  letter-spacing: 2px;
`;

const VerifiedBadge = styled.span`
  background: rgba(73, 87, 56, 0.25);
  color: #F4EDD6;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  text-transform: uppercase;
`;

const RiskBadge = styled.div`
  font-size: 11px;
  margin-bottom: 12px;
  opacity: 0.8;
`;

const ReviewText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  font-style: italic;
  opacity: 0.9;
`;

const SeeAllLink = styled.a`
  color: #9A6F1A;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
`;

const reviewsData = [
  { initials: 'RK', name: 'R. K.', city: 'Ahmedabad', risk: 'High (Smoker)', text: 'I used to wake up coughing every morning. After 2 weeks of drinking this, the morning cough is 80% gone. Unbelievable.' },
  { initials: 'SP', name: 'S. P.', city: 'Delhi', risk: 'High (AQI 300+)', text: 'Delhi pollution was killing my throat. I drink this before bed and wake up feeling like I can actually breathe deep.' },
  { initials: 'VM', name: 'V. M.', city: 'Mumbai', risk: 'Medium (Passive Smoke)', text: 'The taste is earthy but good. Most importantly, I don\'t get breathless climbing stairs to my 3rd floor apartment anymore.' },
  { initials: 'AR', name: 'A. R.', city: 'Bangalore', risk: 'Medium (Dust Allergy)', text: 'My dust allergy used to trigger asthma attacks. Since starting this detox tea, my inhaler usage has halved.' },
  { initials: 'PK', name: 'P. K.', city: 'Pune', risk: 'Low (Health Conscious)', text: 'I don\'t smoke but I run outdoors. Bought it for general lung detox. Feel much lighter in the chest.' },
  { initials: 'ND', name: 'N. D.', city: 'Gurgaon', risk: 'High (Smoker & Pollution)', text: 'Been smoking for 10 years. Started this a month ago. The amount of dark phlegm it cleared out in the first week was scary but satisfying.' },
];

export default function ReviewsSection() {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent('review_scroll');
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper ref={sectionRef} id="reviews">
      <Headline>What 847 customers say.</Headline>
      <Subheadline>4.7 stars · Verified Amazon reviews</Subheadline>
      
      <Grid>
        {reviewsData.map((rev, index) => (
          <ReviewCard key={index}>
            <HeaderRow>
              <UserInfo>
                <Initials>{rev.initials}</Initials>
                <NameCity>
                  <Name>{rev.name}</Name>
                  <City>{rev.city}</City>
                </NameCity>
              </UserInfo>
              <Badges>
                <Stars>★★★★★</Stars>
                <VerifiedBadge>Verified Purchase</VerifiedBadge>
              </Badges>
            </HeaderRow>
            <RiskBadge>Was: {rev.risk}</RiskBadge>
            <ReviewText>"{rev.text}"</ReviewText>
          </ReviewCard>
        ))}
      </Grid>
      
      <SeeAllLink href="#">See all 847 reviews →</SeeAllLink>
    </SectionWrapper>
  );
}
