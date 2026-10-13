-- Physic garden plant catalogue.
-- Run after 0001_labs.sql, in the Supabase dashboard → SQL Editor.

create table if not exists public.garden_plants (
  id uuid primary key default gen_random_uuid(),
  botanical_name text not null,
  common_name text not null default '',
  local_names text not null default '',
  family text not null default '',
  category text not null default '',
  parts_used text[] not null default '{}',
  traditional_uses text[] not null default '{}',
  description text not null default '',
  research_notes text not null default '',
  lab_id uuid references public.labs (id) on delete set null,
  photo_url text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists garden_plants_sort_idx on public.garden_plants (sort_order, botanical_name);

drop trigger if exists garden_plants_touch_updated_at on public.garden_plants;
create trigger garden_plants_touch_updated_at before update on public.garden_plants
  for each row execute function public.touch_updated_at();

alter table public.garden_plants enable row level security;

drop policy if exists "Public can read published plants" on public.garden_plants;
create policy "Public can read published plants" on public.garden_plants
  for select using (published or auth.role() = 'authenticated');

drop policy if exists "Admins manage plants" on public.garden_plants;
create policy "Admins manage plants" on public.garden_plants
  for all to authenticated using (true) with check (true);

-- Starter catalogue of well-known West African medicinal plants.
-- Replace with the species actually growing in the garden from /admin/garden.
insert into public.garden_plants (botanical_name, common_name, local_names, family, category, parts_used, traditional_uses, description, research_notes, lab_id, sort_order)
select p.botanical_name, p.common_name, p.local_names, p.family, p.category, p.parts_used, p.traditional_uses, p.description, p.research_notes,
       (select id from public.labs where slug = p.lab_slug), p.sort_order
from (values
  ('Cryptolepis sanguinolenta', 'Ghana quinine', 'Nibima (Twi)', 'Apocynaceae', 'Antimalarial & fever',
   array['Root'], array['Malaria', 'Fevers', 'Urinary infections'],
   'A climbing shrub whose bright yellow-orange roots are a mainstay of Ghanaian herbal antimalarials. Its main alkaloid, cryptolepine, has well-documented antiplasmodial activity.',
   'Alkaloid-rich fractions are being studied for antiplasmodial activity.', 'harley-lab', 1),
  ('Azadirachta indica', 'Neem', '', 'Meliaceae', 'Antimalarial & fever',
   array['Leaves', 'Stem bark'], array['Malaria', 'Fevers', 'Skin infections'],
   'A fast-growing, drought-tolerant tree widely planted across West Africa. Leaf decoctions are a common household remedy for fever.',
   '', null, 2),
  ('Cymbopogon citratus', 'Lemongrass', '', 'Poaceae', 'Antimalarial & fever',
   array['Leaves'], array['Fevers', 'Colds', 'Digestive complaints'],
   'An aromatic grass often combined with other herbs in fever teas. Its essential oil is rich in citral.',
   '', null, 3),
  ('Carica papaya', 'Pawpaw', '', 'Caricaceae', 'Antimalarial & fever',
   array['Leaves', 'Seeds', 'Unripe fruit'], array['Malaria', 'Intestinal worms', 'Wound dressing'],
   'Familiar as a fruit tree, pawpaw is also used medicinally: leaves for fevers, seeds against intestinal worms and latex-rich unripe fruit on wounds.',
   '', null, 4),
  ('Moringa oleifera', 'Moringa', '', 'Moringaceae', 'Metabolic & nutrition',
   array['Leaves', 'Seeds'], array['Malnutrition', 'High blood pressure', 'Diabetes'],
   'A nutrient-dense tree whose leaves are eaten as a vegetable and dried as a supplement. Seeds are also used to clarify water.',
   '', null, 5),
  ('Momordica charantia', 'Bitter melon', '', 'Cucurbitaceae', 'Metabolic & nutrition',
   array['Leaves', 'Fruit'], array['Diabetes', 'Malaria', 'Skin conditions'],
   'A climbing vine with distinctive warty fruit, widely used in traditional management of high blood sugar.',
   'Included in polyherbal antidiabetic safety studies.', 'jato-lab', 6),
  ('Vernonia amygdalina', 'Bitter leaf', '', 'Asteraceae', 'Metabolic & nutrition',
   array['Leaves', 'Stems'], array['Diabetes', 'Stomach upsets', 'Fevers'],
   'A shrub whose bitter leaves are washed and cooked in soups, and chewed or infused as a remedy for stomach complaints and fever.',
   '', null, 7),
  ('Aloe vera', 'Aloe', '', 'Asphodelaceae', 'Wound & skin',
   array['Leaf gel'], array['Burns', 'Wounds', 'Skin irritation'],
   'A succulent whose clear inner leaf gel is applied to burns and wounds for its soothing, moisturising effect.',
   'Standardised gel is being formulated into wound-healing hydrogels.', 'aggrey-lab', 8),
  ('Alchornea cordifolia', 'Christmas bush', '', 'Euphorbiaceae', 'Wound & skin',
   array['Leaves', 'Root'], array['Wounds', 'Diarrhoea', 'Infections'],
   'A scrambling shrub of forest edges and riverbanks across West and Central Africa, valued for its antimicrobial leaves.',
   '', null, 9),
  ('Phyllanthus amarus', 'Stonebreaker', '', 'Phyllanthaceae', 'Digestive & liver',
   array['Whole plant'], array['Liver complaints', 'Jaundice', 'Kidney stones'],
   'A small herb common in disturbed ground. The whole plant is used in remedies for the liver and urinary tract.',
   '', null, 10),
  ('Ocimum gratissimum', 'African basil', '', 'Lamiaceae', 'Digestive & liver',
   array['Leaves'], array['Diarrhoea', 'Coughs', 'Fevers'],
   'A strongly aromatic shrub used both in cooking and as a remedy for stomach upsets and respiratory complaints.',
   '', null, 11),
  ('Zingiber officinale', 'Ginger', '', 'Zingiberaceae', 'Digestive & liver',
   array['Rhizome'], array['Nausea', 'Indigestion', 'Inflammation'],
   'The pungent rhizome is a common ingredient in herbal preparations for nausea, colds and digestive discomfort.',
   '', null, 12)
) as p(botanical_name, common_name, local_names, family, category, parts_used, traditional_uses, description, research_notes, lab_slug, sort_order)
where not exists (select 1 from public.garden_plants);
