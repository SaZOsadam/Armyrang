-- ============================================================
-- Armyrang — Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  role text not null default 'observer' check (role in ('observer', 'analyst', 'admin')),
  correct_predictions integer not null default 0,
  total_predictions integer not null default 0,
  created_at timestamptz not null default now()
);

-- Predictions table
create table if not exists predictions (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null check (category in ('Market Analysis', 'Body Language', 'Soft Conspiracy', 'Cultural Trends', 'Entertainment')),
  member text default 'Group',
  status text not null default 'active' check (status in ('active', 'resolved_correct', 'resolved_incorrect', 'pending')),
  confidence_avg numeric not null default 0,
  vote_count integer not null default 0,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- News articles table
create table if not exists news (
  id uuid default gen_random_uuid() primary key,
  source text not null,
  source_url text,
  title text not null,
  excerpt text,
  url text,
  youtube_id text,
  category text not null default 'News',
  featured boolean not null default false,
  published_at timestamptz not null default now(),
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

-- Events table
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date date not null,
  event_time text,
  type text not null default 'announcement' check (type in ('release', 'media', 'live', 'announcement', 'tour')),
  url text,
  confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Votes table
create table if not exists votes (
  id uuid default gen_random_uuid() primary key,
  prediction_id uuid references predictions(id) on delete cascade not null,
  voter_id uuid references profiles(id) on delete cascade not null,
  confidence integer not null check (confidence >= 1 and confidence <= 100),
  created_at timestamptz not null default now(),
  unique(prediction_id, voter_id)
);

-- Comments table
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  prediction_id uuid references predictions(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Notifications table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null check (type in ('vote_received', 'prediction_resolved', 'new_comment')),
  title text not null,
  body text,
  prediction_id uuid references predictions(id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Functions & Triggers
-- ============================================================

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username, display_name, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''), split_part(new.email, '@', 1)),
    coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'), ''), split_part(new.email, '@', 1)),
    coalesce(nullif(new.raw_user_meta_data->>'role', ''), 'observer')
  )
  on conflict (id) do nothing;
  return new;
exception
  when others then
    return new; -- Never block auth on trigger failure
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Recalculate confidence_avg and vote_count after a vote
create or replace function update_prediction_confidence()
returns trigger as $$
begin
  update predictions
  set
    confidence_avg = (
      select avg(confidence)::numeric(5,2)
      from votes
      where prediction_id = new.prediction_id
    ),
    vote_count = (
      select count(*)
      from votes
      where prediction_id = new.prediction_id
    )
  where id = new.prediction_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_vote_cast on votes;
create trigger on_vote_cast
  after insert or update on votes
  for each row execute function update_prediction_confidence();

-- Update analyst correct_predictions count on resolution
create or replace function update_analyst_stats()
returns trigger as $$
begin
  if new.status = 'resolved_correct' and old.status != 'resolved_correct' then
    update profiles
    set correct_predictions = correct_predictions + 1,
        total_predictions = total_predictions + 1
    where id = new.author_id;
  elsif new.status = 'resolved_incorrect' and old.status != 'resolved_incorrect' then
    update profiles
    set total_predictions = total_predictions + 1
    where id = new.author_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_prediction_resolved on predictions;
create trigger on_prediction_resolved
  after update on predictions
  for each row execute function update_analyst_stats();

-- Notify prediction author when someone votes on their prediction
create or replace function notify_on_vote()
returns trigger as $$
declare
  pred record;
  voter_name text;
begin
  select * into pred from predictions where id = new.prediction_id;
  if pred.author_id = new.voter_id then
    return new;
  end if;
  select display_name into voter_name from profiles where id = new.voter_id;
  insert into notifications (user_id, type, title, body, prediction_id)
  values (
    pred.author_id,
    'vote_received',
    'New signal on your prediction',
    coalesce(voter_name, 'An analyst') || ' voted ' || new.confidence || '% confidence',
    new.prediction_id
  );
  return new;
exception
  when others then return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_vote_notify on votes;
create trigger on_vote_notify
  after insert on votes
  for each row execute function notify_on_vote();

-- Notify prediction author when their prediction is resolved
create or replace function notify_on_resolution()
returns trigger as $$
begin
  if new.status in ('resolved_correct', 'resolved_incorrect')
     and old.status not in ('resolved_correct', 'resolved_incorrect') then
    insert into notifications (user_id, type, title, body, prediction_id)
    values (
      new.author_id,
      'prediction_resolved',
      case
        when new.status = 'resolved_correct' then 'Your prediction was confirmed ✅'
        else 'Your prediction was refuted ❌'
      end,
      new.title,
      new.id
    );
  end if;
  return new;
exception
  when others then return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_prediction_notify on predictions;
create trigger on_prediction_notify
  after update on predictions
  for each row execute function notify_on_resolution();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table profiles enable row level security;
alter table predictions enable row level security;
alter table votes enable row level security;
alter table comments enable row level security;
alter table notifications enable row level security;

-- Profiles: everyone can read, users can update their own
drop policy if exists "Profiles are viewable by everyone" on profiles;
create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Predictions: everyone can read, analysts can insert, authors can update
drop policy if exists "Predictions are viewable by everyone" on predictions;
create policy "Predictions are viewable by everyone"
  on predictions for select using (true);

drop policy if exists "Analysts can create predictions" on predictions;
create policy "Analysts can create predictions"
  on predictions for insert
  with check (
    auth.uid() = author_id and
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('analyst', 'admin')
    )
  );

drop policy if exists "Authors and admins can update predictions" on predictions;
create policy "Authors and admins can update predictions"
  on predictions for update
  using (
    auth.uid() = author_id or
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Votes: everyone can read, analysts can vote (once per prediction)
drop policy if exists "Votes are viewable by everyone" on votes;
create policy "Votes are viewable by everyone"
  on votes for select using (true);

drop policy if exists "Analysts can vote on predictions" on votes;
create policy "Analysts can vote on predictions"
  on votes for insert
  with check (
    auth.uid() = voter_id and
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('analyst', 'admin')
    )
  );

-- Comments: everyone can read, authenticated users can post
drop policy if exists "Comments are viewable by everyone" on comments;
create policy "Comments are viewable by everyone"
  on comments for select using (true);

drop policy if exists "Authenticated users can post comments" on comments;
create policy "Authenticated users can post comments"
  on comments for insert
  with check (auth.uid() = author_id);

drop policy if exists "Authors can delete their own comments" on comments;
create policy "Authors can delete their own comments"
  on comments for delete using (auth.uid() = author_id);

-- Notifications: users can only read and update their own
drop policy if exists "Users can read own notifications" on notifications;
create policy "Users can read own notifications"
  on notifications for select using (auth.uid() = user_id);

drop policy if exists "Users can update own notifications" on notifications;
create policy "Users can update own notifications"
  on notifications for update using (auth.uid() = user_id);

-- News: everyone can read, only admins can insert/update/delete
alter table news enable row level security;

drop policy if exists "News is viewable by everyone" on news;
create policy "News is viewable by everyone"
  on news for select using (true);

drop policy if exists "Admins can manage news" on news;
create policy "Admins can manage news"
  on news for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Events: everyone can read, only admins can insert/update/delete
alter table events enable row level security;

drop policy if exists "Events are viewable by everyone" on events;
create policy "Events are viewable by everyone"
  on events for select using (true);

drop policy if exists "Admins can manage events" on events;
create policy "Admins can manage events"
  on events for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
