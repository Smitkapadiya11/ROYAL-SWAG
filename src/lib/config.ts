export const S = {
  name:    "Royal Swag",
  tagline: "Breathe Clean. Live Free.",
  price:   { now: "₹349", was: "₹499" },
  company: "Eximburg International Pvt. Ltd.",
  address: {
    l1: "Plot No. 150, 3rd Floor, Amrut Udhyognagar",
    l2: "Kholvad, Kamrej, Surat — Gujarat 394185",
  },
  phone:    "+91 70965 53300",
  phoneRaw: "917096553300",
  email:   "Eximburg@gmail.com",
  fssai:   "TODO_FSSAI_NUMBER",
  wa: {
    num: "917096553300",
    msg: encodeURIComponent("Hi, I want to order Royal Swag Lung Detox Tea. Please share pack details."),
    get url() { return `https://wa.me/${this.num}?text=${this.msg}`; },
  },
  social: {
    ig: "https://www.instagram.com/royalswag_official/",
    yt: "https://www.youtube.com/@royalswagofficial",
    fb: "https://www.facebook.com/royalswag.herbal.cigarette/",
    tw: "https://twitter.com/royalswag",
  },
  certs: ["ISO", "GMP", "FSSAI", "AYUSH", "LEAN"],
  stats: [
    { v: "2016",   l: "Founded" },
    { v: "10 Yrs", l: "Experience" },
    { v: "4.7★",   l: "Amazon Rating" },
    { v: "847+",   l: "Reviews" },
  ],
  herbs: [
    { id: "vasaka",      name: "Vasaka",      bot: "Adhatoda vasica",       role: "The Airway Opener",  benefit: "Breaks down mucus, opens bronchial passages.",         img: "/images/vasaka.jpg" },
    { id: "mulethi",     name: "Mulethi",     bot: "Glycyrrhiza glabra",    role: "The Soother",        benefit: "Soothes inflamed airways, eases chronic cough.",        img: "/images/mulethi.jpg" },
    { id: "tulsi",       name: "Tulsi",       bot: "Ocimum sanctum",        role: "The Sacred Healer",  benefit: "Anti-inflammatory, fights respiratory infections.",      img: "/images/tulsi.jpg" },
    { id: "pippali",     name: "Pippali",     bot: "Piper longum",          role: "The Reviver",        benefit: "Expands lung capacity, improves oxygen absorption.",     img: "/images/pippali.jpg" },
    { id: "kantakari",   name: "Kantakari",   bot: "Solanum xanthocarpum",  role: "The Cleanser",       benefit: "Relieves bronchitis, clears blocked airways.",            img: "/images/kantakari.jpg" },
    { id: "bibhitaki",   name: "Bibhitaki",   bot: "Terminalia bellirica",  role: "The Protector",      benefit: "Prevents infection, clears accumulated lung toxins.",     img: "/images/bibhitaki.jpg" },
    { id: "pushkarmool", name: "Pushkarmool", bot: "Inula racemosa",        role: "The Deep Purifier",  benefit: "Deep lung purification, reduces pulmonary inflammation.", img: "/images/pushkarmool.jpg" },
  ],
  team: [
    { id: "hitesh",  initials: "HS", name: "Hitesh Sabhadiya", role: "Founder & CEO",     img: "/images/hitesh.jpeg",             bio: "Started Eximburg in 2015. Built Royal Swag from Surat into something people trust on four continents. You may have seen us on Amazon Prime or Netflix." },
    { id: "manoj",   initials: "MK", name: "Manoj Koshiya",    role: "Co-Founder",        img: "/images/manoj.jpeg",              bio: "Runs R&D and the factory floor. He won't release a batch until it clears ISO, GMP, FSSAI, and AYUSH checks." },
    { id: "jaideep", initials: "JS", name: "Jaideep Singh",    role: "Business Director", img: "/images/jaideep%20singh.jpeg",    bio: "Twelve years in e-commerce. Handles Amazon, our own site, and the numbers behind what ships each week." },
  ],
  reviews: [
    { initials: "RK", name: "Ramesh K., 44, Ahmedabad", risk: "Moderate Risk", before: "Coughed every morning for 20 minutes before work.", after: "By week 3 it dropped to barely 5 minutes — felt in control again." },
    { initials: "SP", name: "Sneha P., 39, Delhi",      risk: "High Risk",     before: "Stairs left me winded. Paused halfway up every evening.", after: "After a month I walk up without stopping. My husband noticed first." },
    { initials: "VM", name: "Vikram M., 51, Mumbai",    risk: "Mild Risk",     before: "Post-Diwali smog shut my chest down for two weeks straight.", after: "Started early this year — tightness eased within 10 days." },
    { initials: "PT", name: "Priya T., 33, Bengaluru",  risk: "Moderate Risk", before: "Seasonal allergies every October without fail.", after: "Sailed through this year. Zero antihistamines for the first time." },
    { initials: "AK", name: "Arjun K., 47, Surat",      risk: "High Risk",     before: "Ex-smoker, 8 months clean but chest still felt heavy.", after: "Two weeks in and I could take a full breath again." },
    { initials: "NM", name: "Neha M., 29, Pune",         risk: "Mild Risk",     before: "Work near traffic every day — constant dry throat.", after: "Throat cleared, sleep improved. Have ordered three packs now." },
  ],
} as const;

// ── Backward-compat aliases for pages/routes not being rewritten ──
export const SITE = {
  name:    S.name,
  tagline: S.tagline,
  price:   { display: S.price.now, mrp: S.price.was, savings: "Save ₹150" },
  company: S.company,
  founded: "2015",
  address: { line1: S.address.l1, line2: S.address.l2 },
  phone:   { display: S.phone, raw: S.phoneRaw },
  email:   S.email,
  fssai:   S.fssai,
  whatsapp: { number: S.wa.num, message: S.wa.msg, get url() { return S.wa.url; } },
  social:  { instagram: S.social.ig, youtube: S.social.yt, facebook: S.social.fb, twitter: S.social.tw },
  amazon:  { india: "https://www.amazon.in/royalswag", us: "https://www.amazon.com/royalswag" },
  stats:   S.stats.map(s => ({ value: s.v, label: s.l })),
  certifications: [...S.certs] as string[],
  herbs:   S.herbs.map(h => ({ id: h.id, name: h.name, botanical: h.bot, role: h.role, benefit: h.benefit, image: h.img })),
  team:    S.team.map(m => ({ id: m.id, name: m.name, role: m.role, image: m.img, bio: m.bio })),
} as const;

export const SITE_CONFIG = SITE;
export const SITE_ORIGIN = "https://royalswag.in";
