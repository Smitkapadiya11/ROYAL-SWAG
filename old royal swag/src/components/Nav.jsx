"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import RoyalButton from './ui/RoyalButton';

const StyledTooltipWrapper = styled.div`
  .tooltip-wrapper {
    --clr-btn: transparent;
    --clr-dropdown: #495738;
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
  background: #495738;
  color: #F4EDD6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 64px;
  min-height: 64px;

  @media (max-width: 767px) {
    top: 36px;
    padding: 0 20px;
    height: 56px;
    min-height: 56px;
    background: #495738;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  min-width: 120px;
  flex-shrink: 0;
  text-decoration: none;

  img {
    width: 120px !important;
    height: auto !important;
    filter: brightness(0) invert(1);
    object-fit: contain;
  }

  @media (max-width: 767px) {
    min-width: 100px;

    img {
      width: 100px !important;
    }
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  @media (max-width: 767px) {
    display: none;
  }
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 767px) {
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
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  padding: 4px;

  @media (max-width: 767px) {
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
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.$isOpen ? 'auto' : 'none')};
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
        <LogoLink href="/">
          <Image
            src="/images/logo/new_logo.png"
            alt="Royal Swag"
            width={120}
            height={48}
            priority
            style={{ objectFit: 'contain' }}
          />
        </LogoLink>

        <DesktopMenu>
          <StyledTooltipWrapper>
            <div className="tooltip-wrapper">
              <ul className="tooltip-container">
                {links.map((link, i) => (
                  <li key={i} className="nav-link">
                    <Link href={link.href} style={{ textDecoration: 'none' }}>
                      <div className="tooltip-tab">{link.name}</div>
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
          <Link href="/product">
            <RoyalButton>Buy Now</RoyalButton>
          </Link>
        </RightSide>

        <MobileMenuBtn onClick={() => setIsOpen(true)} aria-label="Open menu">
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
        <Link href="/product" onClick={() => setIsOpen(false)}>
          <RoyalButton style={{ marginTop: '10px' }}>Buy Now</RoyalButton>
        </Link>
      </FullScreenOverlay>

    </>
  );
}
