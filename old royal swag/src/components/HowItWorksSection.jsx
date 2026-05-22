"use client";
import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  background: #F4EDD6;
  padding: 80px 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #495738;
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
  color: rgba(73, 87, 56, 0.08);
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
    border-top: 2px dashed #495738;
    z-index: 0;
    opacity: 0.3;
  }
`;

const TimelineCard = styled.div`
  background: #495738;
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
  color: rgba(73, 87, 56, 0.7);
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
          <StepCopy>Boil one tea bag in fresh water for 3-4 minutes to release the active phytonutrients.</StepCopy>
        </StepCard>
        <StepCard>
          <StepNumber>02</StepNumber>
          <StepIcon>💧</StepIcon>
          <StepTitle>DRINK</StepTitle>
          <StepCopy>Sip it warm. The soothing liquid coats your throat, providing instant irritation relief.</StepCopy>
        </StepCard>
        <StepCard>
          <StepNumber>03</StepNumber>
          <StepIcon>🫁</StepIcon>
          <StepTitle>BREATHE</StepTitle>
          <StepCopy>The herbs enter your bloodstream and airways, breaking down tar and accumulated mucus.</StepCopy>
        </StepCard>
      </StepsContainer>
      
      <TimelineWrapper>
        <TimelineTrack>
          <TimelineCard>
            <WeekLabel>Week 1</WeekLabel>
            <WeekDesc>Throat irritation subsides. Smoker's cough starts to feel less dry and scratchy.</WeekDesc>
          </TimelineCard>
          <TimelineCard>
            <WeekLabel>Week 2</WeekLabel>
            <WeekDesc>Mucus breakdown begins. You may experience productive coughing as tar is expelled.</WeekDesc>
          </TimelineCard>
          <TimelineCard>
            <WeekLabel>Week 3</WeekLabel>
            <WeekDesc>Airways open up. Noticeable improvement in breathing depth and lung stamina.</WeekDesc>
          </TimelineCard>
          <TimelineCard>
            <WeekLabel>Week 4+</WeekLabel>
            <WeekDesc>Long-term protection. Reduced inflammation and restored natural respiratory defense.</WeekDesc>
          </TimelineCard>
        </TimelineTrack>
      </TimelineWrapper>
      
      <Disclaimer>
        *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Consistent daily use is required for optimal results.
      </Disclaimer>
    </SectionWrapper>
  );
}
