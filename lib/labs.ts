import { createClient } from "./supabase/server";

export type LabMember = {
  id: string;
  lab_id: string;
  name: string;
  role: string;
  research_topic: string;
  email: string;
  photo_url: string;
  sort_order: number;
};

export type Lab = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  objective: string;
  summary: string;
  aims: string[];
  research_areas: string[];
  techniques: string[];
  lead_name: string;
  lead_title: string;
  lead_bio: string;
  lead_email: string;
  lead_photo_url: string;
  contact_email: string;
  location: string;
  sort_order: number;
  published: boolean;
  lab_members: LabMember[];
};

const labSelect = "*, lab_members(*)";

function sortMembers(lab: Lab): Lab {
  return { ...lab, lab_members: [...(lab.lab_members ?? [])].sort((a, b) => a.sort_order - b.sort_order) };
}

// PostgREST returns PGRST205 when a table does not exist yet (migration not run).
function isMissingTable(error: { code?: string } | null) {
  return error?.code === "PGRST205" || error?.code === "42P01";
}

export async function getLabs(): Promise<Lab[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("labs").select(labSelect).eq("published", true).order("sort_order");
  if (error) {
    if (isMissingTable(error)) return fallbackLabs;
    throw new Error(`Could not load labs: ${error.message}`);
  }
  return (data as Lab[]).map(sortMembers);
}

export async function getLab(slug: string): Promise<Lab | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("labs").select(labSelect).eq("slug", slug).eq("published", true).maybeSingle();
  if (error) {
    if (isMissingTable(error)) return fallbackLabs.find((lab) => lab.slug === slug) ?? null;
    throw new Error(`Could not load lab: ${error.message}`);
  }
  return data ? sortMembers(data as Lab) : null;
}

export function initials(name: string) {
  return name
    .replace(/^(prof|dr|mr|mrs|ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

// Shown only until supabase/migrations/0001_labs.sql has been run; mirrors its seed rows.
function member(lab: string, i: number, role: string, research_topic: string): LabMember {
  return { id: `${lab}-m${i}`, lab_id: lab, name: "Student Name", role, research_topic, email: "", photo_url: "", sort_order: i };
}

const fallbackLabs: Lab[] = [
  {
    id: "harley-lab",
    slug: "harley-lab",
    name: "Harley Lab",
    tagline: "Bioactive natural products for infectious disease",
    objective: "To discover and characterise plant-derived compounds that can become safe, affordable treatments for malaria and drug-resistant infections.",
    summary: "The Harley Lab combines ethnobotanical leads with bioassay-guided fractionation to isolate the molecules responsible for a plant's traditional use, then tests them against clinically relevant pathogens.",
    aims: [
      "Screen traditionally used medicinal plants for antiplasmodial and antimicrobial activity",
      "Isolate and elucidate the structures of the most active constituents",
      "Establish mechanisms of action and resistance profiles for lead compounds",
    ],
    research_areas: ["Antimalarial discovery", "Antimicrobial resistance", "Phytochemistry"],
    techniques: ["Bioassay-guided fractionation", "HPLC & LC-MS", "NMR structure elucidation", "In vitro parasite culture"],
    lead_name: "Dr. Harley",
    lead_title: "Lab Lead · Senior Lecturer, Pharmacognosy",
    lead_bio: "Leads the Centre's work on anti-infective natural products and supervises graduate research in pharmacognosy.",
    lead_email: "",
    lead_photo_url: "",
    contact_email: "",
    location: "School of Pharmacy, Block B",
    sort_order: 1,
    published: true,
    lab_members: [
      member("harley-lab", 1, "PhD Candidate", "Antiplasmodial alkaloids from Cryptolepis species"),
      member("harley-lab", 2, "MPhil Student", "Antibacterial activity of Volta Region medicinal plants"),
      member("harley-lab", 3, "Research Assistant", "Extraction and compound library management"),
    ],
  },
  {
    id: "jato-lab",
    slug: "jato-lab",
    name: "Jato Lab",
    tagline: "Pharmacology and safety of herbal medicines",
    objective: "To generate the pharmacological and toxicological evidence that herbal medicines need to be used safely and registered with confidence.",
    summary: "The Jato Lab studies how standardised extracts act in the body — from efficacy models for inflammation and metabolic disease to the toxicology studies regulators require.",
    aims: [
      "Evaluate efficacy of herbal preparations in validated in vitro and in vivo models",
      "Conduct acute and sub-chronic toxicity studies to define safe dosing",
      "Investigate herb–drug interactions relevant to local prescribing",
    ],
    research_areas: ["Pharmacology", "Toxicology", "Metabolic & inflammatory disease"],
    techniques: ["Cell-based assays", "Animal efficacy models", "Histopathology", "Biochemical analysis"],
    lead_name: "Dr. Jato",
    lead_title: "Lab Lead · Lecturer, Pharmacology & Toxicology",
    lead_bio: "Directs pharmacology and safety studies across the Centre and collaborates with clinicians on translational work.",
    lead_email: "",
    lead_photo_url: "",
    contact_email: "",
    location: "School of Pharmacy, Block B",
    sort_order: 2,
    published: true,
    lab_members: [
      member("jato-lab", 1, "PhD Candidate", "Hepatoprotective effects of standardised extracts"),
      member("jato-lab", 2, "MPhil Student", "Sub-chronic toxicity of a polyherbal antidiabetic"),
    ],
  },
  {
    id: "aggrey-lab",
    slug: "aggrey-lab",
    name: "Aggrey Lab",
    tagline: "Formulation and quality of phytomedicines",
    objective: "To turn promising plant extracts into stable, standardised medicines that meet pharmaceutical quality standards.",
    summary: "The Aggrey Lab works where discovery meets manufacturing: developing dosage forms, setting quality specifications and helping local producers deliver consistent herbal products.",
    aims: [
      "Develop and optimise dosage forms for standardised herbal extracts",
      "Establish chemical fingerprints and quality specifications for marketed products",
      "Partner with local manufacturers to improve product quality and stability",
    ],
    research_areas: ["Pharmaceutics", "Quality control", "Product development"],
    techniques: ["Pre-formulation studies", "Stability testing", "HPLC fingerprinting", "Dissolution testing"],
    lead_name: "Dr. Aggrey",
    lead_title: "Lab Lead · Lecturer, Pharmaceutics",
    lead_bio: "Leads formulation and quality-control research and the Centre's partnerships with industry.",
    lead_email: "",
    lead_photo_url: "",
    contact_email: "",
    location: "School of Pharmacy, Block C",
    sort_order: 3,
    published: true,
    lab_members: [
      member("aggrey-lab", 1, "MPhil Student", "Hydrogel formulations for wound healing"),
      member("aggrey-lab", 2, "Research Assistant", "HPLC fingerprinting of marketed herbal products"),
    ],
  },
];
