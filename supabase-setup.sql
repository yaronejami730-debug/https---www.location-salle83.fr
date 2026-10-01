-- Domaine de la Bégude — schema setup
-- Run this once in the Supabase SQL editor (SQL Editor > New query)

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null check (event_type in ('mariage', 'seminaire', 'reception', 'autre')),
  event_date date,
  guest_count integer,
  full_name text not null,
  phone text not null,
  email text not null,
  message text,
  status text not null default 'nouveau' check (status in ('nouveau', 'contacte', 'converti', 'perdu')),
  brevo_synced boolean not null default false,
  pricing_bracket text,
  option_lendemain boolean not null default false,
  option_piscine boolean not null default false,
  option_vaisselle boolean not null default false,
  option_cuisine boolean not null default false,
  option_chapiteau_count integer not null default 0,
  estimated_total integer
);

create table public.pages (
  slug text primary key,
  hero_title text,
  hero_description text,
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  page text not null default 'home',
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  rating integer not null check (rating between 1 and 5),
  text text not null,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  alt text,
  page text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.pages enable row level security;
alter table public.faqs enable row level security;
alter table public.reviews enable row level security;
alter table public.media enable row level security;

create policy "public read pages" on public.pages for select to anon using (true);
create policy "public read faqs" on public.faqs for select to anon using (published = true);
create policy "public read reviews" on public.reviews for select to anon using (published = true);
create policy "public read media" on public.media for select to anon using (true);

create policy "service role full access leads" on public.leads for all to service_role using (true) with check (true);
create policy "service role full access pages" on public.pages for all to service_role using (true) with check (true);
create policy "service role full access faqs" on public.faqs for all to service_role using (true) with check (true);
create policy "service role full access reviews" on public.reviews for all to service_role using (true) with check (true);
create policy "service role full access media" on public.media for all to service_role using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media bucket" on storage.objects
  for select to anon
  using (bucket_id = 'media');

create policy "service role manage media bucket" on storage.objects
  for all to service_role
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

-- Lot 2: editable pricing grid (grille tarifaire) — run this block to add it.
create table public.pricing_brackets (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  label text not null,
  max_guests integer not null,
  salle integer not null default 0,
  lendemain integer not null default 0,
  piscine integer not null default 0,
  vaisselle integer not null default 0,
  cuisine integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.pricing_brackets enable row level security;

create policy "public read pricing_brackets" on public.pricing_brackets for select to anon using (true);
create policy "service role full access pricing_brackets" on public.pricing_brackets for all to service_role using (true) with check (true);

insert into public.pricing_brackets (key, label, max_guests, salle, lendemain, piscine, vaisselle, cuisine, sort_order) values
('40', '-40 pers.', 40, 1700, 250, 150, 110, 200, 0),
('50', '-50 pers.', 50, 1800, 250, 150, 110, 200, 1),
('65', '-65 pers.', 65, 1950, 300, 200, 120, 230, 2),
('80', '-80 pers.', 80, 2100, 350, 250, 130, 250, 3),
('95', '-95 pers.', 95, 2250, 400, 300, 140, 270, 4),
('110', '-110 pers.', 110, 2400, 450, 350, 150, 290, 5);

-- Lot 8: Blog module — run this block to add it.
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null default '',
  color text not null default '#8a6d3b',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "public read published blog_posts" on public.blog_posts for select to anon using (published = true);
create policy "service role full access blog_posts" on public.blog_posts for all to service_role using (true) with check (true);
