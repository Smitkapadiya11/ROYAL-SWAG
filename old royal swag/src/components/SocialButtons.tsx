"use client";

import styled from "styled-components";
import { SITE_CONFIG } from "@/lib/config";

const Wrap = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  a {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(250, 246, 238, 0.7);
    text-decoration: none;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    font-size: 20px;
  }
  a:hover {
    transform: scale(1.15) translateY(-3px);
    border-color: #c49a2a;
    background: rgba(196, 154, 42, 0.15);
  }
`;

export default function SocialButtons() {
  return (
    <Wrap>
      <a href={SITE_CONFIG.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        📸
      </a>
      <a href={SITE_CONFIG.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        ▶️
      </a>
      <a href={SITE_CONFIG.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        👍
      </a>
      <a
        href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        💬
      </a>
    </Wrap>
  );
}
