"use client";
import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  background: #F4EDD6;
  padding: 80px 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Headline = styled.h2`
  font-size: 36px;
  font-weight: 800;
  color: #324023;
  margin-bottom: 60px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 40px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  max-width: 1000px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-left: 4px solid #9A6F1A;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(50, 64, 35, 0.08);
  color: #324023;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 22px;
  font-weight: bold;
  color: #2A3020;
  margin-bottom: 12px;
`;

const CardDesc = styled.p`
  font-size: 15px;
  color: #324023;
  line-height: 1.5;
`;

export default function WhoSection() {
  const cards = [
    {
      icon: '🚬',
      title: 'Smokers & Ex-Smokers',
      desc: 'Years of smoking can leave lasting residues in your respiratory tract. This daily detox helps clear build-up, soothe irritation, and restore your natural breathing capacity.'
    },
    {
      icon: '🏙️',
      title: 'Urban Dwellers',
      desc: 'Living in high-pollution cities exposes your lungs to harmful PM2.5 daily. Our blend actively works to trap and flush out environmental toxins before they settle.'
    },
    {
      icon: '🌿',
      title: 'Health-Conscious Individuals',
      desc: 'No artificial flavors, no synthetic syrups. Just a 100% natural, clinically studied Ayurvedic formulation for those who care about clean ingredients.'
    },
    {
      icon: '🏃',
      title: 'Anyone Above 30',
      desc: 'Natural lung capacity begins to decline by 1% every year after age 30. Combat this aging process and maintain optimal respiratory fitness.'
    }
  ];

  return (
    <SectionWrapper id="who-its-for">
      <Headline>Crafted for those who need it most.</Headline>
      <Grid>
        {cards.map((card, index) => (
          <Card key={index}>
            <IconCircle>{card.icon}</IconCircle>
            <CardTitle>{card.title}</CardTitle>
            <CardDesc>{card.desc}</CardDesc>
          </Card>
        ))}
      </Grid>
    </SectionWrapper>
  );
}
