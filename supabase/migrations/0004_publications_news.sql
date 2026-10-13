-- Publications and news/events.
-- Run after 0003_garden_details.sql, in the Supabase dashboard → SQL Editor. Safe to run more than once.

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text not null default '',
  venue text not null default '',
  year integer,
  tag text not null default '',
  abstract text not null default '',
  doi_url text not null default '',
  pdf_url text not null default '',
  lab_id uuid references public.labs (id) on delete set null,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Some projects already have an older publications table (id, title, authors, year, doi, created_at).
-- Bring it up to the shape above instead of skipping it.
alter table public.publications add column if not exists authors text not null default '';
alter table public.publications add column if not exists venue text not null default '';
alter table public.publications add column if not exists year integer;
alter table public.publications add column if not exists tag text not null default '';
alter table public.publications add column if not exists abstract text not null default '';
alter table public.publications add column if not exists doi_url text not null default '';
alter table public.publications add column if not exists pdf_url text not null default '';
alter table public.publications add column if not exists lab_id uuid references public.labs (id) on delete set null;
alter table public.publications add column if not exists featured boolean not null default false;
alter table public.publications add column if not exists published boolean not null default true;
alter table public.publications add column if not exists created_at timestamptz not null default now();
alter table public.publications add column if not exists updated_at timestamptz not null default now();

do $$
declare
  col record;
  pol record;
begin
  -- The site stores authors as one comma-separated string and the year as a number.
  select data_type into col from information_schema.columns
    where table_schema = 'public' and table_name = 'publications' and column_name = 'authors';
  if col.data_type = 'ARRAY' then
    alter table public.publications alter column authors drop default;
    alter table public.publications alter column authors type text using coalesce(array_to_string(authors, ', '), '');
    alter table public.publications alter column authors set default '';
  end if;
  update public.publications set authors = '' where authors is null;
  alter table public.publications alter column authors set not null;

  select data_type into col from information_schema.columns
    where table_schema = 'public' and table_name = 'publications' and column_name = 'year';
  if col.data_type <> 'integer' then
    alter table public.publications alter column year type integer
      using nullif(substring(year::text from '\d{4}'), '')::integer;
  end if;

  -- Carry over links from the old doi column.
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'publications' and column_name = 'doi') then
    execute $q$
      update public.publications
      set doi_url = case when doi ~ '^10\.\d{4,}/' then 'https://doi.org/' || doi else doi end
      where doi_url = '' and coalesce(doi, '') <> ''
    $q$;
  end if;

  -- Replace any policies left from the old table so drafts can't be read publicly.
  for pol in select policyname from pg_policies where schemaname = 'public' and tablename = 'publications'
             and policyname not in ('Public can read published publications', 'Admins manage publications') loop
    execute format('drop policy %I on public.publications', pol.policyname);
  end loop;
end;
$$;

create index if not exists publications_year_idx on public.publications (year desc nulls last, title);

drop trigger if exists publications_touch_updated_at on public.publications;
create trigger publications_touch_updated_at before update on public.publications
  for each row execute function public.touch_updated_at();

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  kind text not null default 'news' check (kind in ('news', 'event')),
  title text not null,
  summary text not null default '',
  body text not null default '',
  -- For news, the publication date; for events, the day the event takes place.
  date date not null default current_date,
  location text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_posts_date_idx on public.news_posts (date desc);

drop trigger if exists news_posts_touch_updated_at on public.news_posts;
create trigger news_posts_touch_updated_at before update on public.news_posts
  for each row execute function public.touch_updated_at();

alter table public.publications enable row level security;
alter table public.news_posts enable row level security;

drop policy if exists "Public can read published publications" on public.publications;
create policy "Public can read published publications" on public.publications
  for select using (published or auth.role() = 'authenticated');

drop policy if exists "Admins manage publications" on public.publications;
create policy "Admins manage publications" on public.publications
  for all to authenticated using (true) with check (true);

drop policy if exists "Public can read published news" on public.news_posts;
create policy "Public can read published news" on public.news_posts
  for select using (published or auth.role() = 'authenticated');

drop policy if exists "Admins manage news" on public.news_posts;
create policy "Admins manage news" on public.news_posts
  for all to authenticated using (true) with check (true);

-- Starter content. Everything here is placeholder copy — replace it from /admin/publications and /admin/news.
insert into public.publications (title, authors, venue, year, tag, lab_id, featured)
select p.title, p.authors, p.venue, p.year, p.tag, (select id from public.labs where slug = p.lab_slug), true
from (values
  ('Antiplasmodial activity of alkaloid-rich fractions from Cryptolepis sanguinolenta root bark', 'A. Mensah, K. Boateng, E. Owusu', 'Journal of Ethnopharmacology', 2025, 'Pharmacology', 'harley-lab'),
  ('HPLC fingerprinting and quality standards for commercial herbal antimalarials in the Volta Region', 'E. Owusu, P. Agbeko, A. Mensah', 'Phytochemical Analysis', 2025, 'Quality Control', 'aggrey-lab'),
  ('Wound-healing hydrogel incorporating standardised Aloe and Moringa extracts', 'S. Asante, K. Boateng', 'International Journal of Pharmaceutics', 2024, 'Formulation', 'aggrey-lab'),
  ('Ethnobotanical survey of medicinal plants used for metabolic disorders in the Ho Municipality', 'P. Agbeko, S. Asante, E. Owusu', 'Frontiers in Pharmacology', 2024, 'Ethnobotany', 'jato-lab')
) as p(title, authors, venue, year, tag, lab_slug)
where not exists (select 1 from public.publications);

insert into public.news_posts (slug, kind, title, summary, date, location)
select n.slug, n.kind, n.title, n.summary, n.date::date, n.location
from (values
  ('physic-garden-expands', 'news', 'Physic Garden expands with 30 new indigenous medicinal species',
   'The garden now serves as a living reference collection for teaching and authentication.', '2026-09-01', ''),
  ('phytomedicine-research-symposium-2026', 'event', 'Annual Phytomedicine Research Symposium',
   'Researchers, practitioners and regulators meet to discuss evidence for traditional medicines.', '2026-11-14', 'School of Pharmacy, UHAS, Ho'),
  ('regional-manufacturer-partnership', 'news', 'Centre partners with regional manufacturers on standardised herbal products',
   'A new collaboration brings laboratory quality control to local production lines.', '2026-08-01', '')
) as n(slug, kind, title, summary, date, location)
where not exists (select 1 from public.news_posts);
