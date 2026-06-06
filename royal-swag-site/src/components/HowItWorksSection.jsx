"use client";
import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  background: #F4EDD6;
  padding: 80px 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #324023;
  overflow: hidden;
`;

const Headline = styled.h2`
  font-size: 42px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 40px;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 80px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 50px;
  }
`;

const StepCard = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 300px;
`;

const StepNumber = styled.div`
  position: absolute;
  top: -30px;
  font-size: 80px;
  font-weight: 900;
  color: rgba(50, 64, 35, 0.08);
  z-index: 0;
`;

const StepIcon = styled.div`
  font-size: 40px;
  margin-bottom: 16px;
  z-index: 1;
`;

const StepTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
  z-index: 1;
`;

const StepCopy = styled.p`
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.9;
  z-index: 1;
`;

const TimelineWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  position: relative;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 20px;
    margin: 0 -20px;
    width: calc(100% + 40px);
    padding-left: 20px;
    padding-right: 20px;
    
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;

const TimelineTrack = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  
  @media (max-width: 768px) {
    min-width: 800px;
    gap: 20px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 40px;
    right: 40px;
    height: 2px;
    border-top: 2px dashed #324023;
    z-index: 0;
    opacity: 0.3;
  }
`;

const TimelineCard = styled.div`
  background: #324023;
  color: #F4EDD6;
  border-radius: 16px;
  padding: 24px;
  width: 22%;
  min-width: 180px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
`;

const WeekLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #9A6F1A;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const WeekDesc = styled.p`
  font-size: 14px;
  line-height: 1.5;
`;

const Disclaimer = styled.p`
  font-size: 11px;
  font-style: italic;
  color: rgba(50, 64, 35, 0.7);
  margin-top: 60px;
  text-align: center;
  max-width: 600px;
`;

export default function HowItWorksSection() {
  return (
    <SectionWrapper>
      <Headline>Three Steps. Every Day.</Headline>
      
      <StepsContainer>
        <StepCard>
          <StepNumber>01</StepNumber>
          <StepIcon>🍵</StepIcon>
          <StepTitle>BREW</StepTitle>
          <StepCopy>Steep one tea bag in hot water for 3-4 minutes to gently release the active herbal phytonutrients.</StepCopy>
        </StepCard>
        <StepCard>
          <StepNumber>02</StepNumber>
          <StepIcon>💧</StepIcon>
          <StepTitle>DRINK</StepTitle>
          <StepCopy>Sip slowly. The warm infusion coats your throat, providing immediate soothing relief from irritation.</StepCopy>
        </StepCard>
        <StepCard>
          <StepNumber>03</StepNumber>
          <StepIcon>🫁</StepIcon>
          <StepTitle>BREATHE</StepTitle>
          <StepCopy>The potent botanicals go to work, helping your body clear environmental build-up and congestion.</StepCopy>
        </StepCard>
      </StepsContainer>
      
      <TimelineWrapper>
        <TimelineTrack>
          <TimelineCard>
            <WeekLabel>Week 1</WeekLabel>
            <WeekDesc>Initial soothing. Minor throat irritation subsides and persistent coughs begin to ease.</WeekDesc>
          </TimelineCard>
          <TimelineCard>
            <WeekLabel>Week 2</WeekLabel>
            <WeekDesc>Active cleansing. The herbal formulation works to break down trapped impurities.</WeekDesc>
          </TimelineCard>
          <TimelineCard>
            <WeekLabel>Week 3</WeekLabel>
            <WeekDesc>Noticeable clarity. Experience deeper, more unrestricted breathing and improved stamina.</WeekDesc>
          </TimelineCard>
          <TimelineCard>
            <WeekLabel>Week 4+</WeekLabel>
            <WeekDesc>Ongoing defense. Sustained support for your respiratory system and long-term wellness.</WeekDesc>
          </TimelineCard>
        </TimelineTrack>
      </TimelineWrapper>
      
      <Disclaimer>
        *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Consistent daily use is required for optimal results.
      </Disclaimer>
    </SectionWrapper>
  );
}
