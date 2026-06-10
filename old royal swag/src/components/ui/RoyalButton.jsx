'use client';
import React from 'react';
import styled from 'styled-components';

const RoyalButton = ({ children, className, onClick, ...props }) => {
  return (
    <StyledWrapper>
      <button className={`btn ${className || ''}`} onClick={onClick} {...props}>
        {children}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: inline-block;
  .btn {
    padding: 0.5em 1.5em;
    background: #324023;
    color: #F4EDD6;
    border: none;
    border-radius: 0.625em;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    z-index: 1;
    overflow: hidden;
    transition: all 0.5s;
  }

  .btn:hover {
    color: #F4EDD6;
  }

  .btn:after {
    content: "";
    background: #9A6F1A;
    position: absolute;
    z-index: -1;
    left: -20%;
    right: -20%;
    top: 0;
    bottom: 0;
    transform: skewX(-45deg) scale(0, 1);
    transition: all 0.5s;
  }

  .btn:hover:after {
    transform: skewX(-45deg) scale(1, 1);
  }
`;

export default RoyalButton;
