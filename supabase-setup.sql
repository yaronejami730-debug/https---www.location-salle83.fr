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
