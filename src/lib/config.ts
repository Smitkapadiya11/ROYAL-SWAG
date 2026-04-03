/** Single source of truth for site-wide contact, address, and social links. */
export const SITE_CONFIG = {
  company: "Eximburg International Pvt. Ltd.",
  address: {
    line1: "Plot No. 150, 3rd Floor, Amrut Udhyognagar",
    line2: "Kholvad, Kamrej, Surat — Gujarat 394185",
  },
  phone: "+91 70965 53300",
  whatsapp: {
    number: "917096553300",
    orderMessage: encodeURIComponent(
      "Hi, I want to order Royal Swag Lung Detox Tea. Please share available packs and payment details."
    ),
  },
  email: "info@eximburginternational.in",
  /** TODO: Replace with real FSSAI license number before launch */
  fssai: "XXXXXXXXXXXXXXX",
  social: {
    instagram: "https://www.instagram.com/royalswag_official/",
    youtube: "https://www.youtube.com/@royalswagofficial",
    facebook: "https://www.facebook.com/royalswag.herbal.cigarette/",
    twitter: "https://twitter.com/royalswag",
  },
} as const;

/** Canonical site origin for Open Graph URLs (no trailing slash). */
export const SITE_ORIGIN = "https://royalswag.in";
