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
  color: #495738;
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
  background: rgba(73, 87, 56, 0.08);
  color: #495738;
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
  color: #495738;
  line-height: 1.5;
`;

export default function WhoSection() {
  const cards = [
    {
      icon: '🚬',
      title: 'The Smoker / Ex-Smoker',
      desc: 'Years of smoking deposit tar in your alveoli. Your lungs need a daily flush to regain lost stamina and reduce coughing.'
    },
    {
      icon: '🏙️',
      title: 'The City Dweller',
      desc: 'Breathing in Mumbai or Delhi is like smoking 10 cigarettes a day. PM2.5 gets trapped deep in your respiratory system.'
    },
    {
      icon: '🔍',
      title: 'The Label-Reader',
      desc: 'You care about what goes into your body. No synthetic syrups. Just 7 clinically studied Ayurvedic herbs.'
    },
    {
      icon: '🎂',
      title: 'Anyone Above 30',
      desc: 'Lung capacity drops 1% every year after 30. Combat this natural decline and maintain respiratory fitness.'
    }
  ];

  return (
    <SectionWrapper id="who-its-for">
      <Headline>Made for three very specific people.</Headline>
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
