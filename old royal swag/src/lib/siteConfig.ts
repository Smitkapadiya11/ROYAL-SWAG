import { getPrimaryProductPrice } from "@/lib/product-price";

function env(key: string): string {
  return process.env[key]?.trim() ?? "";
}

function buildAddress(): string {
  const company = env("NEXT_PUBLIC_COMPANY_ADDRESS");
  if (company) return company;

  const l1 = env("NEXT_PUBLIC_ADDRESS_LINE1");
  const l2 = env("NEXT_PUBLIC_ADDRESS_LINE2");
  if (l1 || l2) {
    return [l1, l2].filter(Boolean).join(", ");
  }

  return "Eximburg International Pvt Ltd, Plot No. 150, 3rd Floor, Amrut Udhyognagar, Kholvad, Kamrej, Surat — Gujarat 394185";
}

function normalizeWhatsappNumber(): string {
  const raw =
    env("NEXT_PUBLIC_WHATSAPP_NUMBER") ||
    env("NEXT_PUBLIC_PHONE_NUMBER")?.replace(/\D/g, "") ||
    "917096553300";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

const whatsappNumber = normalizeWhatsappNumber();

const orderMessagePlain = `Hi, I want to order Royal Swag Lung Detox Tea (Rs ${getPrimaryProductPrice()}). Please share payment details.`;

export const siteConfig = {
  companyName: "Eximburg International Pvt Ltd",
  tagline: "Modern Ayurvedic. Scientifically Inspired.",
  whatsappNumber,
  phone:
    env("NEXT_PUBLIC_PHONE_DISPLAY") ||
    env("NEXT_PUBLIC_PHONE_NUMBER") ||
    "+91 70965 53300",
  email: env("NEXT_PUBLIC_EMAIL") || env("NEXT_PUBLIC_SUPPORT_EMAIL") || "hello@royalswag.in",
  fssaiLicense: env("NEXT_PUBLIC_FSSAI_LICENSE") || env("NEXT_PUBLIC_FSSAI_NUMBER"),
  gstin: env("NEXT_PUBLIC_COMPANY_GSTIN"),
  address: buildAddress(),
  social: {
    instagram:
      env("NEXT_PUBLIC_INSTAGRAM_URL") || "https://www.instagram.com/royalswag.in/",
    youtube: env("NEXT_PUBLIC_YOUTUBE_URL") || "https://www.youtube.com/@royalswag",
    facebook: env("NEXT_PUBLIC_FACEBOOK_URL") || "https://www.facebook.com/royalswag",
  },
  whatsappOrderMessage: encodeURIComponent(orderMessagePlain),
  get whatsappOrderLink() {
    if (!this.whatsappNumber) return "";
    return `https://wa.me/${this.whatsappNumber}?text=${this.whatsappOrderMessage}`;
  },
  get phoneTel() {
    const digits = this.phone.replace(/\D/g, "");
    if (!digits) return "";
    const normalized = digits.length === 10 ? `91${digits}` : digits;
    return `+${normalized}`;
  },
  get fssaiVerifyLink() {
    if (!this.fssaiLicense) return "";
    return `https://foscos.fssai.gov.in/search-license?licenseNo=${encodeURIComponent(this.fssaiLicense)}`;
  },
};
