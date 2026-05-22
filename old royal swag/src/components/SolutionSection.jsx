"use client";
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const SectionWrapper = styled.section`
  background: #F4EDD6;
  padding: 80px 10%;
  color: #495738;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 992px) {
    padding: 60px 20px;
  }
`;

const Headline = styled.h2`
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 40px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1000px;
  width: 100%;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const VisualColumn = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) => (props.$isVisible ? 'translateY(0)' : 'translateY(30px)')};
  transition: all 1s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
`;

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #2A3020;
`;

const CTALink = styled.button`
  background: none;
  border: none;
  color: #9A6F1A;
  font-size: 18px;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`;

export default function SolutionSection() {
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
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    const herbsSection = document.getElementById('herbs');
    if (herbsSection) {
      herbsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SectionWrapper id="solution">
      <Headline>A 3,000-year-old answer. Brewed for today's air.</Headline>
      
      <ContentGrid ref={ref}>
        <VisualColumn $isVisible={isVisible}>
          <ImageWrapper>
            <Image 
              src="/images/ancient_manuscript.png" 
              alt="Ancient Ayurvedic Manuscript" 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </ImageWrapper>
          <ImageWrapper>
            <Image 
              src="/images/asset1-hero-product.jpg" 
              alt="Royal Swag Detox Tea" 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </ImageWrapper>
        </VisualColumn>
        
        <TextColumn>
          <p>Ayurveda mapped the human respiratory system centuries before the industrial revolution. They understood how particulate matter sticks to the mucous lining.</p>
          <p>We took these ancient formulations—Vasaka for opening airways, Mulethi for soothing irritation, Tulsi for immune defense—and concentrated them.</p>
          <p>The result is a daily ritual designed specifically for the unique assault our lungs face today from city pollution and smoking.</p>
        </TextColumn>
      </ContentGrid>
      
      <CTALink onClick={handleScroll}>See the 7 herbs ↓</CTALink>
    </SectionWrapper>
  );
}
