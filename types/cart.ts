import { Product, ProductVariant, CustomizationOption } from "./product";

export interface CustomizationSelection {
  option_type: string;
  selected_value: string;
  selected_id?: string;
  price_modifier?: number;
}

export interface CartItem {
  id: string;
  customer_id: string;
  product_id: string;
  product_variant_id?: string;
  quantity: number;
  customization_data?: CustomizationSelection[];
  created_at: string;
  updated_at: string;
  // Relations
  product: Product;
  product_variant?: ProductVariant;
}

export interface CartSummary {
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  items_count: number;
}
