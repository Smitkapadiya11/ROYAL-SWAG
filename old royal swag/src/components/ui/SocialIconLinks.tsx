import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

type SocialIconLinksProps = {
  className?: string;
  iconClassName?: string;
  size?: number;
};

function InstagramIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.132 4.602.333 3.635.7a5.917 5.917 0 00-2.126 1.384A5.917 5.917 0 00.125 4.21C-.242 5.177-.443 6.35-.503 7.627-.562 8.907-.575 9.316-.575 12.575s.013 3.668.072 4.948c.06 1.277.261 2.45.628 3.417a5.917 5.917 0 001.384 2.126 5.917 5.917 0 002.126 1.384c.967.367 2.14.568 3.417.628 1.28.059 1.689.072 4.948.072s3.668-.013 4.948-.072c1.277-.06 2.45-.261 3.417-.628a5.917 5.917 0 002.126-1.384 5.917 5.917 0 001.384-2.126c.367-.967.568-2.14.628-3.417.059-1.28.072-1.689.072-4.948s-.013-3.668-.072-4.948c-.06-1.277-.261-2.45-.628-3.417a5.917 5.917 0 00-1.384-2.126A5.917 5.917 0 0019.79.7c-.967-.367-2.14-.568-3.417-.628C15.093.013 14.684 0 11.425 0H12z" />
      <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function FacebookIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function SocialIconLinks({
  className,
  iconClassName = "text-white/80 hover:text-ayurvedic-gold",
  size = 24,
}: SocialIconLinksProps) {
  const links = [
    { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: siteConfig.social.youtube, label: "YouTube", Icon: YouTubeIcon },
    { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
  ] as const;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn("transition-colors", iconClassName)}
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  );
}
