-- Create order_status enum type
create type public.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'canceled');

-- Create orders table
create table if not exists public.orders (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  total_price numeric(10, 2) not null,
  status public.order_status not null default 'pending',
  shipping_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_items table
create table if not exists public.order_items (
  id bigserial primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  product_id bigint references public.products(id) on delete set null,
  quantity integer not null,
  price numeric(10, 2) not null -- Price at time of purchase
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for orders: Allow users to read their own orders.
-- Write access will be handled by server-side logic with elevated privileges.
create policy "allow_users_to_read_own_orders" on public.orders for select using (auth.uid() = user_id);

-- Policies for order_items: Allow users to read items of orders they own.
create policy "allow_users_to_read_own_order_items" on public.order_items for select using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id and orders.user_id = auth.uid()
  )
);
