"use client";

import { useRef, useState } from "react";
import styled from "styled-components";

interface Props {
  label?: string;
  onOrder: () => void;
  price: number;
}

const Btn = styled.button`
  appearance: none;
  border: 0;
  background: linear-gradient(135deg, #1A3A1A, #2D6A2D);
  position: relative;
  height: 60px;
  width: 100%;
  max-width: 320px;
  padding: 0;
  outline: none;
  cursor: pointer;
  border-radius: 30px;
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 24px rgba(26, 58, 26, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(26, 58, 26, 0.5);
  }
  &:active {
    transform: scale(0.97);
  }

  .btn-default {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    top: 18px;
    line-height: 24px;
    color: #faf6ee;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.04em;
    font-family: var(--font-sans);
    transition: opacity 0.3s ease 0.3s;
  }
  .btn-success {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    top: 18px;
    line-height: 24px;
    color: #faf6ee;
    font-size: 14px;
    font-weight: 600;
    font-family: var(--font-sans);
    opacity: 0;
    transition: opacity 0.3s ease;
    svg {
      width: 12px;
      height: 10px;
      display: inline-block;
      vertical-align: top;
      fill: none;
      margin: 7px 0 0 4px;
      stroke: #7fb085;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 16px;
      stroke-dashoffset: var(--offset, 16px);
      transition: stroke-dashoffset 0.3s ease;
    }
  }
  .truck-lines {
    opacity: 0;
    position: absolute;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    width: 6px;
    top: 28px;
    left: 100%;
    box-shadow:
      15px 0 0 rgba(255, 255, 255, 0.3),
      30px 0 0 rgba(255, 255, 255, 0.3),
      45px 0 0 rgba(255, 255, 255, 0.3),
      60px 0 0 rgba(255, 255, 255, 0.3),
      75px 0 0 rgba(255, 255, 255, 0.3),
      90px 0 0 rgba(255, 255, 255, 0.3),
      105px 0 0 rgba(255, 255, 255, 0.3),
      120px 0 0 rgba(255, 255, 255, 0.3),
      135px 0 0 rgba(255, 255, 255, 0.3),
      150px 0 0 rgba(255, 255, 255, 0.3),
      165px 0 0 rgba(255, 255, 255, 0.3),
      180px 0 0 rgba(255, 255, 255, 0.3);
  }
  .truck-box {
    width: 21px;
    height: 21px;
    right: 100%;
    top: 19px;
    position: absolute;
    background: linear-gradient(#e8c84a, #c49a2a);
    border-radius: 2px;
    &::before {
      content: "";
      top: 10px;
      position: absolute;
      left: 0;
      right: 0;
      height: 3px;
      margin-top: -1px;
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .truck-wrap {
    width: 60px;
    height: 41px;
    left: 100%;
    z-index: 1;
    top: 9px;
    position: absolute;
    transform: translateX(24px);
    &::before,
    &::after {
      content: "";
      height: 2px;
      width: 20px;
      right: 58px;
      position: absolute;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 1px;
      transform-origin: 100% 50%;
    }
    &::before {
      top: 4px;
      transform: rotate(-90deg);
    }
    &::after {
      bottom: 4px;
      transform: rotate(90deg);
    }
    .truck-back {
      left: 0;
      top: 0;
      width: 60px;
      height: 41px;
      position: absolute;
      background: linear-gradient(#e0e0e0, #c0c0c0);
      border-radius: 2px;
    }
    .truck-front {
      overflow: hidden;
      position: absolute;
      border-radius: 2px 9px 9px 2px;
      width: 26px;
      height: 41px;
      left: 60px;
      &::after {
        content: "";
        position: absolute;
        border-radius: 2px 9px 9px 2px;
        background: #c49a2a;
        width: 24px;
        height: 41px;
        right: 0;
      }
      .truck-window {
        overflow: hidden;
        border-radius: 2px 8px 8px 2px;
        background: #e8c84a;
        width: 22px;
        height: 41px;
        position: absolute;
        left: 2px;
        top: 0;
        z-index: 1;
      }
    }
  }

  &.animating .btn-default {
    opacity: 0;
    transition-delay: 0s;
  }
  &.animating .btn-success {
    opacity: 1;
    transition-delay: 6.5s;
  }
  &.animating .btn-success svg {
    --offset: 0;
    transition-delay: 6.8s;
  }
  &.animating .truck-wrap {
    animation: rs-truck 9s ease forwards;
  }
  &.animating .truck-box {
    animation: rs-box 9s ease forwards;
  }
  &.animating .truck-lines {
    animation: rs-lines 9s ease forwards;
  }

  @keyframes rs-truck {
    10%,
    30% {
      transform: translateX(-164px);
    }
    40% {
      transform: translateX(-104px);
    }
    60% {
      transform: translateX(-224px);
    }
    75%,
    100% {
      transform: translateX(24px);
    }
  }
  @keyframes rs-box {
    8%,
    10% {
      transform: translateX(40px);
      opacity: 1;
    }
    25% {
      transform: translateX(112px);
      opacity: 1;
    }
    26% {
      transform: translateX(112px);
      opacity: 0;
    }
    27%,
    100% {
      transform: translateX(0px);
      opacity: 0;
    }
  }
  @keyframes rs-lines {
    0%,
    30% {
      opacity: 0;
      transform: scaleY(0.7) translateX(0);
    }
    35%,
    65% {
      opacity: 1;
    }
    70% {
      opacity: 0;
    }
    100% {
      transform: scaleY(0.7) translateX(-400px);
    }
  }
`;

export default function AnimatedOrderButton({ label = "Buy Now", onOrder, price }: Props) {
  const [animating, setAnimating] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      onOrder();
    }, 2000);
  };

  return (
    <Btn ref={btnRef} className={animating ? "animating" : ""} onClick={handleClick} type="button">
      <span className="btn-default">
        {label} — Rs {price}
      </span>
      <span className="btn-success">
        Order Confirmed!
        <svg viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </svg>
      </span>
      <div className="truck-box" />
      <div className="truck-wrap">
        <div className="truck-back" />
        <div className="truck-front">
          <div className="truck-window" />
        </div>
      </div>
      <div className="truck-lines" />
    </Btn>
  );
}
