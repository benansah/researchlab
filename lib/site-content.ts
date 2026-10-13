// Static public site content: navigation, contact details and the copy for the About,
// Research and Services pages. Labs, plants, publications and news live in Supabase.

export type NavChild = { name: string; href: string };
export type NavItem = { name: string; href: string; children?: NavChild[] };

export const institution = "University of Health and Allied Sciences";
export const school = "School of Pharmacy";
export const centreName = "Centre for Phytomedicine and Natural Product Drug Discovery";
export const centreShortName = "CPNPDD";

export const contactEmail = "cpnpdd@uhas.edu.gh";
export const postalAddress = ["School of Pharmacy", "University of Health and Allied Sciences", "PMB 31, Ho, Volta Region, Ghana"];
export const mapUrl = "https://www.google.com/maps/search/?api=1&query=University+of+Health+and+Allied+Sciences+Ho+Ghana";

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
  { name: "News & Events", href: "/news" },
  { name: "Contact", href: "/contact" },
];

export const auxLinks: NavChild[] = [
  { name: "School of Pharmacy", href: "https://www.uhas.edu.gh" },
  { name: "Partner With Us", href: "/contact" },
];

export const focusAreas = [
  {
    id: "phytochemistry",
    icon: "leaf",
    title: "Phytochemistry & Isolation",
    body: "Extraction, fractionation and structural elucidation of bioactive compounds from West African medicinal flora.",
    detail: "Starting from ethnobotanical leads and authenticated garden specimens, we use bioassay-guided fractionation, chromatography and spectroscopy to find and identify the molecules responsible for a plant's activity.",
  },
  {
    id: "pharmacology",
    icon: "flask",
    title: "Pharmacology & Bioassays",
    body: "In vitro and in vivo screening for antimicrobial, anti-inflammatory, antimalarial and metabolic activity.",
    detail: "Extracts and isolated compounds are tested in validated models of infection, inflammation and metabolic disease to establish whether — and how — they work.",
  },
  {
    id: "formulation",
    icon: "capsule",
    title: "Formulation & Delivery",
    body: "Turning standardised extracts into stable, dose-consistent dosage forms ready for clinical evaluation.",
    detail: "We develop and optimise dosage forms, run stability and dissolution studies, and work with local manufacturers to bring consistent products to patients.",
  },
  {
    id: "quality-safety",
    icon: "shield",
    title: "Quality & Safety",
    body: "Toxicology, pharmacognostic standards and quality control that help herbal medicines meet regulatory bars.",
    detail: "Acute and sub-chronic toxicity studies, chemical fingerprinting and quality specifications give regulators and practitioners the evidence they need to use herbal medicines safely.",
  },
];

export const services = [
  {
    title: "Plant authentication",
    body: "Macroscopic and microscopic identification of medicinal plant material, with reference to authenticated specimens in the Physic Garden.",
  },
  {
    title: "Extraction & phytochemical screening",
    body: "Preparation of extracts and screening for major classes of secondary metabolites such as alkaloids, flavonoids, saponins and tannins.",
  },
  {
    title: "Chromatographic analysis & fingerprinting",
    body: "TLC and HPLC fingerprinting to confirm identity, detect adulteration and set quality specifications for herbal products.",
  },
  {
    title: "Biological activity testing",
    body: "In vitro antimicrobial, antioxidant and cell-based assays to evaluate extracts and isolated compounds.",
  },
  {
    title: "Toxicology studies",
    body: "Acute and sub-chronic toxicity studies designed to support safety dossiers for herbal medicine registration.",
  },
  {
    title: "Formulation & stability",
    body: "Pre-formulation, dosage-form development, dissolution and stability testing for herbal and natural-product medicines.",
  },
];

export const audiences = [
  { title: "Herbal medicine manufacturers", body: "Quality control, standardisation and product development support for local producers." },
  { title: "Researchers & universities", body: "Collaborative projects, shared analysis and access to authenticated plant material." },
  { title: "Regulators & health agencies", body: "Independent evidence on the quality and safety of herbal products." },
];
