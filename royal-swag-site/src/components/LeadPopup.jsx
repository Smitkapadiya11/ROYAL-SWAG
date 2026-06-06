"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/events';
import { useCheckoutUi } from '@/contexts/CheckoutUiContext';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: ${p => p.$visible ? 1 : 0};
  pointer-events: ${p => p.$visible ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
`;

const Card = styled.div`
  background: #F4EDD6;
  border-radius: 20px;
  padding: 40px;
  max-width: 420px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  transform: ${p => p.$visible ? 'translateY(0)' : 'translateY(20px)'};
  transition: transform 0.3s ease;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #324023;
  line-height: 1;
  opacity: 0.6;
  &:hover { opacity: 1; }
`;

const GiftIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const Headline = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #324023;
  margin-bottom: 8px;
`;

const Subhead = styled.p`
  font-size: 15px;
  color: #2A3020;
  margin-bottom: 24px;
  opacity: 0.8;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(50, 64, 35, 0.2);
  border-radius: 8px;
  font-size: 16px;
  color: #2A3020;
  margin-bottom: 14px;
  background: white;

  &:focus {
    border-color: #324023;
    outline: none;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #324023;
  color: #F4EDD6;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: #3A462D; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const SuccessMsg = styled.div`
  text-align: center;
  color: #5C946E;
  font-weight: bold;
  font-size: 16px;
  margin-top: 16px;
`;

const STORAGE_KEY = 'rs_lead_popup_shown';

export default function LeadPopup() {
  const pathname = usePathname();
  const { showCheckout } = useCheckoutUi();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showCheckout) {
      setVisible(false);
    }
  }, [showCheckout]);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (pathname?.startsWith('/lung-test') || pathname?.startsWith('/admin')) return;
    if (showCheckout) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const timer = setTimeout(() => setVisible(true), 15000);
      return () => clearTimeout(timer);
    } else {
      const handleExit = (e) => {
        if (e.clientY <= 0) {
          setVisible(true);
          document.removeEventListener('mouseleave', handleExit);
        }
      };
      document.addEventListener('mouseleave', handleExit);
      return () => document.removeEventListener('mouseleave', handleExit);
    }
  }, [pathname, showCheckout]);

  const close = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, '1');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    
    try {
      await fetch('/api/lead-popup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      trackEvent('lead_popup_submit');
      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, '1');
      setTimeout(() => setVisible(false), 2500);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay className="lead-popup-root" $visible={visible} onClick={(e) => e.target === e.currentTarget && close()}>
      <Card $visible={visible}>
        <CloseBtn onClick={close} aria-label="Close">×</CloseBtn>
        <GiftIcon>🌿</GiftIcon>
        <Headline>Free Ayurvedic Lung Health Guide</Headline>
        <Subhead>7 Daily Habits to Cleaner Lungs — Free Download</Subhead>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <SubmitBtn type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Me the Guide'}
            </SubmitBtn>
          </form>
        ) : (
          <SuccessMsg>✓ Guide sent! Check your inbox.</SuccessMsg>
        )}
      </Card>
    </Overlay>
  );
}
