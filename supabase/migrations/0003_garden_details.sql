-- Plant detail pages and photo credits for the physic garden.
-- Run after 0002_garden.sql. Safe to run more than once.

alter table public.garden_plants add column if not exists slug text;
alter table public.garden_plants add column if not exists photo_credit text not null default '';
alter table public.garden_plants add column if not exists photo_credit_url text not null default '';

update public.garden_plants
set slug = trim(both '-' from lower(regexp_replace(botanical_name, '[^A-Za-z0-9]+', '-', 'g')))
where slug is null or slug = '';

alter table public.garden_plants alter column slug set not null;
create unique index if not exists garden_plants_slug_key on public.garden_plants (slug);

-- Starter photos (freely licensed, from Wikimedia Commons). Only fills plants that have no photo yet.
update public.garden_plants p
set photo_url = v.photo_url, photo_credit = v.credit, photo_credit_url = v.source
from (values
  ('Azadirachta indica', '/garden/azadirachta-indica.jpg', 'Kevinsooryan / CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Azadirachta_indica,_leaves_%26_fruits.JPG'),
  ('Cymbopogon citratus', '/garden/cymbopogon-citratus.jpg', 'Obsidian Soul / CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Cymbopogon_citratus_leaves.jpg'),
  ('Carica papaya', '/garden/carica-papaya.jpg', 'Joydeep / CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Carica_papaya_leaf_14_07_2012.jpg'),
  ('Moringa oleifera', '/garden/moringa-oleifera.jpg', 'Mokkie / CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Drumstick_Tree_(Moringa_oleifera)_4.jpg'),
  ('Momordica charantia', '/garden/momordica-charantia.jpg', 'Joydeep / CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Momordica_charantia_08052014.jpg'),
  ('Vernonia amygdalina', '/garden/vernonia-amygdalina.jpg', 'Forestowlet / CC0', 'https://commons.wikimedia.org/wiki/File:Vernonia_amygdalina_06.jpg'),
  ('Aloe vera', '/garden/aloe-vera.jpg', 'Andikan Efiok Eduok / CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Aloe_vera_plant_in_a_container.jpg'),
  ('Alchornea cordifolia', '/garden/alchornea-cordifolia.jpg', 'Marco Schmidt / CC BY-SA 2.5', 'https://commons.wikimedia.org/wiki/File:Alchornia_cordifolia_MS_3722.jpg'),
  ('Phyllanthus amarus', '/garden/phyllanthus-amarus.jpg', 'Siddarth Machado / CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:Phyllanthus_amarus_75694611.jpg'),
  ('Ocimum gratissimum', '/garden/ocimum-gratissimum.jpg', 'Rison Thumboor / CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Ocimum_gratissimum_(21913853081).jpg'),
  ('Zingiber officinale', '/garden/zingiber-officinale.jpg', 'H. Zell / CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Zingiber_officinale_002.JPG')
) as v(botanical_name, photo_url, credit, source)
where p.botanical_name = v.botanical_name and p.photo_url = '';
