// Public site content. The publications, people and news below are placeholder
// copy — swap them for real records (or load them from Supabase) before launch.

export type NavChild = { name: string; href: string };
export type NavItem = { name: string; href: string; children?: NavChild[] };

export const institution = "University of Health and Allied Sciences";
export const school = "School of Pharmacy";
export const centreName = "Centre for Phytomedicine and Natural Product Drug Discovery";
export const centreShortName = "CPNPDD";

export const navItems: NavItem[] = [
  {
    name: "About",
    href: "/about",
    children: [
      { name: "About the Centre", href: "/about" },
      { name: "Physic Garden", href: "/physicgarden" },
      { name: "Contact & Directions", href: "/contact" },
    ],
  },
  {
    name: "Research",
    href: "/research",
    children: [
      { name: "Research Areas", href: "/research" },
      { name: "Publications", href: "/research#publications" },
      { name: "Physic Garden", href: "/physicgarden" },
    ],
  },
  // Children are filled in from the labs table by components/site-header.tsx.
  { name: "Labs", href: "/labs" },
  { name: "Services", href: "/services" },
  { name: "News & Events", href: "/#news" },
  { name: "Contact", href: "/contact" },
];

export const auxLinks: NavChild[] = [
  { name: "School of Pharmacy", href: "https://www.uhas.edu.gh" },
  { name: "Partner With Us", href: "/contact" },
];

export const stats = [
  { value: "120+", label: "Medicinal plant species catalogued" },
  { value: "45", label: "Peer-reviewed publications" },
  { value: "18", label: "Active researchers & students" },
  { value: "9", label: "Industry & academic partners" },
];

export const focusAreas = [
  {
    icon: "leaf",
    title: "Phytochemistry & Isolation",
    body: "Extraction, fractionation and structural elucidation of bioactive compounds from West African medicinal flora.",
  },
  {
    icon: "flask",
    title: "Pharmacology & Bioassays",
    body: "In vitro and in vivo screening for antimicrobial, anti-inflammatory, antimalarial and metabolic activity.",
  },
  {
    icon: "capsule",
    title: "Formulation & Delivery",
    body: "Turning standardised extracts into stable, dose-consistent dosage forms ready for clinical evaluation.",
  },
  {
    icon: "shield",
    title: "Quality & Safety",
    body: "Toxicology, pharmacognostic standards and quality control that help herbal medicines meet regulatory bars.",
  },
];

export const publications = [
  {
    title: "Antiplasmodial activity of alkaloid-rich fractions from Cryptolepis sanguinolenta root bark",
    authors: "A. Mensah, K. Boateng, E. Owusu",
    venue: "Journal of Ethnopharmacology",
    year: 2025,
    tag: "Pharmacology",
  },
  {
    title: "HPLC fingerprinting and quality standards for commercial herbal antimalarials in the Volta Region",
    authors: "E. Owusu, P. Agbeko, A. Mensah",
    venue: "Phytochemical Analysis",
    year: 2025,
    tag: "Quality Control",
  },
  {
    title: "Wound-healing hydrogel incorporating standardised Aloe and Moringa extracts",
    authors: "S. Asante, K. Boateng",
    venue: "International Journal of Pharmaceutics",
    year: 2024,
    tag: "Formulation",
  },
  {
    title: "Ethnobotanical survey of medicinal plants used for metabolic disorders in the Ho Municipality",
    authors: "P. Agbeko, S. Asante, E. Owusu",
    venue: "Frontiers in Pharmacology",
    year: 2024,
    tag: "Ethnobotany",
  },
];

export const news = [
  {
    date: "Sep 2026",
    kind: "News",
    title: "Physic Garden expands with 30 new indigenous medicinal species",
    body: "The garden now serves as a living reference collection for teaching and authentication.",
  },
  {
    date: "Nov 14, 2026",
    kind: "Event",
    title: "Annual Phytomedicine Research Symposium",
    body: "Researchers, practitioners and regulators meet to discuss evidence for traditional medicines.",
  },
  {
    date: "Aug 2026",
    kind: "News",
    title: "Centre partners with regional manufacturers on standardised herbal products",
    body: "A new collaboration brings laboratory quality control to local production lines.",
  },
];
