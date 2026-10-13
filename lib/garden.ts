import { isMissingTable } from "./labs";
import { createClient } from "./supabase/server";

export type GardenPlant = {
  id: string;
  slug: string;
  botanical_name: string;
  common_name: string;
  local_names: string;
  family: string;
  category: string;
  parts_used: string[];
  traditional_uses: string[];
  description: string;
  research_notes: string;
  lab_id: string | null;
  photo_url: string;
  photo_credit: string;
  photo_credit_url: string;
  sort_order: number;
  published: boolean;
  lab: { slug: string; name: string } | null;
};

export function plantSlug(botanicalName: string) {
  return botanicalName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Fills fields added by later migrations so the site works whichever migrations have run.
function normalise(plant: Partial<GardenPlant> & { botanical_name: string }): GardenPlant {
  return {
    ...plant,
    slug: plant.slug || plantSlug(plant.botanical_name),
    photo_credit: plant.photo_credit ?? "",
    photo_credit_url: plant.photo_credit_url ?? "",
  } as GardenPlant;
}

export async function getPlants(): Promise<GardenPlant[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("garden_plants")
    .select("*, lab:labs(slug, name)")
    .eq("published", true)
    .order("sort_order")
    .order("botanical_name");
  if (error) {
    if (isMissingTable(error)) return fallbackPlants;
    throw new Error(`Could not load garden plants: ${error.message}`);
  }
  return (data as GardenPlant[]).map(normalise);
}

export async function getPlant(slug: string): Promise<GardenPlant | null> {
  return (await getPlants()).find((plant) => plant.slug === slug) ?? null;
}

// Shown only until supabase/migrations/0002_garden.sql has been run; mirrors its seed rows.
type Seed = [string, string, string, string, string, string[], string[], string, string, [string, string] | null];

// Freely licensed starter photos from Wikimedia Commons: [credit, source page].
const photos: Record<string, [string, string]> = {
  "azadirachta-indica": ["Kevinsooryan / CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Azadirachta_indica,_leaves_%26_fruits.JPG"],
  "cymbopogon-citratus": ["Obsidian Soul / CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Cymbopogon_citratus_leaves.jpg"],
  "carica-papaya": ["Joydeep / CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Carica_papaya_leaf_14_07_2012.jpg"],
  "moringa-oleifera": ["Mokkie / CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Drumstick_Tree_(Moringa_oleifera)_4.jpg"],
  "momordica-charantia": ["Joydeep / CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Momordica_charantia_08052014.jpg"],
  "vernonia-amygdalina": ["Forestowlet / CC0", "https://commons.wikimedia.org/wiki/File:Vernonia_amygdalina_06.jpg"],
  "aloe-vera": ["Andikan Efiok Eduok / CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Aloe_vera_plant_in_a_container.jpg"],
  "alchornea-cordifolia": ["Marco Schmidt / CC BY-SA 2.5", "https://commons.wikimedia.org/wiki/File:Alchornia_cordifolia_MS_3722.jpg"],
  "phyllanthus-amarus": ["Siddarth Machado / CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Phyllanthus_amarus_75694611.jpg"],
  "ocimum-gratissimum": ["Rison Thumboor / CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Ocimum_gratissimum_(21913853081).jpg"],
  "zingiber-officinale": ["H. Zell / CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Zingiber_officinale_002.JPG"],
};

const seeds: Seed[] = [
  ["Cryptolepis sanguinolenta", "Ghana quinine", "Nibima (Twi)", "Apocynaceae", "Antimalarial & fever", ["Root"], ["Malaria", "Fevers", "Urinary infections"],
    "A climbing shrub whose bright yellow-orange roots are a mainstay of Ghanaian herbal antimalarials. Its main alkaloid, cryptolepine, has well-documented antiplasmodial activity.",
    "Alkaloid-rich fractions are being studied for antiplasmodial activity.", ["harley-lab", "Harley Lab"]],
  ["Azadirachta indica", "Neem", "", "Meliaceae", "Antimalarial & fever", ["Leaves", "Stem bark"], ["Malaria", "Fevers", "Skin infections"],
    "A fast-growing, drought-tolerant tree widely planted across West Africa. Leaf decoctions are a common household remedy for fever.", "", null],
  ["Cymbopogon citratus", "Lemongrass", "", "Poaceae", "Antimalarial & fever", ["Leaves"], ["Fevers", "Colds", "Digestive complaints"],
    "An aromatic grass often combined with other herbs in fever teas. Its essential oil is rich in citral.", "", null],
  ["Carica papaya", "Pawpaw", "", "Caricaceae", "Antimalarial & fever", ["Leaves", "Seeds", "Unripe fruit"], ["Malaria", "Intestinal worms", "Wound dressing"],
    "Familiar as a fruit tree, pawpaw is also used medicinally: leaves for fevers, seeds against intestinal worms and latex-rich unripe fruit on wounds.", "", null],
  ["Moringa oleifera", "Moringa", "", "Moringaceae", "Metabolic & nutrition", ["Leaves", "Seeds"], ["Malnutrition", "High blood pressure", "Diabetes"],
    "A nutrient-dense tree whose leaves are eaten as a vegetable and dried as a supplement. Seeds are also used to clarify water.", "", null],
  ["Momordica charantia", "Bitter melon", "", "Cucurbitaceae", "Metabolic & nutrition", ["Leaves", "Fruit"], ["Diabetes", "Malaria", "Skin conditions"],
    "A climbing vine with distinctive warty fruit, widely used in traditional management of high blood sugar.",
    "Included in polyherbal antidiabetic safety studies.", ["jato-lab", "Jato Lab"]],
  ["Vernonia amygdalina", "Bitter leaf", "", "Asteraceae", "Metabolic & nutrition", ["Leaves", "Stems"], ["Diabetes", "Stomach upsets", "Fevers"],
    "A shrub whose bitter leaves are washed and cooked in soups, and chewed or infused as a remedy for stomach complaints and fever.", "", null],
  ["Aloe vera", "Aloe", "", "Asphodelaceae", "Wound & skin", ["Leaf gel"], ["Burns", "Wounds", "Skin irritation"],
    "A succulent whose clear inner leaf gel is applied to burns and wounds for its soothing, moisturising effect.",
    "Standardised gel is being formulated into wound-healing hydrogels.", ["aggrey-lab", "Aggrey Lab"]],
  ["Alchornea cordifolia", "Christmas bush", "", "Euphorbiaceae", "Wound & skin", ["Leaves", "Root"], ["Wounds", "Diarrhoea", "Infections"],
    "A scrambling shrub of forest edges and riverbanks across West and Central Africa, valued for its antimicrobial leaves.", "", null],
  ["Phyllanthus amarus", "Stonebreaker", "", "Phyllanthaceae", "Digestive & liver", ["Whole plant"], ["Liver complaints", "Jaundice", "Kidney stones"],
    "A small herb common in disturbed ground. The whole plant is used in remedies for the liver and urinary tract.", "", null],
  ["Ocimum gratissimum", "African basil", "", "Lamiaceae", "Digestive & liver", ["Leaves"], ["Diarrhoea", "Coughs", "Fevers"],
    "A strongly aromatic shrub used both in cooking and as a remedy for stomach upsets and respiratory complaints.", "", null],
  ["Zingiber officinale", "Ginger", "", "Zingiberaceae", "Digestive & liver", ["Rhizome"], ["Nausea", "Indigestion", "Inflammation"],
    "The pungent rhizome is a common ingredient in herbal preparations for nausea, colds and digestive discomfort.", "", null],
];

const fallbackPlants: GardenPlant[] = seeds.map(
  ([botanical_name, common_name, local_names, family, category, parts_used, traditional_uses, description, research_notes, lab], i) => {
    const slug = plantSlug(botanical_name);
    const photo = photos[slug];
    return {
    id: `plant-${i + 1}`,
    slug,
    botanical_name,
    common_name,
    local_names,
    family,
    category,
    parts_used,
    traditional_uses,
    description,
    research_notes,
    lab_id: lab?.[0] ?? null,
    photo_url: photo ? `/garden/${slug}.jpg` : "",
    photo_credit: photo?.[0] ?? "",
    photo_credit_url: photo?.[1] ?? "",
    sort_order: i + 1,
    published: true,
    lab: lab ? { slug: lab[0], name: lab[1] } : null,
    };
  },
);
