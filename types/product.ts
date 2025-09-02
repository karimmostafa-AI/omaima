export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Color {
  id: string;
  name: string;
  hex_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Size {
  id: string;
  name: string;
  category?: string;
  measurements?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  name: string;
  description?: string;
  composition?: string;
  care_instructions?: string;
  price_modifier: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_id?: string;
  size_id?: string;
  material_id?: string;
  sku?: string;
  price_adjustment: number;
  stock_quantity: number;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  color?: Color;
  size?: Size;
  material?: Material;
}

export interface CustomizationOption {
  type: 'fabric' | 'style' | 'color' | 'size' | 'buttons' | 'lining';
  label: string;
  options: Array<{
    id: string;
    name: string;
    price_modifier?: number;
    image_url?: string;
  }>;
  required: boolean;
  multiple_selection?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  short_description?: string;
  price: number;
  discount_price?: number;
  category_id?: string;
  brand_id?: string;
  stock_quantity: number;
  min_quantity: number;
  is_customizable: boolean;
  customization_options?: CustomizationOption[];
  images: string[];
  tags: string[];
  weight?: number;
  dimensions?: Record<string, any>;
  is_active: boolean;
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
  brand?: Brand;
  variants?: ProductVariant[];
}
