"use client";
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
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

const ProgressBarContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 8px;
  background: rgba(73, 87, 56, 0.2);
  border-radius: 4px;
  margin-bottom: 40px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #495738;
  width: ${(props) => props.$progress}%;
  transition: width 0.3s ease;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  text-align: center;
  animation: slideIn 0.4s ease;

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid rgba(73, 87, 56, 0.2);
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  color: #2A3020;
  
  &:focus {
    border-color: #495738;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: #495738;
  color: #F4EDD6;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OptionButton = styled.button`
  width: 100%;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${(props) => props.$isYes ? `
    background: #495738;
    color: #F4EDD6;
    border: none;
    &:hover { background: #3A462D; }
  ` : `
    background: white;
    color: #495738;
    border: 2px solid #495738;
    &:hover { background: #F4EDD6; }
  `}
`;

const pulseAnim = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(73, 87, 56, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(73, 87, 56, 0); }
  100% { box-shadow: 0 0 0 0 rgba(73, 87, 56, 0); }
`;

const BreathCircle = styled.button`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: none;
  background: ${(props) => {
    if (!props.$active) return 'radial-gradient(circle, #495738 0%, #5C946E 100%)';
    const p = Math.min(props.$elapsed / 60, 1);
    return `radial-gradient(circle, #5C946E ${p * 100}%, #495738 100%)`;
  }};
  color: #F4EDD6;
  font-size: ${(props) => (props.$active ? '48px' : '16px')};
  font-weight: bold;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto;
  box-shadow: 0 0 0 0 rgba(73, 87, 56, 0.4);
  animation: ${(props) => (!props.$active ? pulseAnim : 'none')} 2s infinite;
  transition: background 0.3s ease;
  
  &:focus { outline: none; }
`;

const SvgRing = styled.svg`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
`;

const StatusLabel = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 24px;
  color: ${(props) => props.$color};
`;

const questions = [
  "Do you live in a high-pollution city?",
  "Do you smoke or recently quit?",
  "Do you have morning cough?",
  "Do you feel breathless on stairs?",
  "Do you work near dust, chemicals, or fumes?",
  "Do you wake up with chest tightness?",
  "Do you cough after exercise?",
  "Have you smoked for more than 5 years?"
];

export default function LungTestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState({ name: '', email: '', phone: '' });
  const [score, setScore] = useState(0);
  
  const [isBreathing, setIsBreathing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [analysing, setAnalysing] = useState(false);
  const timerRef = useRef(null);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (lead.name && lead.email && lead.phone) {
      sessionStorage.setItem('lung_lead', JSON.stringify(lead));
      setStep(1);
      trackEvent('lung_test_start');
    }
  };

  const handleAnswer = (isYes) => {
    if (isYes) setScore(s => s + 2);
    if (step < 8) {
      setStep(step + 1);
    } else {
      setStep(9);
    }
  };

  const startBreathTest = () => {
    trackEvent('breath_test_start');
    setIsBreathing(true);
    setElapsed(0);
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed((Date.now() - startTime) / 1000);
    }, 100);
  };

  const stopBreathTest = () => {
    setIsBreathing(false);
    clearInterval(timerRef.current);
    setAnalysing(true);
    
    sessionStorage.setItem('lung_score', score);
    sessionStorage.setItem('lung_breath', elapsed.toFixed(1));
    
    setTimeout(() => {
      router.push('/lung-test/result');
    }, 1500);
  };

  const getBreathLabel = () => {
    if (elapsed <= 10) return { text: "Breathing in...", color: "#9A6F1A" };
    if (elapsed <= 20) return { text: "Lungs warming up...", color: "#9A6F1A" };
    if (elapsed <= 30) return { text: "Good oxygen retention...", color: "#5C946E" };
    if (elapsed <= 45) return { text: "Strong lung capacity!", color: "#5C946E" };
    if (elapsed < 60) return { text: "Excellent! Above average!", color: "#495738" };
    return { text: "Outstanding lung health!", color: "#495738" };
  };

  const formatTime = (secs) => {
    const s = Math.floor(secs);
    const ms = Math.floor((secs % 1) * 10);
    return `00:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <PageWrapper>
      {step > 0 && step <= 8 && (
        <ProgressBarContainer>
          <ProgressFill $progress={(step / 8) * 100} />
        </ProgressBarContainer>
      )}

      {step === 0 && (
        <Card>
          <Title>Check Your Lung Health</Title>
          <p style={{marginBottom: '24px'}}>Complete this free 60-second assessment.</p>
          <form onSubmit={handleLeadSubmit}>
            <Input 
              type="text" 
              placeholder="Your Name" 
              value={lead.name} 
              onChange={e => setLead({...lead, name: e.target.value})} 
              required 
            />
            <Input 
              type="email" 
              placeholder="Email Address" 
              value={lead.email} 
              onChange={e => setLead({...lead, email: e.target.value})} 
              required 
            />
            <Input 
              type="tel" 
              placeholder="Phone Number" 
              value={lead.phone} 
              onChange={e => setLead({...lead, phone: e.target.value})} 
              required 
            />
            <Button type="submit">Start Free Test</Button>
          </form>
        </Card>
      )}

      {step > 0 && step <= 8 && (
        <Card key={step}>
          <Title>{questions[step - 1]}</Title>
          <OptionButton $isYes={true} onClick={() => handleAnswer(true)}>Yes</OptionButton>
          <OptionButton $isYes={false} onClick={() => handleAnswer(false)}>No</OptionButton>
        </Card>
      )}

      {step === 9 && (
        <Card>
          <Title>Now test your lung capacity.</Title>
          <p>Take a deep breath. Tap the circle. Hold as long as you can. Tap again to stop.</p>
          
          <BreathCircle 
            $active={isBreathing} 
            $elapsed={elapsed}
            onClick={!isBreathing && !analysing ? startBreathTest : stopBreathTest}
            disabled={analysing}
          >
            <SvgRing>
              <circle cx="100" cy="100" r="90" fill="none" stroke="#49573820" strokeWidth="8" />
              <circle 
                cx="100" cy="100" r="90" 
                fill="none" 
                stroke="#9A6F1A" 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray="565.5"
                strokeDashoffset={isBreathing ? Math.max(0, 565.5 - (elapsed / 60) * 565.5) : 565.5}
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </SvgRing>
            {analysing ? "Analysing..." : isBreathing ? formatTime(elapsed) : "TAP TO BEGIN"}
          </BreathCircle>
          
          {isBreathing && (
            <StatusLabel $color={getBreathLabel().color}>
              {getBreathLabel().text}
            </StatusLabel>
          )}
        </Card>
      )}
    </PageWrapper>
  );
}
