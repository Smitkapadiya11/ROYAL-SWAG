'use client';
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const ProductCard = ({ image, title, subtitle, price, badge, className }) => {
  return (
    <StyledWrapper className={className}>
      <div className="card">
        {badge && <div className="card-badge">{badge}</div>}
        {image && (
          <div className="card-image-container">
            <Image src={image} alt={title || "Product"} fill className="card-image" />
          </div>
        )}
        <div className="card-content">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
          {price && <p className="card-price">{price}</p>}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: inline-block;
  
  .card {
    position: relative;
    width: 190px;
    height: 254px;
    border-radius: 30px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 50px -12px inset,
      rgba(0, 0, 0, 0.3) 0px 18px 26px -18px inset;
    transition: all 0.3s ease-in-out;
    /* Overridden with Royal Swag tones */
    background: linear-gradient(50deg, #F4EDD6, #E0D4B4);
    background-size: 1px 25px;
    border: 1px solid #49573830;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    color: #495738;
  }

  .card:hover {
    background-position: 10px;
    transform: scale(1.1); /* Slightly less extreme than 1.2 for layout stability */
  }

  .card-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #9A6F1A;
    color: #F4EDD6;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: bold;
    z-index: 2;
  }

  .card-image-container {
    position: relative;
    width: 100%;
    height: 120px;
    margin-bottom: 8px;
    border-radius: 20px;
    overflow: hidden;
  }

  .card-image {
    object-fit: cover;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .card-title {
    font-size: 16px;
    font-weight: bold;
    margin: 0;
    line-height: 1.2;
  }

  .card-subtitle {
    font-size: 12px;
    opacity: 0.8;
    margin: 4px 0;
    font-style: italic;
  }

  .card-price {
    font-size: 18px;
    font-weight: 800;
    margin: 0;
    color: #9A6F1A;
  }
`;

export default ProductCard;
