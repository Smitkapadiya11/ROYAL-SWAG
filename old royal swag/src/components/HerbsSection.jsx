"use client";
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { trackEvent } from '../lib/events';

const SectionWrapper = styled.section`
  background: #495738;
  color: #F4EDD6;
  padding: 80px 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Headline = styled.h2`
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Subheadline = styled.p`
  font-size: 18px;
  opacity: 0.9;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 60px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const CardWrapper = styled.div`
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) => (props.$isVisible ? 'translateY(0)' : 'translateY(50px)')};
  transition: all 0.6s ease-out;
  transition-delay: ${(props) => props.$delay}ms;
`;

const HerbCardBase = styled.div`
  background: rgba(244, 237, 214, 0.125);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(244, 237, 214, 0.188);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 100%;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: #2A3020;
`;

const RoleTag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #9A6F1A;
  color: #F4EDD6;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  z-index: 2;
  text-transform: uppercase;
`;

const HerbName = styled.h3`
  font-size: 22px;
  font-weight: bold;
  margin: 0 0 4px 0;
`;

const BotanicalName = styled.p`
  font-size: 12px;
  font-style: italic;
  opacity: 0.8;
  margin: 0 0 12px 0;
`;

const Benefit = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 12px 0;
`;

const ExpandableDescription = styled.div`
  max-height: ${(props) => (props.$expanded ? '200px' : '0')};
  opacity: ${(props) => (props.$expanded ? 1 : 0)};
  overflow: hidden;
  transition: all 0.4s ease-in-out;
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.9;
`;

const ExpandHint = styled.div`
  font-size: 11px;
  text-align: center;
  margin-top: auto;
  padding-top: 12px;
  opacity: 0.6;
  text-transform: uppercase;
`;

const WhyBlock = styled.div`
  background: #2A3020;
  color: #F4EDD6;
  padding: 40px;
  border-radius: 20px;
  max-width: 800px;
  text-align: center;
  font-style: italic;
  font-size: 20px;
  line-height: 1.6;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) => (props.$isVisible ? 'translateY(0)' : 'translateY(30px)')};
  transition: all 0.8s ease-out;
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 30px 20px;
  }
`;

const herbsData = [
  {
    name: 'Vasaka',
    botanical: 'Adhatoda vasica',
    role: 'The Airway Opener',
    benefit: 'Dilates bronchioles for easier breathing.',
    description: 'Traditionally used to clear respiratory blockages and act as a powerful bronchodilator. Helps soothe the throat and calm wheezing.',
    image: '/images/asset4-vasaka.jpg'
  },
  {
    name: 'Tulsi',
    botanical: 'Ocimum sanctum',
    role: 'The Immune Shield',
    benefit: 'Protects lungs from oxidative stress.',
    description: 'A powerful adaptogen with anti-inflammatory properties that helps defend respiratory tissue against environmental pollutants and free radicals.',
    image: '/images/asset5-tulsi.jpg'
  },
  {
    name: 'Mulethi',
    botanical: 'Glycyrrhiza glabra',
    role: 'The Soother',
    benefit: 'Calms irritated mucous membranes.',
    description: 'Acts as a demulcent to coat and soothe the respiratory tract, providing relief from dry coughs and scratchy throats caused by smoke.',
    image: '/images/asset6-mulethi.jpg'
  },
  {
    name: 'Kantakari',
    botanical: 'Solanum xanthocarpum',
    role: 'The Cleanser',
    benefit: 'Expels accumulated mucus.',
    description: 'A well-known expectorant that helps break down and expel sticky mucus and tar accumulated from smoking and air pollution.',
    image: '/images/asset7-kantakari.jpg'
  },
  {
    name: 'Pushkarmool',
    botanical: 'Inula racemosa',
    role: 'The Lung Tonic',
    benefit: 'Strengthens respiratory capacity.',
    description: 'An ancient remedy for asthma and breathlessness. It helps rejuvenate lung tissue and improves overall respiratory stamina.',
    image: '/images/asset8-pushkarmool.jpg'
  },
  {
    name: 'Pippali',
    botanical: 'Piper longum',
    role: 'The Bio-Enhancer',
    benefit: 'Boosts absorption of other herbs.',
    description: 'Not only does it help in clearing mucus, but its primary role is to enhance the bioavailability and effectiveness of the other 6 herbs.',
    image: '/images/asset9-pippali.jpg'
  },
  {
    name: 'Haridra',
    botanical: 'Curcuma longa',
    role: 'The Anti-Inflammatory',
    benefit: 'Reduces lung inflammation.',
    description: 'Contains active curcumin that directly targets and reduces chronic inflammation in the airways caused by long-term exposure to toxins.',
    image: '/images/asset10-haridra.jpg'
  }
];

const HerbCard = ({ herb, isVisible, delay }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    const newState = !expanded;
    setExpanded(newState);
    if (newState) {
      trackEvent('herb_expand', { herb: herb.name });
    }
  };

  return (
    <CardWrapper $isVisible={isVisible} $delay={delay}>
      <HerbCardBase onClick={toggleExpand}>
        <RoleTag>{herb.role}</RoleTag>
        <ImageContainer>
          <Image src={herb.image} alt={herb.name} fill style={{ objectFit: 'cover' }} />
        </ImageContainer>
        <HerbName>{herb.name}</HerbName>
        <BotanicalName>{herb.botanical}</BotanicalName>
        <Benefit>{herb.benefit}</Benefit>
        <ExpandableDescription $expanded={expanded}>
          {herb.description}
        </ExpandableDescription>
        <ExpandHint>{expanded ? 'Tap to close' : 'Tap to read more'}</ExpandHint>
      </HerbCardBase>
    </CardWrapper>
  );
};

export default function HerbsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="herbs" ref={sectionRef}>
      <Header>
        <Headline>Seven Herbs. One Purpose.</Headline>
        <Subheadline>Real ingredients — names you recognise from Ayurveda.</Subheadline>
      </Header>
      
      <Grid>
        {herbsData.map((herb, index) => (
          <HerbCard 
            key={index} 
            herb={herb} 
            isVisible={isVisible} 
            delay={index * 100} 
          />
        ))}
      </Grid>
      
      <WhyBlock $isVisible={isVisible}>
        "We didn't invent this formulation. We just perfected its extraction so you get the exact therapeutic dose your lungs need to fight modern air pollution and smoking damage."
      </WhyBlock>
    </SectionWrapper>
  );
}
