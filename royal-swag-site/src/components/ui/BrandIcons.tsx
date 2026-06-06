type IconProps = {
  size?: number;
  className?: string;
};

export function ShoppingBagIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M6 7h12l-1.2 12.2a1 1 0 0 1-1 .9H8.2a1 1 0 0 1-1-.9L6 7Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M9 7a3 3 0 0 1 6 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5 7h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InstagramIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9a3.5 3.5 0 0 0 3.5 3.5h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2ZM17.6 6.3a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
    </svg>
  );
}

export function YouTubeIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M21.6 7.2a2.4 2.4 0 0 0-1.7-1.7C18 5 12 5 12 5s-6 0-7.9.5A2.4 2.4 0 0 0 2.4 7.2 25 25 0 0 0 2 12a25 25 0 0 0 .4 4.8 2.4 2.4 0 0 0 1.7 1.7C6 19 12 19 12 19s6 0 7.9-.5a2.4 2.4 0 0 0 1.7-1.7A25 25 0 0 0 22 12a25 25 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

export function FacebookIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M13.5 22v-8h2.7l.4-3.2H13.5V8.9c0-.9.3-1.6 1.7-1.6h1.5V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.7H8v3.2h2.5V22h3Z" />
    </svg>
  );
}

export function WhatsAppSocialIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 0 1 6.5 13.1l.2.2-.8 3-3-.8-.2-.2A8.2 8.2 0 1 1 12 3.8Zm-2.4 4.2c.1 1.7 1.2 3.3 2.9 4.2 1.2.6 2.4.7 3.5.4l.4-.1.8 2.1-1 .3c-1.5.4-3.2 0-4.8-1.1-2-1.3-3.1-3.4-3.2-5.3 0-.5.4-.9.9-1 .5 0 .9.3 1 .7l.5 1.5.2-.1c.2-.1.4-.2.6-.3.2-.1.3 0 .4.1l.8 1.5Z" />
    </svg>
  );
}
