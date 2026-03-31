-- Supabase Database Schema for ContentShift
-- Run this in the Supabase SQL editor

-- Usage tracking table
create table if not exists usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  count integer not null default 0,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Subscriptions table
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  plan text not null check (plan in ('starter', 'pro')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  payment_key text,
  order_id text,
  amount integer,
  started_at timestamptz default now(),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table usage enable row level security;
alter table subscriptions enable row level security;

-- Users can read their own usage
create policy "Users can read own usage" on usage
  for select using (auth.uid() = user_id);

-- Users can read their own subscription
create policy "Users can read own subscription" on subscriptions
  for select using (auth.uid() = user_id);

-- Service role can do everything (for API routes)
-- No policy needed - service role bypasses RLS

-- Index for fast usage lookups
create index if not exists idx_usage_user_date on usage(user_id, date);
create index if not exists idx_subscriptions_user on subscriptions(user_id);
