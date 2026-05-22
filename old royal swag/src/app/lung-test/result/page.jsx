"use client";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { trackEvent } from '@/lib/events';
import { useRouter } from 'next/navigation';

const PageWrapper = styled.div`
  background: #F4EDD6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  color: #495738;
`;

const Card = styled.div`
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 16px;
`;

const GaugeWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 100px;
  margin: 0 auto 24px;
  overflow: hidden;
`;

const GaugeArc = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 20px solid rgba(255,255,255,0.2);
  border-bottom-color: transparent;
  border-left-color: transparent;
  transform: rotate(${(props) => props.$rotation}deg);
  transition: transform 1s ease-out;
  border-top-color: ${(props) => props.$fillColor};
  border-right-color: ${(props) => props.$fillColor};
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.2);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const StatLabel = styled.span`
  font-size: 12px;
  opacity: 0.8;
  text-transform: uppercase;
  margin-top: 4px;
`;

const RecWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const BuyBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: #9A6F1A;
  color: #F4EDD6;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background: #805c15;
  }
`;

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const scoreStr = sessionStorage.getItem('lung_score');
    const breathStr = sessionStorage.getItem('lung_breath');
    const leadStr = sessionStorage.getItem('lung_lead');
    
    if (!scoreStr || !breathStr) {
      router.push('/lung-test');
      return;
    }

    const score = parseInt(scoreStr);
    const breath = parseFloat(breathStr);
    let lead = {};
    if (leadStr) lead = JSON.parse(leadStr);

    let risk = '';
    let bg = '';
    let color = '';
    let gaugeColor = '';
    let rotation = -135;
    const symptoms = score / 2;

    if (symptoms >= 5.5 || breath < 25) { 
      risk = 'High Risk';
      bg = '#8B2C24';
      color = '#F4EDD6';
      gaugeColor = '#E74C3C';
      rotation = 45;
    } else if (symptoms >= 2.5 || (breath >= 25 && breath < 45)) { 
      risk = 'Moderate Risk';
      bg = '#E67E22';
      color = '#2A3020';
      gaugeColor = '#D35400';
      rotation = -45;
    } else {
      risk = 'Mild Risk';
      bg = '#5C946E';
      color = '#F4EDD6';
      gaugeColor = '#2ECC71';
      rotation = -105;
    }

    setResult({ score, breath, risk, bg, color, gaugeColor, rotation });

    trackEvent('lead', { score, breath_seconds: breath });

    fetch('/api/send-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...lead,
        score,
        breath_seconds: breath,
        riskLevel: risk
      })
    });
    
  }, [router]);

  if (!result) return <PageWrapper>Loading...</PageWrapper>;

  return (
    <PageWrapper>
      <Card $bg={result.bg} $color={result.color}>
        <Title>{result.risk}</Title>
        <p style={{ marginBottom: '24px' }}>Based on your responses and lung capacity.</p>
        
        <GaugeWrapper>
          <GaugeArc $rotation={result.rotation} $fillColor={result.gaugeColor} />
          <div style={{position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: '18px'}}>
            {result.risk}
          </div>
        </GaugeWrapper>
        
        <StatsRow>
          <StatItem>
            <StatValue>{result.score / 2}</StatValue>
            <StatLabel>Symptoms</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{result.breath}s</StatValue>
            <StatLabel>Breath Hold</StatLabel>
          </StatItem>
        </StatsRow>
      </Card>
      
      <RecWrapper>
        <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px'}}>
          Based on your lung health profile, we recommend Royal Swag
        </h3>
        <p style={{fontSize: '14px', marginBottom: '24px'}}>
          Your breath hold: <strong>{result.breath}s</strong> — Healthy average: 40-60s
        </p>
        
        <div style={{background: 'white', padding: '24px', borderRadius: '16px', borderLeft: '4px solid #9A6F1A', textAlign: 'left', marginBottom: '20px'}}>
          <h4 style={{fontWeight: 'bold', color: '#495738', fontSize: '18px', marginBottom: '8px'}}>Royal Swag TAR OUT Lung Detox Tea</h4>
          <p style={{fontSize: '14px', color: '#2A3020', marginBottom: '16px'}}>A 30-day course specifically formulated to clear tar, reduce coughing, and increase your oxygen retention capacity.</p>
          <BuyBtn onClick={() => router.push('/product')}>Get 1 Pack for ₹349</BuyBtn>
        </div>
      </RecWrapper>
    </PageWrapper>
  );
}
