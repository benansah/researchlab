-- Labs and lab members.
-- Run this once in the Supabase dashboard → SQL Editor (or with `supabase db push`).

create table if not exists public.labs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  tagline text not null default '',
  objective text not null default '',
  summary text not null default '',
  aims text[] not null default '{}',
  research_areas text[] not null default '{}',
  techniques text[] not null default '{}',
  lead_name text not null default '',
  lead_title text not null default '',
  lead_bio text not null default '',
  lead_email text not null default '',
  lead_photo_url text not null default '',
  contact_email text not null default '',
  location text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lab_members (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.labs (id) on delete cascade,
  name text not null,
  role text not null default '',
  research_topic text not null default '',
  email text not null default '',
  photo_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists lab_members_lab_id_idx on public.lab_members (lab_id, sort_order);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists labs_touch_updated_at on public.labs;
create trigger labs_touch_updated_at before update on public.labs
  for each row execute function public.touch_updated_at();

-- Row level security: anyone can read published labs; signed-in admins can do everything.
alter table public.labs enable row level security;
alter table public.lab_members enable row level security;

drop policy if exists "Public can read published labs" on public.labs;
create policy "Public can read published labs" on public.labs
  for select using (published or auth.role() = 'authenticated');

drop policy if exists "Admins manage labs" on public.labs;
create policy "Admins manage labs" on public.labs
  for all to authenticated using (true) with check (true);

drop policy if exists "Public can read members of published labs" on public.lab_members;
create policy "Public can read members of published labs" on public.lab_members
  for select using (
    exists (select 1 from public.labs l where l.id = lab_id and (l.published or auth.role() = 'authenticated'))
  );

drop policy if exists "Admins manage lab members" on public.lab_members;
create policy "Admins manage lab members" on public.lab_members
  for all to authenticated using (true) with check (true);

-- Starter content. Everything here is placeholder copy — edit it from /admin/lab-profiles.
insert into public.labs (slug, name, tagline, objective, summary, aims, research_areas, techniques, lead_name, lead_title, lead_bio, location, sort_order)
values
(
  'harley-lab',
  'Harley Lab',
  'Bioactive natural products for infectious disease',
  'To discover and characterise plant-derived compounds that can become safe, affordable treatments for malaria and drug-resistant infections.',
  'The Harley Lab combines ethnobotanical leads with bioassay-guided fractionation to isolate the molecules responsible for a plant''s traditional use, then tests them against clinically relevant pathogens.',
  array[
    'Screen traditionally used medicinal plants for antiplasmodial and antimicrobial activity',
    'Isolate and elucidate the structures of the most active constituents',
    'Establish mechanisms of action and resistance profiles for lead compounds'
  ],
  array['Antimalarial discovery', 'Antimicrobial resistance', 'Phytochemistry'],
  array['Bioassay-guided fractionation', 'HPLC & LC-MS', 'NMR structure elucidation', 'In vitro parasite culture'],
  'Dr. Harley', 'Lab Lead · Senior Lecturer, Pharmacognosy',
  'Leads the Centre''s work on anti-infective natural products and supervises graduate research in pharmacognosy.',
  'School of Pharmacy, Block B', 1
),
(
  'jato-lab',
  'Jato Lab',
  'Pharmacology and safety of herbal medicines',
  'To generate the pharmacological and toxicological evidence that herbal medicines need to be used safely and registered with confidence.',
  'The Jato Lab studies how standardised extracts act in the body — from efficacy models for inflammation and metabolic disease to the toxicology studies regulators require.',
  array[
    'Evaluate efficacy of herbal preparations in validated in vitro and in vivo models',
    'Conduct acute and sub-chronic toxicity studies to define safe dosing',
    'Investigate herb–drug interactions relevant to local prescribing'
  ],
  array['Pharmacology', 'Toxicology', 'Metabolic & inflammatory disease'],
  array['Cell-based assays', 'Animal efficacy models', 'Histopathology', 'Biochemical analysis'],
  'Dr. Jato', 'Lab Lead · Lecturer, Pharmacology & Toxicology',
  'Directs pharmacology and safety studies across the Centre and collaborates with clinicians on translational work.',
  'School of Pharmacy, Block B', 2
),
(
  'aggrey-lab',
  'Aggrey Lab',
  'Formulation and quality of phytomedicines',
  'To turn promising plant extracts into stable, standardised medicines that meet pharmaceutical quality standards.',
  'The Aggrey Lab works where discovery meets manufacturing: developing dosage forms, setting quality specifications and helping local producers deliver consistent herbal products.',
  array[
    'Develop and optimise dosage forms for standardised herbal extracts',
    'Establish chemical fingerprints and quality specifications for marketed products',
    'Partner with local manufacturers to improve product quality and stability'
  ],
  array['Pharmaceutics', 'Quality control', 'Product development'],
  array['Pre-formulation studies', 'Stability testing', 'HPLC fingerprinting', 'Dissolution testing'],
  'Dr. Aggrey', 'Lab Lead · Lecturer, Pharmaceutics',
  'Leads formulation and quality-control research and the Centre''s partnerships with industry.',
  'School of Pharmacy, Block C', 3
)
on conflict (slug) do nothing;

insert into public.lab_members (lab_id, name, role, research_topic, sort_order)
select l.id, m.name, m.role, m.topic, m.ord
from public.labs l
join (values
  ('harley-lab', 'Student Name', 'PhD Candidate', 'Antiplasmodial alkaloids from Cryptolepis species', 1),
  ('harley-lab', 'Student Name', 'MPhil Student', 'Antibacterial activity of Volta Region medicinal plants', 2),
  ('harley-lab', 'Student Name', 'Research Assistant', 'Extraction and compound library management', 3),
  ('jato-lab', 'Student Name', 'PhD Candidate', 'Hepatoprotective effects of standardised extracts', 1),
  ('jato-lab', 'Student Name', 'MPhil Student', 'Sub-chronic toxicity of a polyherbal antidiabetic', 2),
  ('aggrey-lab', 'Student Name', 'MPhil Student', 'Hydrogel formulations for wound healing', 1),
  ('aggrey-lab', 'Student Name', 'Research Assistant', 'HPLC fingerprinting of marketed herbal products', 2)
) as m(slug, name, role, topic, ord) on m.slug = l.slug
where not exists (select 1 from public.lab_members x where x.lab_id = l.id);
