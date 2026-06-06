"use client";

import styled from "styled-components";
import { SITE_CONFIG } from "@/lib/config";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppSocialIcon,
  YouTubeIcon,
} from "@/components/ui/BrandIcons";

const SOCIALS = [
  {
    id: "instagram",
    href: SITE_CONFIG.instagram,
    label: "Instagram",
    Icon: InstagramIcon,
    hoverBg: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)",
    hoverBorder: "rgba(255,255,255,0.35)",
  },
  {
    id: "youtube",
    href: SITE_CONFIG.youtube,
    label: "YouTube",
    Icon: YouTubeIcon,
    hoverBg: "#ff0000",
    hoverBorder: "rgba(255,255,255,0.35)",
  },
  {
    id: "facebook",
    href: SITE_CONFIG.facebook,
    label: "Facebook",
    Icon: FacebookIcon,
    hoverBg: "#1877f2",
    hoverBorder: "rgba(255,255,255,0.35)",
  },
  {
    id: "whatsapp",
    href: `https://wa.me/${SITE_CONFIG.whatsappNumber}`,
    label: "WhatsApp",
    Icon: WhatsAppSocialIcon,
    hoverBg: "#25d366",
    hoverBorder: "rgba(255,255,255,0.35)",
  },
] as const;

const Wrap = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const SocialLink = styled.a<{
  $hoverBg: string;
  $hoverBorder: string;
}>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #f4edd6;
  text-decoration: none;
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    background 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;

  svg {
    display: block;
    flex-shrink: 0;
  }

  &:hover {
    transform: translateY(-3px) scale(1.06);
    background: ${({ $hoverBg }) => $hoverBg};
    border-color: ${({ $hoverBorder }) => $hoverBorder};
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
    color: #ffffff;
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }

  &:focus-visible {
    outline: 2px solid #9a6f1a;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: background 0.01ms, border-color 0.01ms;

    &:hover,
    &:active {
      transform: none;
    }
  }
`;

export default function SocialButtons() {
  return (
    <Wrap>
      {SOCIALS.map(({ id, href, label, Icon, hoverBg, hoverBorder }) => (
        <SocialLink
          key={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          $hoverBg={hoverBg}
          $hoverBorder={hoverBorder}
        >
          <Icon size={20} />
        </SocialLink>
      ))}
    </Wrap>
  );
}
