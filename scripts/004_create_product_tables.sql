-- Create categories table
create table if not exists public.categories (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table if not exists public.products (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null,
  category_id bigint references public.categories(id) on delete set null,
  images text[],
  sizes text[],
  colors text[],
  stock integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for categories and products
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Create policies for public read access
create policy "allow_public_read_categories" on public.categories for select using (true);
create policy "allow_public_read_products" on public.products for select using (true);

-- Create restrictive policies for write access (will be updated for admins later)
create policy "disallow_all_write_categories" on public.categories for all using (false) with check (false);
create policy "disallow_all_write_products" on public.products for all using (false) with check (false);


-- Insert sample data
-- Insert categories
insert into public.categories (name, slug) values
('Formal Suits', 'formal-suits'),
('Shirts', 'shirts'),
('Skirts', 'skirts'),
('Pants', 'pants'),
('Blazers', 'blazers'),
('Accessories', 'accessories');

-- Insert products
insert into public.products (name, slug, description, price, category_id, images, sizes, colors, stock) values
(
  'Elegant Navy Blue Business Blazer',
  'elegant-navy-blue-business-blazer',
  'A classic navy blue blazer, tailored for a professional and sharp look. Perfect for any business setting.',
  129.99,
  5, -- Blazers
  ARRAY['/elegant-navy-blue-business-blazer.png'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Navy Blue'],
  50
),
(
  'Professional Pencil Skirt Suit',
  'professional-pencil-skirt-suit',
  'This stylish pencil skirt suit offers a sleek silhouette and a commanding presence. Made with high-quality fabric for all-day comfort.',
  199.99,
  1, -- Formal Suits
  ARRAY['/professional-pencil-skirt-suit.png'],
  ARRAY['S', 'M', 'L'],
  ARRAY['Charcoal Grey', 'Black'],
  30
),
(
  'Modern Professional Pantsuit',
  'modern-professional-pantsuit',
  'A modern take on the classic pantsuit. Features a slim-fit design that is both comfortable and empowering.',
  219.99,
  1, -- Formal Suits
  ARRAY['/modern-professional-pantsuit.png'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black', 'White'],
  25
),
(
  'Elegant Business Suit on Mannequin',
  'elegant-business-suit-on-mannequin',
  'Showcase your professional style with this elegant business suit. A timeless piece for any wardrobe.',
  249.99,
  1, -- Formal Suits
  ARRAY['/elegant-business-suit-on-mannequin.png'],
  ARRAY['M', 'L', 'XL'],
  ARRAY['Light Grey'],
  15
);
