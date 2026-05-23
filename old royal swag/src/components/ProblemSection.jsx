"use client";
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { trackEvent } from '../lib/events';

const SectionWrapper = styled.section`
  position: relative;
  padding: 80px 20px;
  background: #495738;
  color: #F4EDD6;
  text-align: center;
  background-image: url('/images/bg/asset3.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: scroll;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(73, 87, 56, 0.88);
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
`;

const Headline = styled.h2`
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 16px;
  color: #F4EDD6;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Subheadline = styled.p`
  font-size: 18px;
  opacity: 0.75;
  margin-bottom: 60px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatNumber = styled.div`
  font-size: 72px;
  font-weight: 700;
  color: #9A6F1A;
  margin-bottom: 12px;
  line-height: 1;
  display: flex;
  align-items: baseline;
  justify-content: center;
  
  @media (max-width: 768px) {
    font-size: 56px;
  }
`;

const StatText = styled.p`
  font-size: 16px;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const StatSource = styled.span`
  font-size: 12px;
  opacity: 0.5;
`;

const ClosingLine = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #F4EDD6;
`;

function useAnimatedCounter(end, duration, startCondition) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCondition) return;
    
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(end * easeOut);
      
      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, startCondition]);

  return count;
}

const AnimatedStat = ({ endVal, suffix, text, source, isFloat = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const count = useAnimatedCounter(endVal, 2000, isVisible);
  const displayVal = isFloat ? count.toFixed(2) : Math.floor(count);

  return (
    <StatCard ref={ref}>
      <StatNumber>
        {displayVal}{suffix}
      </StatNumber>
      <StatText>{text}</StatText>
      <StatSource>{source}</StatSource>
    </StatCard>
  );
};

export default function ProblemSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent('section_view', { section: 'problem' });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper ref={sectionRef}>
      <Overlay />
      <Content>
        <Headline>The Reality of Our Environment</Headline>
        <Subheadline>Understanding the true impact of urban living on respiratory health.</Subheadline>
        
        <Grid>
          <AnimatedStat 
            endVal={9.78} 
            isFloat={true} 
            suffix="×" 
            text="India's PM2.5 vs WHO safe limit" 
            source="Source: IQAir 2024" 
          />
          <AnimatedStat 
            endVal={10} 
            suffix=" YEARS" 
            text="Tar stays in lung tissue after quitting smoking" 
            source="Source: American Lung Association" 
          />
          <AnimatedStat 
            endVal={0} 
            suffix=" DAYS" 
            text="Clean-air days Delhi had in 2025" 
            source="Source: CPCB India" 
          />
        </Grid>
        
        <ClosingLine>Protecting your lungs is no longer optional—it's a daily necessity.</ClosingLine>
      </Content>
    </SectionWrapper>
  );
}
