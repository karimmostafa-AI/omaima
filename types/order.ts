import { Product, ProductVariant } from './product';
import { Address, Customer } from './user';
import { CustomizationSelection } from './cart';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'ready_for_pickup'
  | 'on_the_way' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded' 
  | 'partially_refunded';

export type PaymentMethod = 
  | 'stripe' 
  | 'paypal' 
  | 'razorpay' 
  | 'cash_on_delivery' 
  | 'bank_transfer';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  billing_address_id?: string;
  shipping_address_id?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  coupon_id?: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  notes?: string;
  special_instructions?: string;
  estimated_delivery_date?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  customer?: Customer;
  billing_address?: Address;
  shipping_address?: Address;
  items?: OrderItem[];
  payments?: Payment[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customization_data?: CustomizationSelection[];
  created_at: string;
  updated_at: string;
  // Relations
  product: Product;
  product_variant?: ProductVariant;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  amount: number;
  transaction_id?: string;
  gateway_response?: Record<string, any>;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderSummary {
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  estimated_delivery_date?: string;
}

export interface CreateOrderRequest {
  billing_address_id: string;
  shipping_address_id: string;
  payment_method: PaymentMethod;
  coupon_code?: string;
  notes?: string;
  special_instructions?: string;
}

export interface OrderStatusUpdate {
  order_status: OrderStatus;
  notes?: string;
  tracking_number?: string;
}
