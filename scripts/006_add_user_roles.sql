-- Add a 'role' column to the profiles table
alter table public.profiles
add column if not exists role text default 'user';

-- Create a function to check if the current user is an admin.
-- This function will be used in RLS policies.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =================================================================
-- Update RLS policies on existing tables to grant admin privileges
-- =================================================================

-- PROFILES
-- Admins can select all profiles.
create policy "allow_admin_read_profiles"
  on public.profiles for select
  using (is_admin());

-- Admins can update any profile.
create policy "allow_admin_update_profiles"
  on public.profiles for update
  using (is_admin());


-- CATEGORIES
-- Drop the previous restrictive 'disallow' policy
drop policy if exists "disallow_all_write_categories" on public.categories;
-- Admins can perform any action on categories.
create policy "allow_admin_manage_categories" on public.categories for all
  using (is_admin());


-- PRODUCTS
-- Drop the previous restrictive 'disallow' policy
drop policy if exists "disallow_all_write_products" on public.products;
-- Admins can perform any action on products.
create policy "allow_admin_manage_products" on public.products for all
  using (is_admin());


-- ORDERS
-- Admins can select all orders.
create policy "allow_admin_read_orders" on public.orders for select
  using (is_admin());
-- Admins can update orders (e.g., change status).
create policy "allow_admin_update_orders" on public.orders for update
  using (is_admin());


-- ORDER_ITEMS
-- Admins can select all order items.
create policy "allow_admin_read_order_items" on public.order_items for select
  using (is_admin());
