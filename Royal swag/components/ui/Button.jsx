"use client";

import styled from 'styled-components';

const Button = styled.button`
  background: #495738;
  color: #F4EDD6;
  border-radius: 0.625em;
  font-size: 20px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #9A6F1A;
    z-index: -1;
    transform-origin: left;
    transform: skewX(-45deg) scale(0, 1);
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #F4EDD6;
  }

  &:hover::after {
    transform: skewX(-45deg) scale(1, 1);
  }
`;

const RoyalButton = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};

export default RoyalButton;
