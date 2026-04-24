-- Supabase Schema for ScheduleMe
-- Run this SQL in the Supabase SQL editor to set up the database

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  deadline date,
  daily_hours real,
  preferred_days text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Files table
create table if not exists files (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  size integer,
  analysis jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chapters table
create table if not exists chapters (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  file_id uuid references files on delete cascade,
  index integer not null,
  title text not null,
  pages real not null,
  page_start real,
  page_end real,
  type text,
  priority text,
  color text,
  skip boolean default false,
  custom_hours real,
  has_table boolean default false,
  has_chart boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sessions table (study schedule sessions)
create table if not exists sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  chapter_title text not null,
  file_name text not null,
  hours real not null,
  priority text,
  color text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Exams table (for persisting exams/milestones)
create table if not exists exams (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table files enable row level security;
alter table chapters enable row level security;
alter table sessions enable row level security;
alter table exams enable row level security;

-- Policies: Users can only access their own data

-- Profiles
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

-- Files
create policy "Users can view their own files" on files
  for select using (auth.uid() = user_id);

create policy "Users can insert their own files" on files
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own files" on files
  for update using (auth.uid() = user_id);

create policy "Users can delete their own files" on files
  for delete using (auth.uid() = user_id);

-- Chapters
create policy "Users can view their own chapters" on chapters
  for select using (auth.uid() = user_id);

create policy "Users can insert their own chapters" on chapters
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own chapters" on chapters
  for update using (auth.uid() = user_id);

create policy "Users can delete their own chapters" on chapters
  for delete using (auth.uid() = user_id);

-- Sessions
create policy "Users can view their own sessions" on sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own sessions" on sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own sessions" on sessions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own sessions" on sessions
  for delete using (auth.uid() = user_id);

-- Exams
create policy "Users can view their own exams" on exams
  for select using (auth.uid() = user_id);

create policy "Users can insert their own exams" on exams
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own exams" on exams
  for update using (auth.uid() = user_id);

create policy "Users can delete their own exams" on exams
  for delete using (auth.uid() = user_id);