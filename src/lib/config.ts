export const SITE = {
  name:    "Royal Swag",
  tagline: "Breathe Clean. Live Free.",
  price:   { display: "₹349", mrp: "₹499", savings: "Save ₹150" },
  company: "Eximburg International Pvt. Ltd.",
  founded: "2015",
  address: {
    line1: "Plot No. 150, 3rd Floor, Amrut Udhyognagar",
    line2: "Kholvad, Kamrej, Surat — Gujarat 394185",
  },
  phone:  { display: "+91 70965 53300", raw: "917096553300" },
  email:  "info@eximburginternational.in",
  fssai:  "TODO_INSERT_FSSAI_NUMBER",
  whatsapp: {
    number:  "917096553300",
    message: encodeURIComponent("Hi, I want to order Royal Swag Lung Detox Tea. Please share pack details."),
    get url() { return `https://wa.me/${this.number}?text=${this.message}`; },
  },
  social: {
    instagram: "https://www.instagram.com/royalswag_official/",
    youtube:   "https://www.youtube.com/@royalswagofficial",
    facebook:  "https://www.facebook.com/royalswag.herbal.cigarette/",
    twitter:   "https://twitter.com/royalswag",
  },
  amazon: {
    india: "https://www.amazon.in/royalswag",
    us:    "https://www.amazon.com/royalswag",
  },
  stats: [
    { value: "2015",   label: "Founded" },
    { value: "10 Yrs", label: "Experience" },
    { value: "4.7★",   label: "Amazon Rating" },
    { value: "847+",   label: "Verified Reviews" },
  ],
  certifications: ["ISO", "GMP", "FSSAI", "AYUSH", "LEAN"] as string[],
  herbs: [
    { id: "vasaka",      name: "Vasaka",      botanical: "Adhatoda vasica",      role: "The Airway Opener",  benefit: "Breaks down mucus and opens airways.",         image: "/images/vasaka.webp" },
    { id: "mulethi",     name: "Mulethi",     botanical: "Glycyrrhiza glabra",   role: "The Soother",        benefit: "Soothes inflamed airways, eases cough.",        image: "/images/Mulethi.webp" },
    { id: "tulsi",       name: "Tulsi",       botanical: "Ocimum sanctum",       role: "The Sacred Healer",  benefit: "Anti-inflammatory, fights infections.",          image: "/images/Tulsi.webp" },
    { id: "pippali",     name: "Pippali",     botanical: "Piper longum",         role: "The Reviver",        benefit: "Expands lung capacity, boosts oxygen.",          image: "/images/Pippali.jpg" },
    { id: "kantakari",   name: "Kantakari",   botanical: "Solanum xanthocarpum", role: "The Cleanser",       benefit: "Relieves bronchitis, clears airways.",            image: "/images/Kantakari.webp" },
    { id: "bibhitaki",   name: "Bibhitaki",   botanical: "Terminalia bellirica", role: "The Protector",      benefit: "Prevents infection, clears lung toxins.",         image: "/images/Bibhitakit.jpg" },
    { id: "pushkarmool", name: "Pushkarmool", botanical: "Inula racemosa",       role: "The Deep Purifier",  benefit: "Deep lung purification, reduces inflammation.",   image: "/images/pushkarmool.webp" },
  ],
  team: [
    { id: "hitesh",  name: "Hitesh Sabhadiya", role: "Founder & CEO",      image: "/images/hitesh.jpeg",                  bio: "Founded Eximburg in 2015. Grew Royal Swag from Surat to 4 continents. Featured on Amazon Prime & Netflix." },
    { id: "manoj",   name: "Manoj Koshiya",    role: "Co-Founder",         image: "/images/manoj.jpeg",                   bio: "Leads R&D and manufacturing. Ensures every batch meets ISO, GMP, FSSAI & AYUSH standards." },
    { id: "jaideep", name: "Jaideep Singh",    role: "Business Director",  image: "/images/jaideep%20singh.jpeg",         bio: "12 years e-commerce experience. Leads Amazon strategy, D2C operations and growth analytics." },
  ],
} as const;

/** Backward-compat alias — existing pages and API routes use SITE_CONFIG */
export const SITE_CONFIG = SITE;

/** Canonical site origin (no trailing slash) */
export const SITE_ORIGIN = "https://royalswag.in";
