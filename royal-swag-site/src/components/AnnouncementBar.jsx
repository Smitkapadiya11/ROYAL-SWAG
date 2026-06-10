"use client";
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const messages = [
  "🚚 FREE delivery across India · COD available",
  "🎁 2 Pack Bundle — ₹689 (save ₹210). Starter from ₹349.",
  "⏰ Order before 6 PM → Ships in 2 Days",
  "🛡️ 30-day money-back guarantee. No questions."
];

const Bar = styled.div`
  position: relative;
  z-index: 40;
  background: #5C946E;
  color: #F4EDD6;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  overflow: hidden;

  @media (max-width: 768px) {
    white-space: nowrap;
    font-size: 12px;
  }
`;

const Message = styled.p`
  margin: 0;
  padding: 0 16px;
  text-align: center;
  transition: opacity 0.35s ease;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
`;

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const swapRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      swapRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 350);
    }, 5000);

    return () => {
      clearInterval(interval);
      if (swapRef.current) clearTimeout(swapRef.current);
    };
  }, []);

  return (
    <Bar>
      <Message $visible={visible} aria-live="polite">
        {messages[currentIndex]}
      </Message>
    </Bar>
  );
}
