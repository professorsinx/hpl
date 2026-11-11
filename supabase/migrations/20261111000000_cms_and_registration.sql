-- HPL 2027 · CMS, admin access and public registration
-- ---------------------------------------------------------------------------
-- Run once in the Supabase SQL editor (or `supabase db push`). Safe to re-run:
-- every statement is idempotent.
--
-- What this sets up
--   1. admins            – allow-list of auth users who may use /admin
--   2. sponsors          – sponsor directory managed from /admin/sponsors
--   3. media_items       – event photos and videos managed from /admin/media
--   4. teams / players   – hardened for public registration (insert-only for
--                          visitors, full access for admins)
--   5. storage buckets   – sponsor-logos, event-media, hospital-logos
-- ---------------------------------------------------------------------------

-- 1. Admin allow-list -------------------------------------------------------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.admins enable row level security;

-- SECURITY DEFINER so policies on other tables can consult the allow-list
-- without granting anyone read access to it.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "Admins can read their own membership" on public.admins;
create policy "Admins can read their own membership"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

-- Shared trigger to keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- 2. Sponsors ---------------------------------------------------------------

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  tier text not null default 'supporter'
    check (tier in ('title', 'associate', 'category', 'supporter')),
  tagline text check (tagline is null or char_length(tagline) <= 160),
  description text not null default '' check (char_length(description) <= 4000),
  website_url text check (website_url is null or website_url ~* '^https?://'),
  logo_path text,
  sort_order integer not null default 0,
  is_published boolean not null default true
);

create index if not exists sponsors_listing_idx
  on public.sponsors (is_published, sort_order, created_at);

drop trigger if exists sponsors_touch_updated_at on public.sponsors;
create trigger sponsors_touch_updated_at
  before update on public.sponsors
  for each row execute function public.touch_updated_at();

alter table public.sponsors enable row level security;

drop policy if exists "Published sponsors are public" on public.sponsors;
create policy "Published sponsors are public"
  on public.sponsors for select to anon, authenticated
  using (is_published or (select public.is_admin()));

drop policy if exists "Admins manage sponsors" on public.sponsors;
create policy "Admins manage sponsors"
  on public.sponsors for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- 3. Event media ------------------------------------------------------------

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  kind text not null check (kind in ('photo', 'video')),
  source text not null default 'upload' check (source in ('upload', 'youtube')),
  storage_path text,
  youtube_id text check (youtube_id is null or youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  title text check (title is null or char_length(title) <= 140),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  sort_order integer not null default 0,
  is_published boolean not null default true,
  constraint media_items_source_matches check (
    (source = 'upload' and storage_path is not null and youtube_id is null)
    or (source = 'youtube' and kind = 'video' and youtube_id is not null and storage_path is null)
  )
);

create index if not exists media_items_listing_idx
  on public.media_items (is_published, sort_order, created_at desc);

alter table public.media_items enable row level security;

drop policy if exists "Published media is public" on public.media_items;
create policy "Published media is public"
  on public.media_items for select to anon, authenticated
  using (is_published or (select public.is_admin()));

drop policy if exists "Admins manage media" on public.media_items;
create policy "Admins manage media"
  on public.media_items for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- 4. Team registration ------------------------------------------------------

alter table public.teams add column if not exists hospital_logo_path text;
alter table public.teams add column if not exists admin_notes text;

-- One payment reference can only back one registration.
create unique index if not exists teams_payment_utr_key on public.teams (payment_utr);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'teams_payment_utr_format') then
    alter table public.teams
      add constraint teams_payment_utr_format check (payment_utr ~ '^[0-9]{12}$') not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'teams_captain_phone_format') then
    alter table public.teams
      add constraint teams_captain_phone_format check (captain_phone ~ '^[6-9][0-9]{9}$') not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'teams_text_lengths') then
    alter table public.teams
      add constraint teams_text_lengths check (
        char_length(team_name) between 2 and 80
        and char_length(hospital_name) between 2 and 140
        and char_length(captain_name) between 2 and 80
        and char_length(vice_captain_name) between 2 and 80
        and char_length(captain_email) <= 160
        and (hospital_address is null or char_length(hospital_address) <= 300)
      ) not valid;
  end if;
end $$;

alter table public.teams enable row level security;
alter table public.players enable row level security;

-- Visitors may submit a registration but can never read one back, and cannot
-- pre-approve themselves: status columns must carry their defaults.
drop policy if exists "Anyone can submit a team registration" on public.teams;
create policy "Anyone can submit a team registration"
  on public.teams for insert to anon, authenticated
  with check (
    registration_status = 'pending_verification'
    and payment_status = 'submitted'
    and entry_fee_amount = 10000
    and admin_notes is null
  );

drop policy if exists "Admins manage teams" on public.teams;
create policy "Admins manage teams"
  on public.teams for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins manage players" on public.players;
create policy "Admins manage players"
  on public.players for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- 5. Storage ----------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('sponsor-logos', 'sponsor-logos', true, 2097152,
    array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('event-media', 'event-media', true, 52428800,
    array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']),
  ('hospital-logos', 'hospital-logos', true, 2097152,
    array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins manage CMS files" on storage.objects;
create policy "Admins manage CMS files"
  on storage.objects for all to authenticated
  using (
    bucket_id in ('sponsor-logos', 'event-media', 'hospital-logos')
    and (select public.is_admin())
  )
  with check (
    bucket_id in ('sponsor-logos', 'event-media', 'hospital-logos')
    and (select public.is_admin())
  );

-- Registrants attach their hospital logo while signing up. Upload only: the
-- bucket's size and MIME limits above are enforced by Storage itself.
drop policy if exists "Registrants can upload a hospital logo" on storage.objects;
create policy "Registrants can upload a hospital logo"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'hospital-logos');

-- ---------------------------------------------------------------------------
-- After running this file, grant yourself admin access:
--
--   1. Supabase dashboard → Authentication → Users → "Add user"
--      (email + password, tick "Auto confirm user").
--   2. Run, with your email:
--
--        insert into public.admins (user_id)
--        select id from auth.users where email = 'you@example.com'
--        on conflict do nothing;
--
--   3. Authentication → Sign In / Providers → turn OFF "Allow new users to
--      sign up". Admin accounts are created by invitation only.
-- ---------------------------------------------------------------------------
