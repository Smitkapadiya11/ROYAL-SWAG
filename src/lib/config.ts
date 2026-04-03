/** Single source of truth for site-wide contact, address, and social links. */
export const SITE_CONFIG = {
  companyName: "Eximburg International Pvt. Ltd.",
  brandName: "Royal Swag",
  address: {
    line1: "Plot No. 150, 3rd Floor, Amrut Udhyognagar",
    line2: "Kholvad, Kamrej, Surat — Gujarat 394185",
  },
  phone: {
    display: "+91 70965 53300",
    raw: "917096553300",
  },
  email: "info@eximburginternational.in",
  fssai: "TODO_INSERT_REAL_FSSAI_NUMBER",
  whatsapp: {
    number: "917096553300",
    orderMessage:
      "Hi%2C%20I%20want%20to%20order%20Royal%20Swag%20Lung%20Detox%20Tea.%20Please%20share%20available%20packs%20and%20payment%20details.",
    get url() {
      return `https://wa.me/${this.number}?text=${this.orderMessage}`;
    },
  },
  social: {
    instagram: "https://www.instagram.com/royalswag_official/",
    youtube: "https://www.youtube.com/@royalswagofficial",
    facebook: "https://www.facebook.com/royalswag.herbal.cigarette/",
    twitter: "https://twitter.com/royalswag",
  },
};

/** Canonical site origin for Open Graph URLs (no trailing slash). */
export const SITE_ORIGIN = "https://royalswag.in";
