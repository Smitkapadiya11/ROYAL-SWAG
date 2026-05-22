"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const messages = [
  "🚚 FREE delivery across India · COD available",
  "🎁 Today only — ₹349 (was ₹499). Save ₹150.",
  "⏰ Order before 6 PM → Ships in 2 Days",
  "🛡️ 30-day money-back guarantee. No questions."
];

const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 9999;
  background: #5C946E;
  color: white;
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

const Message = styled.div`
  transition: opacity 0.5s ease-in-out;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  position: absolute;
`;

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Bar>
      {messages.map((msg, index) => (
        <Message key={index} $isVisible={isVisible && currentIndex === index}>
          {msg}
        </Message>
      ))}
    </Bar>
  );
}
