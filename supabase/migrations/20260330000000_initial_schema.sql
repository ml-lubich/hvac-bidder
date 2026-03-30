-- HVAC BidPro — Initial Schema
-- Tables: profiles, bids, bid_items

-- ============================================================
-- 1. Profiles (extends Supabase auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  company_name text not null default '',
  company_phone text not null default '',
  company_email text not null default '',
  company_license text not null default '',
  company_address text not null default '',
  default_terms text not null default 'Payment due within 30 days of project completion. 1-year warranty on all labor. Equipment warranty per manufacturer terms. Price valid for 30 days from bid date. Any changes to scope of work may result in additional charges.',
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 2. Bids
-- ============================================================
create table if not exists public.bids (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  client_name text not null,
  client_address text not null default '',
  client_phone text not null default '',
  client_email text not null default '',
  job_type text not null check (job_type in ('residential', 'commercial')),
  service_type text[] not null default '{}',
  system_type text not null,
  square_footage integer not null default 0,
  location text not null default '',
  notes text not null default '',
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  total_amount integer not null default 0,
  labor_hours numeric(6,1) not null default 0,
  labor_rate integer not null default 0,
  company_name text not null default '',
  company_phone text not null default '',
  company_email text not null default '',
  company_license text not null default '',
  valid_until date not null default (current_date + interval '30 days'),
  terms text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 3. Bid Items (line items for a bid)
-- ============================================================
create table if not exists public.bid_items (
  id text primary key,
  bid_id text not null references public.bids(id) on delete cascade,
  category text not null check (category in ('equipment', 'materials', 'labor', 'other')),
  description text not null,
  quantity integer not null default 1,
  unit_price integer not null default 0,
  total integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_bids_user_id on public.bids(user_id);
create index if not exists idx_bids_status on public.bids(status);
create index if not exists idx_bids_created_at on public.bids(created_at desc);
create index if not exists idx_bid_items_bid_id on public.bid_items(bid_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.bids enable row level security;
alter table public.bid_items enable row level security;

-- Drop existing policies to make migration idempotent
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can view own bids" on public.bids;
drop policy if exists "Users can insert own bids" on public.bids;
drop policy if exists "Users can update own bids" on public.bids;
drop policy if exists "Users can delete own bids" on public.bids;
drop policy if exists "Users can view own bid items" on public.bid_items;
drop policy if exists "Users can insert own bid items" on public.bid_items;
drop policy if exists "Users can update own bid items" on public.bid_items;
drop policy if exists "Users can delete own bid items" on public.bid_items;

-- Profiles: users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Bids: users can CRUD their own bids
create policy "Users can view own bids"
  on public.bids for select using (auth.uid() = user_id);
create policy "Users can insert own bids"
  on public.bids for insert with check (auth.uid() = user_id);
create policy "Users can update own bids"
  on public.bids for update using (auth.uid() = user_id);
create policy "Users can delete own bids"
  on public.bids for delete using (auth.uid() = user_id);

-- Bid Items: access through parent bid ownership
create policy "Users can view own bid items"
  on public.bid_items for select
  using (exists (select 1 from public.bids where bids.id = bid_items.bid_id and bids.user_id = auth.uid()));
create policy "Users can insert own bid items"
  on public.bid_items for insert
  with check (exists (select 1 from public.bids where bids.id = bid_items.bid_id and bids.user_id = auth.uid()));
create policy "Users can update own bid items"
  on public.bid_items for update
  using (exists (select 1 from public.bids where bids.id = bid_items.bid_id and bids.user_id = auth.uid()));
create policy "Users can delete own bid items"
  on public.bid_items for delete
  using (exists (select 1 from public.bids where bids.id = bid_items.bid_id and bids.user_id = auth.uid()));

-- ============================================================
-- Auto-create profile on signup trigger
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, company_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop if exists to be idempotent
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Updated_at auto-update triggers
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger bids_updated_at
  before update on public.bids
  for each row execute procedure public.update_updated_at();
