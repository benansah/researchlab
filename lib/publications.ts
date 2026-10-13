import { isMissingTable } from "./labs";
import { createClient } from "./supabase/server";

export type Publication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number | null;
  tag: string;
  abstract: string;
  doi_url: string;
  pdf_url: string;
  lab_id: string | null;
  featured: boolean;
  published: boolean;
  lab: { slug: string; name: string } | null;
};

export async function getPublications(): Promise<Publication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("*, lab:labs(slug, name)")
    .eq("published", true)
    .order("year", { ascending: false, nullsFirst: false })
    .order("title");
  if (error) {
    if (isMissingTable(error)) return fallbackPublications;
    throw new Error(`Could not load publications: ${error.message}`);
  }
  return data as Publication[];
}

// Featured papers first, then the most recent, for short lists like the home page.
export function featured(publications: Publication[], count: number) {
  return [...publications].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, count);
}

// Shown only until supabase/migrations/0004_publications_news.sql has been run; mirrors its seed rows.
type Seed = [string, string, string, number, string, [string, string]];

const seeds: Seed[] = [
  ["Antiplasmodial activity of alkaloid-rich fractions from Cryptolepis sanguinolenta root bark", "A. Mensah, K. Boateng, E. Owusu", "Journal of Ethnopharmacology", 2025, "Pharmacology", ["harley-lab", "Harley Lab"]],
  ["HPLC fingerprinting and quality standards for commercial herbal antimalarials in the Volta Region", "E. Owusu, P. Agbeko, A. Mensah", "Phytochemical Analysis", 2025, "Quality Control", ["aggrey-lab", "Aggrey Lab"]],
  ["Wound-healing hydrogel incorporating standardised Aloe and Moringa extracts", "S. Asante, K. Boateng", "International Journal of Pharmaceutics", 2024, "Formulation", ["aggrey-lab", "Aggrey Lab"]],
  ["Ethnobotanical survey of medicinal plants used for metabolic disorders in the Ho Municipality", "P. Agbeko, S. Asante, E. Owusu", "Frontiers in Pharmacology", 2024, "Ethnobotany", ["jato-lab", "Jato Lab"]],
];

const fallbackPublications: Publication[] = seeds.map(([title, authors, venue, year, tag, [labSlug, labName]], i) => ({
  id: `publication-${i + 1}`,
  title,
  authors,
  venue,
  year,
  tag,
  abstract: "",
  doi_url: "",
  pdf_url: "",
  lab_id: labSlug,
  featured: true,
  published: true,
  lab: { slug: labSlug, name: labName },
}));
