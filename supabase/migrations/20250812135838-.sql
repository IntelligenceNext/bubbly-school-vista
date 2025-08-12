-- Create RBAC core tables and seed permissions so RoleForm can display per-entity actions
-- 1) Tables
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_system_role boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

-- 2) RLS
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;

-- Only administrators can manage/select RBAC data
-- Using restrictive policies to avoid accidental permissive access
create policy "Only administrators manage roles"
  on public.roles
  as restrictive
  for all
  to authenticated
  using (current_has_role('administrator'::app_role))
  with check (current_has_role('administrator'::app_role));

create policy "Only administrators manage permissions"
  on public.permissions
  as restrictive
  for all
  to authenticated
  using (current_has_role('administrator'::app_role))
  with check (current_has_role('administrator'::app_role));

create policy "Only administrators manage role_permissions"
  on public.role_permissions
  as restrictive
  for all
  to authenticated
  using (current_has_role('administrator'::app_role))
  with check (current_has_role('administrator'::app_role));

-- 3) Updated-at trigger on roles (uses existing function public.set_updated_at)
create trigger set_roles_updated_at
before update on public.roles
for each row execute function public.set_updated_at();

-- 4) Seed comprehensive permissions across entities and actions
-- Define actions and entities; generate combinations. Avoid duplicates.
with actions as (
  select unnest(array[
    'read','write','view','update','assign','assign_to','append','append_to'
  ]) as action
), entities as (
  select unnest(array[
    -- Academic
    'Attendance','Class Sections','Class Timetable','Academic Dashboard','Event','Homework','Live Classes','Medium','Noticeboard','Staff Rating','Student Birthdays','Student Leaves','Study Materials','Subjects',
    -- Lessons
    'Lessons','Chapters',
    -- Library
    'Library Dashboard','All Books','Books Issued','Library Cards',
    -- Hostel
    'Hostel Dashboard','Hostels','Rooms',
    -- Transportation
    'Transportation Dashboard','Routes','Vehicles','Transportation Report',
    -- Accounting
    'Accounting Dashboard','Fee Types','Fee Invoices','Collect Payments','Expenses','Income','Invoices Report','Bulk Invoice Prints',
    -- Activities
    'Activities Dashboard','Activities','Activity Categories','Participation','Activity Reports',
    -- Administrator
    'Admins','Administrator Dashboard','Staff Attendance','Staff Leaves','Staff List','Roles',
    -- School Management
    'School Management Dashboard','Schools','Classes','Sessions','SM Settings',
    -- School
    'School Dashboard','Create Inquiry','Inquiries','Logs','School Settings',
    -- Student
    'Student Dashboard','Admission','Certificates','ID Cards','Notifications','Promote','Students','Transfer Student',
    -- Tickets
    'Tickets Dashboard','Tickets'
  ]) as entity
)
insert into public.permissions (name, category, description)
select initcap(a.action) || ' ' || e.entity as name,
       e.entity as category,
       initcap(a.action) || ' permission on ' || e.entity
from actions a
cross join entities e
where not exists (
  select 1 from public.permissions p
  where p.name = initcap(a.action) || ' ' || e.entity and p.category = e.entity
);
