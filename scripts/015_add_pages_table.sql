-- Create pages table for admin-managed custom pages
create table if not exists public.pages (
  id bigint primary key generated always as identity,
  title text not null,
  slug text not null unique,
  content text,
  meta_description text,
  show_in_navigation boolean default false,
  navigation_order integer default 0,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.pages enable row level security;

-- Create policies
create policy "Allow public read access" on public.pages for select using (is_published = true);
create policy "Allow admin full access" on public.pages for all using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists handle_pages_updated_at on public.pages;
create trigger handle_pages_updated_at
  before update on public.pages
  for each row
  execute function public.handle_updated_at();

-- Add some sample pages
insert into public.pages (title, slug, content, meta_description, show_in_navigation, navigation_order, is_published) values
('Size Guide', 'size-guide', '<h1>Size Guide</h1><p>Find your perfect fit with our comprehensive size guide.</p><h2>Measurements</h2><p>For the most accurate fit, please measure yourself using the guidelines below.</p>', 'Complete size guide for professional wear and uniforms', true, 1, true),
('Custom Orders', 'custom-orders', '<h1>Custom Orders</h1><p>We offer bespoke tailoring services for your specific needs.</p><h2>Process</h2><p>Our custom order process ensures you get exactly what you need.</p>', 'Learn about our custom order and tailoring services', true, 2, true),
('Care Instructions', 'care-instructions', '<h1>Care Instructions</h1><p>Proper care ensures your professional wear lasts longer and looks its best.</p><h2>Washing</h2><p>Follow these guidelines to maintain fabric quality.</p>', 'How to care for your professional wear and uniforms', true, 3, true);