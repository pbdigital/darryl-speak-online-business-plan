-- Create business_plans table
create table public.business_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  year integer not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  -- Ensure one plan per user per year
  unique(user_id, year)
);

-- Create plan_sections table (stores section data as JSONB)
create table public.plan_sections (
  id uuid default gen_random_uuid() primary key,
  business_plan_id uuid references public.business_plans on delete cascade not null,
  section_key text not null,
  data jsonb default '{}'::jsonb not null,
  updated_at timestamptz default now() not null,

  -- Ensure one section per plan per key
  unique(business_plan_id, section_key)
);

-- Enable Row Level Security
alter table public.business_plans enable row level security;
alter table public.plan_sections enable row level security;

-- Business Plans RLS Policies
create policy "Users can view own plans"
  on public.business_plans for select
  using (auth.uid() = user_id);

create policy "Users can create own plans"
  on public.business_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plans"
  on public.business_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete own plans"
  on public.business_plans for delete
  using (auth.uid() = user_id);

-- Plan Sections RLS Policies (access via business_plan ownership)
create policy "Users can view own plan sections"
  on public.plan_sections for select
  using (
    exists (
      select 1 from public.business_plans
      where business_plans.id = plan_sections.business_plan_id
      and business_plans.user_id = auth.uid()
    )
  );

create policy "Users can create own plan sections"
  on public.plan_sections for insert
  with check (
    exists (
      select 1 from public.business_plans
      where business_plans.id = plan_sections.business_plan_id
      and business_plans.user_id = auth.uid()
    )
  );

create policy "Users can update own plan sections"
  on public.plan_sections for update
  using (
    exists (
      select 1 from public.business_plans
      where business_plans.id = plan_sections.business_plan_id
      and business_plans.user_id = auth.uid()
    )
  );

create policy "Users can delete own plan sections"
  on public.plan_sections for delete
  using (
    exists (
      select 1 from public.business_plans
      where business_plans.id = plan_sections.business_plan_id
      and business_plans.user_id = auth.uid()
    )
  );

-- Updated_at triggers
create trigger business_plans_updated_at
  before update on public.business_plans
  for each row execute procedure public.handle_updated_at();

create trigger plan_sections_updated_at
  before update on public.plan_sections
  for each row execute procedure public.handle_updated_at();

-- Create indexes for common queries
create index business_plans_user_id_idx on public.business_plans(user_id);
create index business_plans_year_idx on public.business_plans(year);
create index plan_sections_business_plan_id_idx on public.plan_sections(business_plan_id);
create index plan_sections_section_key_idx on public.plan_sections(section_key);
