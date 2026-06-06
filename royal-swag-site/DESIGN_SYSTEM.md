# Royal Swag Design System

Canonical tokens live in `src/app/globals.css` (`:root`) and `tailwind.config.js`.

## Colors

```css
--primary: #324023;              /* forest green */
--primary-container: #495738;
--gold: #9A6F1A;                 /* ayurvedic gold */
--parchment: #F4EDD6;            /* background */
--surface: #f5fce7;
--surface-container: #e9f1dc;
--on-surface: #171e11;
--on-surface-variant: #45483f;
--glass: rgba(255, 255, 255, 0.4);
--glass-border: rgba(255, 255, 255, 0.6);
```

## Fonts

| Role | Family | Weights |
|------|--------|---------|
| Display / headlines | Playfair Display | 600, 700 |
| Body / labels | Hanken Grotesk | 400, 500, 600 |

Loaded in `src/app/layout.tsx` as `--font-playfair` and `--font-hanken`.

## Glass card

```css
.glass-card, .card-glass {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.glass-card:hover, .card-glass:hover {
  transform: scale(1.02);
}
```

## Button primary

```css
.btn-primary {
  background: var(--primary);
  color: white;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.05em;
  border-radius: 12px;
  padding: 12px 24px;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(154, 111, 26, 0.3);
}
.btn-primary:active {
  transform: translateY(1px);
}
```

## Logo

| Context | Implementation |
|---------|------------------|
| Asset | `/public/images/royal-swag-logo.png` |
| Dark background (`#324023`) | `<BrandLogo variant="on-dark" />` — cream mark as-is |
| Light background (parchment) | `<BrandLogo variant="on-light" />` — CSS filter for dark mark |
| Header | Min height 40px; `object-contain`; never distort aspect ratio |

Filter on light: `invert(1) sepia(1) saturate(2) hue-rotate(10deg)` (`LOGO_FILTER_ON_LIGHT` in `src/lib/brand-logo.ts`).

## Protected content (do not change without client approval)

- Hero tagline: **"Breathe Clean. Live Free."**
- **Free Lung Test** feature
- **30-Day Guarantee** badge
- Herb descriptions: **Tulsi, Vasaka, Mulethi, Pippali**
- **Prices**
