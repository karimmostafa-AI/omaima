-- =========================================
-- Update existing tables and add functions
-- =========================================

-- Add color_images field to products table (from memory requirements)
alter table public.products 
add column if not exists color_images jsonb default '{}';

-- Add description field to categories table
alter table public.categories 
add column if not exists description text;

-- Create function to update updated_at timestamps
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers for updated_at timestamps
drop trigger if exists update_fabrics_updated_at on public.fabrics;
create trigger update_fabrics_updated_at
  before update on public.fabrics
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_customizations_updated_at on public.customizations;
create trigger update_customizations_updated_at
  before update on public.customizations
  for each row
  execute function public.update_updated_at_column();

-- Create function for generating share tokens
create or replace function public.generate_share_token()
returns text
language plpgsql
as $$
declare
  token text;
begin
  -- Generate a random 12-character token
  token := encode(gen_random_bytes(9), 'base64');
  -- Remove any characters that might cause URL issues
  token := replace(replace(replace(token, '/', ''), '+', ''), '=', '');
  return lower(token);
end;
$$;

-- Create function to automatically set share token on customization insert
create or replace function public.set_share_token()
returns trigger
language plpgsql
as $$
begin
  if new.share_token is null or new.share_token = '' then
    new.share_token := public.generate_share_token();
  end if;
  return new;
end;
$$;

-- Create trigger for automatic share token generation
drop trigger if exists set_customization_share_token on public.customizations;
create trigger set_customization_share_token
  before insert on public.customizations
  for each row
  execute function public.set_share_token();

-- Create function for price calculation
create or replace function public.calculate_customization_price(
  p_base_price numeric,
  p_fabric_price numeric,
  p_style_modifiers numeric[],
  p_accent_modifiers numeric[],
  p_price_modifier_ids bigint[] default array[]::bigint[]
)
returns jsonb
language plpgsql
as $$
declare
  total_style_price numeric := 0;
  total_accent_price numeric := 0;
  subtotal numeric;
  modifier_multiplier numeric := 1;
  modifier_fixed numeric := 0;
  final_total numeric;
  modifier record;
begin
  -- Calculate total style modifications
  if p_style_modifiers is not null then
    select coalesce(sum(unnest), 0) into total_style_price
    from unnest(p_style_modifiers);
  end if;
  
  -- Calculate total accent modifications
  if p_accent_modifiers is not null then
    select coalesce(sum(unnest), 0) into total_accent_price
    from unnest(p_accent_modifiers);
  end if;
  
  -- Calculate subtotal
  subtotal := p_base_price + p_fabric_price + total_style_price + total_accent_price;
  
  -- Apply price modifiers if any
  if p_price_modifier_ids is not null and array_length(p_price_modifier_ids, 1) > 0 then
    for modifier in 
      select modifier_value, fixed_amount 
      from public.price_modifiers 
      where id = any(p_price_modifier_ids) and is_active = true
    loop
      modifier_multiplier := modifier_multiplier * modifier.modifier_value;
      modifier_fixed := modifier_fixed + coalesce(modifier.fixed_amount, 0);
    end loop;
  end if;
  
  -- Calculate final total
  final_total := (subtotal * modifier_multiplier) + modifier_fixed;
  
  return jsonb_build_object(
    'base_price', p_base_price,
    'fabric_price', p_fabric_price,
    'style_price', total_style_price,
    'accent_price', total_accent_price,
    'subtotal', subtotal,
    'modifier_multiplier', modifier_multiplier,
    'modifier_fixed', modifier_fixed,
    'total_price', final_total
  );
end;
$$;

-- =====================================
-- Admin policies for customization tables
-- =====================================

-- Admin policies for fabrics
create policy "allow_admin_manage_fabrics" on public.fabrics for all
  using ((select exists(select 1 from profiles where id = auth.uid() and role = 'admin')));

-- Admin policies for style_options
create policy "allow_admin_manage_style_options" on public.style_options for all
  using ((select exists(select 1 from profiles where id = auth.uid() and role = 'admin')));

-- Admin policies for accent_options
create policy "allow_admin_manage_accent_options" on public.accent_options for all
  using ((select exists(select 1 from profiles where id = auth.uid() and role = 'admin')));

-- Admin policies for price_modifiers
create policy "allow_admin_manage_price_modifiers" on public.price_modifiers for all
  using ((select exists(select 1 from profiles where id = auth.uid() and role = 'admin')));

-- Admin read access to all customizations and saved designs
create policy "allow_admin_read_all_customizations" on public.customizations for select
  using ((select exists(select 1 from profiles where id = auth.uid() and role = 'admin')));

create policy "allow_admin_read_all_saved_designs" on public.saved_designs for select
  using ((select exists(select 1 from profiles where id = auth.uid() and role = 'admin')));

create policy "allow_admin_read_all_design_shares" on public.design_shares for select
  using ((select exists(select 1 from profiles where id = auth.uid() and role = 'admin')));