"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import RoyalButton from './ui/Button';

// Using the exact styled wrapper layout inspired by Tooltip from reference.md
const StyledTooltipWrapper = styled.div`
  .tooltip-wrapper {
    --clr-btn: transparent;
    --clr-dropdown: #2A3020;
    --clr-nav-hover: #9A6F1A;
    --clr-dropdown-hov: #9A6F1A;
    --clr-dropdown-link-hov: #9A6F1A;
    --clr-light: #F4EDD6;
  }
  .nav-link {
    position: relative;
  }
  .tooltip-wrapper > .tooltip-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 20px;
  }
  .tooltip-container,
  .tooltip-menu-with-icon {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-link > .tooltip-tab {
    color: var(--clr-light);
    background: var(--clr-btn);
    padding: 0.8rem 1rem;
    letter-spacing: 1px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    column-gap: 12px;
    justify-content: space-between;
    text-transform: uppercase;
    cursor: pointer;
    border: 1px solid transparent;
    transition: 0.3s ease-in-out;
    border-radius: 8px;
  }
  .nav-link > .tooltip-tab:hover {
    background-color: var(--clr-nav-hover);
    transform: scale(1.05);
  }
  .tooltip-links {
    text-decoration: none;
  }
`;

const NavContainer = styled.nav`
  position: sticky;
  top: 36px;
  z-index: 9998;
  background: rgba(73, 87, 56, 0.95);
  backdrop-filter: blur(10px);
  color: #F4EDD6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 40px;
  
  @media (max-width: 768px) {
    padding: 10px 20px;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  @media (max-width: 768px) {
    display: none;
  }
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LocaleToggle = styled.button`
  background: rgba(244, 237, 214, 0.15);
  color: #F4EDD6;
  border: 1px solid rgba(244, 237, 214, 0.3);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(244, 237, 214, 0.25);
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: #F4EDD6;
  font-size: 24px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #495738;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  transition: opacity 0.3s ease;
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #F4EDD6;
  font-size: 32px;
  cursor: pointer;
`;

const MobileLink = styled(Link)`
  color: #F4EDD6;
  font-size: 24px;
  text-decoration: none;
  font-weight: bold;
`;

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const stored = localStorage.getItem('locale');
    if (stored) setLocale(stored);
  }, []);

  const toggleLocale = () => {
    const next = locale === 'en' ? 'hi' : 'en';
    setLocale(next);
    localStorage.setItem('locale', next);
    // For App Router: add ?lang= param to signal locale to client components
    const url = new URL(window.location.href);
    url.searchParams.set('lang', next);
    window.history.replaceState({}, '', url.toString());
  };
  
  const links = [
    { name: 'Home', href: '/' },
    { name: 'Lung Test', href: '/lung-test' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <NavContainer>
        <Link href="/">
          <div style={{ position: 'relative', width: '120px', height: '40px' }}>
            <Image 
              src="/images/new_logo.png" 
              alt="Royal Swag" 
              fill 
              style={{ objectFit: 'contain' }} 
            />
          </div>
        </Link>
        
        <DesktopMenu>
          <StyledTooltipWrapper>
            <div className="tooltip-wrapper">
              <ul className="tooltip-container">
                {links.map((link, i) => (
                  <li key={i} className="nav-link">
                    <Link href={link.href} style={{ textDecoration: 'none' }}>
                      <div className="tooltip-tab">
                        {link.name}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </StyledTooltipWrapper>
        </DesktopMenu>
        
        <RightSide>
          <LocaleToggle onClick={toggleLocale} aria-label="Switch language">
            {locale === 'en' ? 'EN | हि' : 'हि | EN'}
          </LocaleToggle>
          <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" style={{ color: '#F4EDD6' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <RoyalButton>Buy Now</RoyalButton>
        </RightSide>
        
        <MobileMenuBtn onClick={() => setIsOpen(true)}>
          ☰
        </MobileMenuBtn>
      </NavContainer>

      <FullScreenOverlay $isOpen={isOpen}>
        <CloseBtn onClick={() => setIsOpen(false)}>×</CloseBtn>
        {links.map((link, i) => (
          <MobileLink key={i} href={link.href} onClick={() => setIsOpen(false)}>
            {link.name}
          </MobileLink>
        ))}
        <LocaleToggle onClick={toggleLocale} style={{ marginTop: '10px', fontSize: '16px', padding: '8px 20px' }}>
          {locale === 'en' ? 'Switch to हिन्दी' : 'Switch to English'}
        </LocaleToggle>
        <RoyalButton style={{ marginTop: '10px' }}>Buy Now</RoyalButton>
      </FullScreenOverlay>
    </>
  );
}
